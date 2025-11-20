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

export default function NewInvestmentPage() {
  return (
    <div className="mx-auto grid max-w-2xl flex-1 auto-rows-max gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Ativo</CardTitle>
          <CardDescription>
            Preencha as informações do seu novo investimento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Nome do Ativo</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                placeholder="Ex: Apple Inc., Tesouro Selic 2029"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="type">Tipo de Ativo</Label>
              <Select>
                <SelectTrigger id="type" aria-label="Selecione o tipo">
                  <SelectValue placeholder="Selecione o tipo de ativo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acoes">Ações</SelectItem>
                  <SelectItem value="fiis">Fundos Imobiliários (FIIs)</SelectItem>
                  <SelectItem value="renda-fixa">Renda Fixa</SelectItem>
                  <SelectItem value="criptomoedas">Criptomoedas</SelectItem>
                  <SelectItem value="etfs">ETFs</SelectItem>
                  <SelectItem value="previdencia">Previdência</SelectItem>
                  <SelectItem value="caixa">Caixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="purchaseDate">Data da Compra</Label>
                <Input id="purchaseDate" type="date" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="purchasePrice">Preço de Compra</Label>
                <Input id="purchasePrice" type="number" placeholder="R$ 150,00" />
              </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input id="quantity" type="number" placeholder="10" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="brokerage">Corretora</Label>
                  <Input id="brokerage" type="text" placeholder="XP, Rico, etc." />
                </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="notes">Notas (Opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Ex: Compra realizada para objetivo de longo prazo."
                className="min-h-32"
              />
            </div>
            <div className="flex items-center gap-2">
                <Button type="submit">Salvar Ativo</Button>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/investments">Cancelar</Link>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
