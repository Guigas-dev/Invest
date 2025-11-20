'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons';

const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    if (auth) {
      try {
        await signInWithPopup(auth, provider);
        router.push('/dashboard');
      } catch (error) {
        console.error('Error signing in with Google', error);
      }
    }
  };

  if (loading || user) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Logo className="h-16 w-16 mb-4 animate-pulse" />
            <p className="text-muted-foreground">Carregando...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Logo className="mx-auto h-12 w-12 mb-4" />
          <CardTitle className="text-2xl">Bem-vindo!</CardTitle>
          <CardDescription>
            Entre com sua conta do Google para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleSignIn}>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 62.3l-68.6 68.6c-20.5-19.1-46.9-30.8-76.7-30.8-59.9 0-108.4 48.5-108.4 108.4s48.5 108.4 108.4 108.4c63.8 0 99.6-43.2 103.2-66.3H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
            Entrar com o Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
