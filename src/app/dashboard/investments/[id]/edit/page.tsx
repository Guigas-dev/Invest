'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import type { Investment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const investmentSchema = z.object({
  name: z.string().min(2, { message: 'O nome do ativo deve ter pelo menos 2 caracteres.' }),
  type: z.enum(['Ações', 'FIIs', 'Renda Fixa', 'Criptomoedas', 'ETFs', 'Previdência', 'Caixa']),
  purchaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Data inválida.' }),
  purchasePrice: z.coerce.number().positive({ message: 'O preço deve ser um número positivo.' }),
  quantity: z.coerce.number().positive({ message: 'A quantidade deve ser um número positivo.' }),
  brokerage: z.string().min(2, { message: 'O nome da corretora é obrigatório.' }),
  notes: z.string().optional(),
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

export default function EditInvestmentPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const investmentId = typeof id === 'string' ? id : '';

  const investmentDocRef = useMemoFirebase(() => {
    if (!user || !firestore || !investmentId) return null;
    return doc(firestore, 'users', user.uid, 'investments', investmentId);
  }, [user, firestore, investmentId]);

  const { data: investmentData, isLoading } = useDoc<Investment>(investmentDocRef);

  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      name: '',
      brokerage: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (investmentData) {
      form.reset({
        ...investmentData,
        // Ensure date is in 'YYYY-MM-DD' format for the input
        purchaseDate: investmentData.purchaseDate.split('T')[0],
      });
    }
  }, [investmentData, form]);

  const onSubmit = async (data: InvestmentFormData) => {
    if (!investmentDocRef) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Referência do documento não encontrada.',
      });
      return;
    }

    try {
      await updateDoc(investmentDocRef, {
        ...data,
      });

      toast({
        title: 'Ativo Atualizado!',
        description: `${data.name} foi atualizado com sucesso.`,
      });
      router.push('/dashboard/investments');
    } catch (error) {
      console.error('Error updating investment:', error);
      toast({
        variant: 'destructive',
        title: 'Oh, não! Algo deu errado.',
        description: 'Não foi possível atualizar seu ativo. Tente novamente.',
      });
    }
  };

  if (isLoading) {
    return (
        <Card className="mx-auto max-w-2xl">
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
  }

  if (!investmentData && !isLoading) {
    return (
        <Card className="mx-auto max-w-2xl text-center">
            <CardHeader>
                <CardTitle>Ativo não encontrado</CardTitle>
                <CardDescription>O ativo que você está tentando editar não foi encontrado.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/dashboard/investments">Voltar para a lista</Link>
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="mx-auto grid max-w-2xl flex-1 auto-rows-max gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Editar Ativo</CardTitle>
              <CardDescription>
                Atualize as informações do seu investimento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Ativo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Apple Inc., Tesouro Selic 2029" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Ativo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de ativo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ações">Ações</SelectItem>
                          <SelectItem value="FIIs">Fundos Imobiliários (FIIs)</SelectItem>
                          <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                          <SelectItem value="Criptomoedas">Criptomoedas</SelectItem>
                          <SelectItem value="ETFs">ETFs</SelectItem>
                          <SelectItem value="Previdência">Previdência</SelectItem>
                          <SelectItem value="Caixa">Caixa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                   <FormField
                      control={form.control}
                      name="purchaseDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Compra</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="purchasePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço de Compra (Unitário)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="R$ 150,00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.0001" placeholder="10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brokerage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Corretora</FormLabel>
                          <FormControl>
                            <Input placeholder="XP, Rico, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas (Opcional)</FormLabel>
                       <FormControl>
                        <Textarea
                          placeholder="Ex: Compra realizada para objetivo de longo prazo."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                    <Button variant="outline" asChild type="button">
                        <Link href="/dashboard/investments">Cancelar</Link>
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
