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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

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

export default function NewInvestmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      name: '',
      brokerage: '',
      notes: '',
    },
  });

  const onSubmit = async (data: InvestmentFormData) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro de autenticação',
        description: 'Você precisa estar logado para adicionar um ativo.',
      });
      return;
    }

    try {
      const investmentsCollection = collection(firestore, 'users', user.uid, 'investments');
      await addDoc(investmentsCollection, {
        ...data,
        userId: user.uid,
        // Firebase functions might add currentPrice later, for now let's use purchasePrice
        currentPrice: data.purchasePrice
      });

      toast({
        title: 'Ativo Adicionado!',
        description: `${data.name} foi adicionado à sua carteira.`,
      });
      router.push('/dashboard/investments');
    } catch (error) {
      console.error('Error adding investment:', error);
      toast({
        variant: 'destructive',
        title: 'Oh, não! Algo deu errado.',
        description: 'Não foi possível salvar seu ativo. Tente novamente.',
      });
    }
  };

  return (
    <div className="mx-auto grid max-w-2xl flex-1 auto-rows-max gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Ativo</CardTitle>
              <CardDescription>
                Preencha as informações do seu novo investimento.
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Ativo'}
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
