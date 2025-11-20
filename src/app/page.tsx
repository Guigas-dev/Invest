'use client';

import { useUser } from '@/firebase';
import { redirect } from 'next/navigation';

export default function Home() {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if(user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
