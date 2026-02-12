'use client';


import GameHub from '@/components/games/GameHub';
import AppShell from '@/components/layout/AppShell';

export default function HubPage() {
  return (
    <AppShell>
      <GameHub />
    </AppShell>
  );
}
