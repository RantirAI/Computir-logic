import { Key, Lock, Palette } from 'lucide-react';

import SidebarLayout from '@/app/components/sidebar-layout';

const iconSize = 20;

const sidebarNavItems = [
  {
    title: 'Branding',
    href: '/platform/settings/branding',
    icon: <Palette size={iconSize} />,
  },
  {
    title: 'API Keys',
    href: '/platform/api-keys',
    icon: <Key size={iconSize} />,
  },
  {
    title: 'Signing Keys',
    href: '/platform/signing-keys',
    icon: <Lock size={iconSize} />,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function PlatformSettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <SidebarLayout title="Settings" items={sidebarNavItems}>
      {children}
    </SidebarLayout>
  );
}