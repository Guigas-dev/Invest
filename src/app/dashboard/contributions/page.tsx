'use client';

import React from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Investment } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type GroupedInvestments = {
  [key: string]: Investment[];
};

export default function ContributionsPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const investmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'investments');
  }, [user, firestore]);

  const { data: investments, isLoading } = useCollection<Investment>(investmentsQuery);

  const groupedInvestments = React.useMemo(() => {
    if (!investments) return {};

    return investments
        .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
        .reduce((acc, investment) => {
        const monthYear = format(parseISO(investment.purchaseDate), "MMMM 'de' yyyy", { locale: ptBR });
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(investment);
        return acc;
      }, {} as GroupedInvestments);
  }, [investments]);

  const sortedMonths = Object.keys(groupedInvestments).sort((a, b) => {
    const dateA = new Date(a.split(' de ')[1], ptBR.localize?.month(ptBR.months.findIndex(m => m === a.split(' de ')[0])) as any);
    const dateB = new Date(b.split(' de ')[1], ptBR.localize?.month(ptBR.months.findIndex(m => m === b.split(' de ')[0])) as any);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Aportes</CardTitle>
          <CardDescription>Acompanhe todos os seus aportes mensais em um só lugar.</CardDescription>
        </CardHeader>
      </Card>

      {isLoading && (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
      )}

      {!isLoading && sortedMonths.length === 0 && (
         <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
                <p>Nenhum aporte encontrado.</p>
                <p className="text-sm">Adicione um novo investimento para começar a acompanhar seus aportes.</p>
            </CardContent>
        </Card>
      )}

      {sortedMonths.map((month) => {
        const monthlyTotal = groupedInvestments[month].reduce((sum, item) => sum + (item.purchasePrice * item.quantity), 0);
        
        return (
        <Card key={month}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl capitalize">{month}</CardTitle>
            <Badge variant="secondary">
              Total Aportado: {monthlyTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Preço (Unit.)</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedInvestments[month].map((investment) => {
                  const totalValue = investment.purchasePrice * investment.quantity;
                  return (
                    <TableRow key={investment.id}>
                      <TableCell>{format(parseISO(investment.purchaseDate), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="font-medium">{investment.name}</TableCell>
                      <TableCell><Badge variant="outline">{investment.type}</Badge></TableCell>
                      <TableCell className="text-right">{investment.quantity.toLocaleString('pt-BR')}</TableCell>
                      <TableCell className="text-right">{investment.purchasePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      <TableCell className="text-right font-medium">{totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )})}
    </div>
  );
}
