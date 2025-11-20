import type { Investment, PortfolioSnapshot, SmartAlert, UserProfile, BenchmarkData } from './types';

export const mockUser: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatarUrl: 'https://picsum.photos/seed/100/100/100',
  riskProfile: 'Moderado',
};

export const mockInvestments: Investment[] = [
  { id: '1', name: 'AAPL', type: 'Ações', purchaseDate: '2023-01-15', purchasePrice: 150.00, currentPrice: 175.25, quantity: 10, brokerage: 'XP Investimentos' },
  { id: '2', name: 'HGLG11', type: 'FIIs', purchaseDate: '2022-11-20', purchasePrice: 160.50, currentPrice: 165.00, quantity: 20, brokerage: 'Rico' },
  { id: '3', name: 'Tesouro Selic 2029', type: 'Renda Fixa', purchaseDate: '2023-05-10', purchasePrice: 10000.00, currentPrice: 10250.00, quantity: 1, brokerage: 'BTG Pactual' },
  { id: '4', name: 'BTC', type: 'Criptomoedas', purchaseDate: '2021-08-01', purchasePrice: 45000.00, currentPrice: 65000.00, quantity: 0.1, brokerage: 'Binance' },
  { id: '5', name: 'IVVB11', type: 'ETFs', purchaseDate: '2023-03-22', purchasePrice: 250.00, currentPrice: 280.00, quantity: 15, brokerage: 'XP Investimentos' },
  { id: '6', name: 'PGBL Dinâmico', type: 'Previdência', purchaseDate: '2020-01-01', purchasePrice: 5000.00, currentPrice: 7500.00, quantity: 1, brokerage: 'Itaú' },
  { id: '7', name: 'Reserva de Emergência', type: 'Caixa', purchaseDate: '2023-01-01', purchasePrice: 20000.00, currentPrice: 20000.00, quantity: 1, brokerage: 'NuConta' },
];

export const mockSnapshots: PortfolioSnapshot[] = [
  { date: 'Jan 23', totalValue: 45000 },
  { date: 'Fev 23', totalValue: 46500 },
  { date: 'Mar 23', totalValue: 48000 },
  { date: 'Abr 23', totalValue: 51000 },
  { date: 'Mai 23', totalValue: 50500 },
  { date: 'Jun 23', totalValue: 53000 },
  { date: 'Jul 23', totalValue: 55000 },
  { date: 'Ago 23', totalValue: 57000 },
  { date: 'Set 23', totalValue: 56000 },
  { date: 'Out 23', totalValue: 59000 },
  { date: 'Nov 23', totalValue: 62000 },
  { date: 'Dez 23', totalValue: 65000 },
];

export const mockAlerts: SmartAlert[] = [
  { id: '1', type: 'High Volatility', message: "O ativo 'BTC' está apresentando alta volatilidade. Considere reavaliar sua exposição.", asset: 'BTC', date: '2024-07-28' },
  { id: '2', type: 'Excessive Concentration', message: 'Sua carteira está muito concentrada em Ações. Considere diversificar para reduzir riscos.', date: '2024-07-27' },
  { id: '3', type: 'Investment Opportunity', message: "Identificamos uma oportunidade de investimento em 'Tesouro IPCA+ 2035' compatível com seu perfil.", asset: 'Tesouro IPCA+ 2035', date: '2024-07-26' },
  { id: '4', type: 'Maturity Reminder', message: "Seu título 'Tesouro Selic 2025' vencerá em 30 dias.", asset: 'Tesouro Selic 2025', date: '2024-07-25' },
];

export const mockBenchmarkData: BenchmarkData[] = [
  { date: 'Jan', portfolio: 0, cdi: 0, ibovespa: 0 },
  { date: 'Fev', portfolio: 2.1, cdi: 1.1, ibovespa: -1.5 },
  { date: 'Mar', portfolio: 3.5, cdi: 2.2, ibovespa: 2.0 },
  { date: 'Abr', portfolio: 5.2, cdi: 3.3, ibovespa: 4.5 },
  { date: 'Mai', portfolio: 4.8, cdi: 4.4, ibovespa: 3.0 },
  { date: 'Jun', portfolio: 6.5, cdi: 5.5, ibovespa: 7.0 },
  { date: 'Jul', portfolio: 7.8, cdi: 6.6, ibovespa: 8.2 },
  { date: 'Ago', portfolio: 8.2, cdi: 7.7, ibovespa: 6.5 },
  { date: 'Set', portfolio: 7.5, cdi: 8.8, ibovespa: 5.0 },
  { date: 'Out', portfolio: 9.1, cdi: 9.9, ibovespa: 9.5 },
  { date: 'Nov', portfolio: 11.2, cdi: 11.0, ibovespa: 12.0 },
  { date: 'Dez', portfolio: 13.5, cdi: 12.1, ibovespa: 15.0 },
];
