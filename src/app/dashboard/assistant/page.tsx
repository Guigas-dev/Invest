'use client';

import { useState } from 'react';
import { CornerDownLeft, Mic, Paperclip } from 'lucide-react';
import { useUser } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { analyzeInvestmentPortfolio } from '@/ai/flows/analyze-investment-portfolio';
import { generateSmartInvestmentAlerts } from '@/ai/flows/generate-smart-investment-alerts';
import { mockInvestments } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type Message = {
  sender: 'user' | 'ai';
  text?: string;
  analysis?: Awaited<ReturnType<typeof analyzeInvestmentPortfolio>>;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { sender: 'user', text: "Por favor, analise minha carteira de investimentos." }]);

    try {
      const analysis = await analyzeInvestmentPortfolio({
        investments: mockInvestments.map(({ id, currentPrice, ...rest }) => rest), // AI Flow doesn't need currentPrice or id
        financialGoals: "Aposentadoria tranquila e crescimento de patrimônio a longo prazo."
      });
      
      setMessages((prev) => [...prev, { sender: 'ai', analysis }]);
      
      // Optionally trigger alert generation
      await generateSmartInvestmentAlerts({
          portfolioAnalysis: analysis.recommendations,
          riskProfile: analysis.riskProfile,
      });

    } catch (error) {
      console.error("Error analyzing portfolio:", error);
      setMessages((prev) => [...prev, { sender: 'ai', text: "Desculpe, não consegui analisar sua carteira no momento. Tente novamente mais tarde." }]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="grid h-[calc(100vh-8rem)] w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Assistente IA</h1>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
            onClick={handleAnalyze}
            disabled={isLoading}
          >
            Analisar Minha Carteira
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <Card className={`max-w-xl ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
                  <CardContent className="pt-6">
                    {message.text && <p>{message.text}</p>}
                    {message.analysis && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold">Perfil de Risco:</h3>
                          <Badge>{message.analysis.riskProfile}</Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold">Recomendações:</h3>
                          <p className="text-sm">{message.analysis.recommendations}</p>
                        </div>
                         <div>
                          <h3 className="font-semibold">Alertas Inteligentes:</h3>
                          <p className="text-sm">{message.analysis.alerts}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                {message.sender === 'user' && user && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL ?? undefined} />
                    <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <Card className="max-w-xl w-full">
                    <CardContent className="pt-6 space-y-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
              </div>
            )}
             {messages.length === 0 && !isLoading && (
              <div className="flex justify-center items-center h-full">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Olá! Sou seu assistente de investimentos.</CardTitle>
                        <CardDescription>Clique em "Analisar Minha Carteira" para receber insights e recomendações personalizadas com base nos seus ativos.</CardDescription>
                    </CardHeader>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
