import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Agente de IA</CardTitle>
        <CardDescription>
          Defina regras e diretrizes para o comportamento do seu assistente de
          investimentos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="rules">Regras e Diretrizes</Label>
            <Textarea
              id="rules"
              placeholder="Ex: Sempre forneça análises com um viés conservador. Evite jargões complexos. Priorize a segurança do capital."
              className="min-h-48"
              defaultValue="1. Foco em investimentos de longo prazo.
2. Priorizar a diversificação da carteira.
3. Análise de risco deve ser sempre conservadora.
4. Comunicar de forma clara e objetiva, evitando jargões.
5. Sugerir apenas ativos listados na B3 e principais mercados internacionais."
            />
          </div>
          <div className="flex justify-start">
            <Button type="submit">Salvar Regras</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
