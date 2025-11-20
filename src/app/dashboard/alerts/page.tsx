import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { mockAlerts } from '@/lib/data';
import type { SmartAlert } from '@/lib/types';
import { Bell, Zap, PieChart, ShieldAlert, Lightbulb, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const alertIcons: Record<SmartAlert['type'], React.ElementType> = {
  'High Volatility': Zap,
  'Excessive Concentration': PieChart,
  'High-Risk Exposure': ShieldAlert,
  'Investment Opportunity': Lightbulb,
  'Maturity Reminder': Calendar,
};

const alertTitles: Record<SmartAlert['type'], string> = {
    'High Volatility': 'Alta Volatilidade',
    'Excessive Concentration': 'Concentração Excessiva',
    'High-Risk Exposure': 'Exposição a Risco Elevada',
    'Investment Opportunity': 'Oportunidade de Investimento',
    'Maturity Reminder': 'Lembrete de Vencimento',
  };

export default function AlertsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas Inteligentes</CardTitle>
        <CardDescription>
          Fique por dentro de eventos importantes e oportunidades na sua carteira.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.length > 0 ? (
            mockAlerts.map((alert) => {
              const Icon = alertIcons[alert.type] || Bell;
              const title = alertTitles[alert.type] || 'Alerta';
              const date = format(parseISO(alert.date), "dd 'de' MMMM, yyyy", { locale: ptBR });
              return (
                <Alert key={alert.id}>
                  <Icon className="h-4 w-4" />
                  <AlertTitle className="flex justify-between">
                    {title}
                    <span className="text-xs text-muted-foreground font-normal">{date}</span>
                  </AlertTitle>
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <Bell className="mx-auto h-12 w-12" />
              <p className="mt-4">Nenhum alerta por enquanto.</p>
              <p className="text-sm">Peça uma análise ao assistente para gerar novos alertas.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
