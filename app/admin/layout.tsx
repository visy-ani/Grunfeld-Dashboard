'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for the admin flag.
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.push('/auth/admin-login');
      setAuthorized(false);
      setLoading(false);
    } else {
      setAuthorized(true);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: '#0a0a0a', color: 'white' }}>
        Loading admin panel...
      </div>
    );
  }

  if (!authorized) {
    // When not authorized, the redirect is in progress.
    return null;
  }

  return <>{children}</>;
}
