export type Investment = {
  id: string;
  userId: string;
  name: string;
  type: 'Ações' | 'FIIs' | 'Renda Fixa' | 'Criptomoedas' | 'ETFs' | 'Previdência' | 'Caixa';
  purchaseDate: string;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  brokerage: string;
  notes?: string;
};

export type PortfolioSnapshot = {
  date: string;
  totalValue: number;
};

export type SmartAlert = {
  id: string;
  type: 'High Volatility' | 'Excessive Concentration' | 'High-Risk Exposure' | 'Investment Opportunity' | 'Maturity Reminder';
  message: string;
  asset?: string;
  date: string;
};

export type UserProfile = {
  name: string;
  email: string;
  avatarUrl: string;
  riskProfile?: 'Conservador' | 'Moderado' | 'Agressivo';
};

export type BenchmarkData = {
  date: string;
  portfolio: number;
  cdi: number;
  ibovespa: number;
};
