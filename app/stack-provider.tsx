'use client';

import { StackProvider, StackTheme, StackClientApp } from '@stackframe/stack';
import { useMemo } from 'react';

export default function StackAuthProvider({ children }: { children: React.ReactNode }) {
  const stackApp = useMemo(() => new StackClientApp({
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
    publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
    tokenStore: 'nextjs-cookie',
  }), []);

  return (
    <StackProvider app={stackApp}>
      <StackTheme>
        {children}
      </StackTheme>
    </StackProvider>
  );
}