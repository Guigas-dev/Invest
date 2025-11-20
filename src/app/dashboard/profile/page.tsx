'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!user) {
    // This should be handled by the layout, but as a fallback
    router.push('/login');
    return null;
  }

  const handleSignOut = async () => {
    if (auth) {
        await auth.signOut();
        router.push('/login');
    }
  };


  return (
    <div className="mx-auto grid max-w-2xl flex-1 auto-rows-max gap-4">
      <Card>
        <CardHeader className="items-center">
            <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} data-ai-hint="person avatar" />
                <AvatarFallback className="text-3xl">{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
          <CardTitle className="text-2xl">{user.displayName}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
          {/* riskProfile is not on the user object by default */}
          {/* {user.riskProfile && <Badge className="mt-2">{user.riskProfile}</Badge>} */}
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" defaultValue={user.displayName ?? ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" defaultValue={user.email ?? ''} disabled />
            </div>
            <Button type="submit" className="w-full">Salvar Alterações</Button>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button variant="destructive" className="w-full" onClick={handleSignOut}>Sair da Conta</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
