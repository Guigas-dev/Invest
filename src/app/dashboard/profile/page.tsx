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
import { mockUser } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  return (
    <div className="mx-auto grid max-w-2xl flex-1 auto-rows-max gap-4">
      <Card>
        <CardHeader className="items-center">
            <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} data-ai-hint="person avatar" />
                <AvatarFallback className="text-3xl">{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          <CardTitle className="text-2xl">{mockUser.name}</CardTitle>
          <CardDescription>{mockUser.email}</CardDescription>
          {mockUser.riskProfile && <Badge className="mt-2">{mockUser.riskProfile}</Badge>}
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" defaultValue={mockUser.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" defaultValue={mockUser.email} disabled />
            </div>
            <Button type="submit" className="w-full">Salvar Alterações</Button>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button variant="destructive" className="w-full">Sair da Conta</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
