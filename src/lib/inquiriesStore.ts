import fs from 'fs';
import path from 'path';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: 'new' | 'replied' | 'archived';
  budget?: string;
  timeline?: string;
  serviceType?: string;
  inquiryType?: 'contact' | 'hire';
}

function getDataDir(): string {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  const cwd = process.cwd();
  if (cwd.includes('.next/standalone')) {
    return path.join(path.resolve(cwd.split('.next/standalone')[0]), 'data');
  }
  return path.join(cwd, 'data');
}

function getInquiriesFilePath(): string {
  return path.join(getDataDir(), 'inquiries.json');
}

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-001',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.mansoor@gulftech.co',
    message: 'Salam Abu Huraira. We saw your Madrasa Management System and were impressed by the clean Next.js 15 architecture and automated PDF generation. We want to commission an educational management portal for our Islamic institute in the UAE. Are you available for a 4-week sprint?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    status: 'new',
    budget: '$3,000 - $5,000',
  },
  {
    id: 'inq-002',
    name: 'Mahbubur Rahman',
    email: 'mahbub@agroflowbd.com',
    message: 'Hello Abu Huraira, we run 12 commercial fisheries in Mymensingh. Typing feed logs manually on phones with wet hands has been a recurring headache for our pond workers. We want to deploy your Smart Bangla Voice Farm Accountant across our field teams. Let us discuss integration details.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: 'replied',
    budget: 'Enterprise License + Retainer',
  },
  {
    id: 'inq-003',
    name: 'David Vance',
    email: 'david@vance-media.io',
    message: 'Hi Abu Huraira. I came across your portfolio through your zero-AI-slop manifesto and As-Sunnah ethical grounding. We need a senior Full-Stack engineer to build our client onboarding dashboard with Next.js and Prisma. We prefer Docker-ready code with no vendor lock-in.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    status: 'replied',
    budget: '$40/hr Contract',
  },
];

function ensureDataFile() {
  try {
    const dir = getDataDir();
    const file = getInquiriesFilePath();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(INITIAL_INQUIRIES, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[inquiriesStore] Error ensuring data file:', err);
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  try {
    ensureDataFile();
    const data = fs.readFileSync(getInquiriesFilePath(), 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[inquiriesStore] Error reading inquiries:', err);
    return INITIAL_INQUIRIES;
  }
}

export async function saveInquiry(inquiry: Omit<Inquiry, 'id' | 'timestamp' | 'status'>): Promise<Inquiry> {
  ensureDataFile();
  const current = await getInquiries();
  const newInquiry: Inquiry = {
    ...inquiry,
    id: `inq-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
    status: 'new',
  };
  const updated = [newInquiry, ...current].slice(0, 200);
  try {
    fs.writeFileSync(getInquiriesFilePath(), JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('[inquiriesStore] Error writing inquiries:', err);
  }
  return newInquiry;
}

export async function updateInquiryStatus(id: string, status: 'new' | 'replied' | 'archived'): Promise<boolean> {
  ensureDataFile();
  const current = await getInquiries();
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return false;
  current[index].status = status;
  try {
    fs.writeFileSync(getInquiriesFilePath(), JSON.stringify(current, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[inquiriesStore] Error updating inquiry status:', err);
    return false;
  }
}

export async function deleteInquiry(id: string): Promise<boolean> {
  ensureDataFile();
  const current = await getInquiries();
  const filtered = current.filter((item) => item.id !== id);
  if (filtered.length === current.length) return false;
  try {
    fs.writeFileSync(getInquiriesFilePath(), JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[inquiriesStore] Error deleting inquiry:', err);
    return false;
  }
}
