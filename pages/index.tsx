import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  // Automatically redirect to the dashboard
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="text-2xl font-bold">Loading dashboard...</div>
        </div>
      </div>
    </div>
  );
}