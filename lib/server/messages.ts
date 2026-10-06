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

const MESSAGES_FILE = path.join(process.cwd(), "data", "messages.json");

export async function getMessages(): Promise<ContactMessage[]> {
  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return [];
  } catch {
    return [];
  }
}

export async function saveMessage(
  data: Omit<ContactMessage, "id" | "createdAt" | "read">
): Promise<ContactMessage> {
  const current = await getMessages();
  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: data.name,
    email: data.email,
    message: data.message,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const updated = [newMessage, ...current];
  await fs.mkdir(path.dirname(MESSAGES_FILE), { recursive: true });
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return newMessage;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const current = await getMessages();
  const filtered = current.filter((m) => m.id !== id);
  if (filtered.length !== current.length) {
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  }
  return false;
}

export async function markMessageRead(id: string, read: boolean = true): Promise<boolean> {
  const current = await getMessages();
  const target = current.find((m) => m.id === id);
  if (target) {
    target.read = read;
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(current, null, 2), "utf-8");
    return true;
  }
  return false;
}
