'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStackApp, useUser } from '@stackframe/stack';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const app = useStackApp();
  const user = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    // If not logged in, redirect to Stack Auth
    if (user === null) {
      app.redirectToSignIn();
      return;
    }

    // Check if user is admin (only once)
    if (user && !hasChecked.current) {
      hasChecked.current = true;
      fetch('/api/user/role')
        .then(res => res.json())
        .then(data => {
          console.log('Admin layout - role check:', data);
          if (data.role === 'admin') {
            setIsAuthorized(true);
          } else {
            console.log('Not admin, redirecting to home');
            router.push('/');
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error checking admin role:', err);
          router.push('/');
          setIsLoading(false);
        });
    }
  }, [user, app, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Checking authorization...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Not authorized - Admin access required</div>
      </div>
    );
  }

  return <>{children}</>;
}