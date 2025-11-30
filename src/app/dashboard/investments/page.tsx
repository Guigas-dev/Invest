'use client';

import Link from 'next/link';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import type { Investment } from '@/lib/types';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function getBadgeVariant(type: Investment['type']) {
  switch (type) {
    case 'Ações':
      return 'default';
    case 'FIIs':
      return 'secondary';
    case 'Criptomoedas':
      return 'destructive';
    case 'Renda Fixa':
      return 'outline';
    default:
      return 'secondary';
  }
}

export default function InvestmentsPage() {
    const firestore = useFirestore();
    const { user } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null);
  
    const investmentsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'investments');
    }, [user, firestore]);

    const { data: investments, isLoading } = useCollection<Investment>(investmentsQuery);

    const openDeleteDialog = (id: string) => {
        setSelectedInvestmentId(id);
        setIsDeleteDialogOpen(true);
    }

    const handleDelete = async () => {
        if (!user || !firestore || !selectedInvestmentId) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Não foi possível excluir o ativo.',
            });
            return;
        };

        try {
            const docRef = doc(firestore, 'users', user.uid, 'investments', selectedInvestmentId);
            await deleteDoc(docRef);
            toast({
                title: 'Ativo Excluído!',
                description: 'Seu ativo foi removido da carteira.',
            });
        } catch (error) {
            console.error("Error deleting investment: ", error);
            toast({
                variant: 'destructive',
                title: 'Oh, não! Algo deu errado.',
                description: 'Não foi possível excluir o ativo. Tente novamente.',
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedInvestmentId(null);
        }
    }


  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Meus Investimentos</CardTitle>
            <CardDescription>
              Acompanhe e gerencie todos os seus ativos em um só lugar.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="gap-1">
            <Link href="/dashboard/investments/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Adicionar Ativo
              </span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
              <TableHead className="text-right">Preço Médio</TableHead>
              <TableHead className="text-right">Valor Atual</TableHead>
              <TableHead className="text-right">Rentabilidade</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center">Carregando seus investimentos...</TableCell>
                </TableRow>
            )}
            {!isLoading && investments?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                        <p>Você ainda não tem nenhum ativo.</p>
                        <Button variant="link" asChild><Link href="/dashboard/investments/new">Adicione seu primeiro ativo</Link></Button>
                    </TableCell>
                </TableRow>
            )}
            {investments?.map((investment) => {
              const totalInvested = investment.purchasePrice * investment.quantity;
              // currentPrice might not be available in all scenarios, fallback to purchasePrice
              const currentPrice = investment.currentPrice ?? investment.purchasePrice;
              const currentValue = currentPrice * investment.quantity;
              const profit = currentValue - totalInvested;
              const profitPercentage = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
              
              return (
              <TableRow key={investment.id}>
                <TableCell className="font-medium">{investment.name}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(investment.type)}>
                    {investment.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{investment.quantity.toLocaleString('pt-BR')}</TableCell>
                <TableCell className="text-right">
                  {investment.purchasePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
                <TableCell className="text-right">
                  {currentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
                <TableCell className={`text-right font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profitPercentage.toFixed(2)}%
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/investments/${investment.id}/edit`}>Editar</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDeleteDialog(investment.id)}>Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
     <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o
              seu ativo e removerá os dados dos nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
