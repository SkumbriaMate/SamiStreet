import { AdminLayout } from '@/admin/AdminLayout';
import type { ReactNode } from 'react';

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
