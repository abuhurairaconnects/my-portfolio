import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin Control Center | Abu Huraira',
  description: 'Administrative console for managing portfolio inquiries, production projects, and system telemetry.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminShell />;
}
