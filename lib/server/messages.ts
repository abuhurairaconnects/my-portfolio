import fs from "fs/promises";
import path from "path";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const LOCAL_MESSAGES_FILE = path.join(process.cwd(), "data", "messages.json");
const TMP_MESSAGES_FILE = "/tmp/messages.json";
const TMP_STATUS_FILE = "/tmp/message-status.json";

async function readFileSafe(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

async function writeFileSafe(filePath: string, content: string): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, "utf-8");
    return true;
  } catch {
    return false;
  }
}

async function getStatusMap(): Promise<{ read: Record<string, boolean>; deleted: Record<string, boolean> }> {
  const content = await readFileSafe(TMP_STATUS_FILE);
  if (content) {
    try {
      return JSON.parse(content);
    } catch {
      // fallback
    }
  }
  return { read: {}, deleted: {} };
}

async function saveStatusMap(status: { read: Record<string, boolean>; deleted: Record<string, boolean> }): Promise<void> {
  await writeFileSafe(TMP_STATUS_FILE, JSON.stringify(status, null, 2));
}

function parseResendEmailText(text: string): { name: string; email: string; message: string } {
  const nameMatch = text.match(/Name:\s*(.+)/i);
  const emailMatch = text.match(/Email:\s*(.+)/i);
  const messageMatch = text.match(/Message:\s*([\s\S]+)/i);

  return {
    name: nameMatch ? nameMatch[1].trim() : "",
    email: emailMatch ? emailMatch[1].trim() : "",
    message: messageMatch ? messageMatch[1].trim() : text.trim(),
  };
}

async function fetchResendInquiries(): Promise<ContactMessage[]> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return [];

  try {
    const listRes = await fetch("https://api.resend.com/emails", {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (!listRes.ok) return [];

    const json = await listRes.json();
    const emails: any[] = json.data || [];

    // Filter for portfolio inquiries (exclude test diagnostics)
    const inquiryEmails = emails.filter(
      (e) => e.subject && e.subject.toLowerCase().includes("portfolio") && !e.subject.toLowerCase().includes("verification")
    );

    // Fetch details for the latest 15 inquiries in parallel
    const details = await Promise.allSettled(
      inquiryEmails.slice(0, 15).map(async (e) => {
        const itemRes = await fetch(`https://api.resend.com/emails/${e.id}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          cache: "no-store",
        });
        if (!itemRes.ok) return null;
        return itemRes.json();
      })
    );

    const messages: ContactMessage[] = [];
    for (let i = 0; i < details.length; i++) {
      const result = details[i];
      if (result.status === "fulfilled" && result.value) {
        const item = result.value;
        const parsed = parseResendEmailText(item.text || "");
        const replyTo = Array.isArray(item.reply_to) ? item.reply_to[0] : "";
        const senderName = parsed.name || (item.subject ? item.subject.replace(/New inquiry from /i, "").replace(/ \(Portfolio\)/i, "") : "Visitor");

        messages.push({
          id: item.id || `resend-${i}`,
          name: senderName,
          email: parsed.email || replyTo || "No email",
          message: parsed.message || item.text || "Direct inquiry received",
          createdAt: item.created_at || new Date().toISOString(),
          read: false,
        });
      }
    }

    return messages;
  } catch (err) {
    console.warn("Failed to fetch messages from Resend:", err);
    return [];
  }
}

export async function getMessages(): Promise<ContactMessage[]> {
  const statusMap = await getStatusMap();
  const allMap = new Map<string, ContactMessage>();

  // 1. Load from static data file (local dev or bundled build)
  const localRaw = await readFileSafe(LOCAL_MESSAGES_FILE);
  if (localRaw) {
    try {
      const parsed = JSON.parse(localRaw);
      if (Array.isArray(parsed)) {
        for (const m of parsed) {
          allMap.set(m.id, m);
        }
      }
    } catch {
      // ignore
    }
  }

  // 2. Load from /tmp (persisted during serverless container life)
  const tmpRaw = await readFileSafe(TMP_MESSAGES_FILE);
  if (tmpRaw) {
    try {
      const parsed = JSON.parse(tmpRaw);
      if (Array.isArray(parsed)) {
        for (const m of parsed) {
          allMap.set(m.id, m);
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Sync live inquiries from Resend API (permanent cloud storage for Vercel)
  const resendMessages = await fetchResendInquiries();
  for (const rm of resendMessages) {
    // Check if duplicate of an existing message by content or ID
    const exists = Array.from(allMap.values()).some(
      (existing) =>
        existing.id === rm.id ||
        (existing.email === rm.email && existing.message === rm.message)
    );

    if (!exists) {
      allMap.set(rm.id, rm);
    }
  }

  // 4. Apply read and deleted status
  const finalMessages: ContactMessage[] = [];
  for (const [id, msg] of allMap.entries()) {
    if (statusMap.deleted[id]) continue;
    if (statusMap.read[id] !== undefined) {
      msg.read = statusMap.read[id];
    }
    finalMessages.push(msg);
  }

  return finalMessages.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveMessage(
  data: Omit<ContactMessage, "id" | "createdAt" | "read">
): Promise<ContactMessage> {
  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: data.name,
    email: data.email,
    message: data.message,
    createdAt: new Date().toISOString(),
    read: false,
  };

  // Try writing locally
  const currentLocalRaw = await readFileSafe(LOCAL_MESSAGES_FILE);
  let localList: ContactMessage[] = [];
  if (currentLocalRaw) {
    try {
      localList = JSON.parse(currentLocalRaw);
    } catch {}
  }
  await writeFileSafe(LOCAL_MESSAGES_FILE, JSON.stringify([newMessage, ...localList], null, 2));

  // Also write to /tmp for serverless
  const currentTmpRaw = await readFileSafe(TMP_MESSAGES_FILE);
  let tmpList: ContactMessage[] = [];
  if (currentTmpRaw) {
    try {
      tmpList = JSON.parse(currentTmpRaw);
    } catch {}
  }
  await writeFileSafe(TMP_MESSAGES_FILE, JSON.stringify([newMessage, ...tmpList], null, 2));

  return newMessage;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const statusMap = await getStatusMap();
  statusMap.deleted[id] = true;
  await saveStatusMap(statusMap);

  // Also remove from local and tmp if present
  const currentLocalRaw = await readFileSafe(LOCAL_MESSAGES_FILE);
  if (currentLocalRaw) {
    try {
      const localList: ContactMessage[] = JSON.parse(currentLocalRaw);
      const filtered = localList.filter((m) => m.id !== id);
      await writeFileSafe(LOCAL_MESSAGES_FILE, JSON.stringify(filtered, null, 2));
    } catch {}
  }

  return true;
}

export async function markMessageRead(id: string, read: boolean = true): Promise<boolean> {
  const statusMap = await getStatusMap();
  statusMap.read[id] = read;
  await saveStatusMap(statusMap);

  // Also update local and tmp if present
  const currentLocalRaw = await readFileSafe(LOCAL_MESSAGES_FILE);
  if (currentLocalRaw) {
    try {
      const localList: ContactMessage[] = JSON.parse(currentLocalRaw);
      const target = localList.find((m) => m.id === id);
      if (target) {
        target.read = read;
        await writeFileSafe(LOCAL_MESSAGES_FILE, JSON.stringify(localList, null, 2));
      }
    } catch {}
  }

  return true;
}
