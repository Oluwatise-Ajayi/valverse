'use client';

import QuizGateway from '@/components/games/quiz/QuizGateway';
import AppShell from '@/components/layout/AppShell';

export default function QuizPage() {
  return (
    <AppShell>
      <QuizGateway />
    </AppShell>
  );
}
