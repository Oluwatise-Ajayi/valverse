'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchUser, isAuthenticated } = useAuthStore();
  const { fetchProgress } = useGameStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProgress();
    }
  }, [isAuthenticated, fetchProgress]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {children}
    </main>
  );
}
