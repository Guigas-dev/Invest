'use server';

/**
 * @fileOverview AI-powered investment portfolio analysis flow.
 *
 * - analyzeInvestmentPortfolio - Analyzes a user's investment portfolio, assesses risk profile, and provides personalized recommendations.
 * - AnalyzeInvestmentPortfolioInput - The input type for the analyzeInvestmentPortfolio function.
 * - AnalyzeInvestmentPortfolioOutput - The return type for the analyzeInvestmentPortfolio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvestmentAssetSchema = z.object({
  name: z.string().describe('The name of the asset.'),
  type: z.string().describe('The type of the asset (e.g., Stock, FII, Fixed Income, Cryptocurrency, ETF, Pension, Cash).'),
  purchaseDate: z.string().describe('The date the asset was purchased (YYYY-MM-DD).'),
  purchasePrice: z.number().describe('The price at which the asset was purchased.'),
  quantity: z.number().describe('The quantity of the asset held.'),
  brokerage: z.string().describe('The brokerage through which the asset was purchased.'),
  notes: z.string().optional().describe('Optional notes about the asset.'),
});

const AnalyzeInvestmentPortfolioInputSchema = z.object({
  investments: z.array(InvestmentAssetSchema).describe('A list of investment assets in the user portfolio.'),
  financialGoals: z.string().describe('The user stated financial goals.'),
});
export type AnalyzeInvestmentPortfolioInput = z.infer<typeof AnalyzeInvestmentPortfolioInputSchema>;

const AnalyzeInvestmentPortfolioOutputSchema = z.object({
  riskProfile: z.string().describe('The risk profile of the user (Conservative, Moderate, or Aggressive).'),
  recommendations: z.string().describe('Personalized investment recommendations based on the portfolio analysis and financial goals.'),
  alerts: z.string().describe('Intelligent alerts for high volatility, excessive concentration, high-risk exposure, and investment opportunities.'),
});
export type AnalyzeInvestmentPortfolioOutput = z.infer<typeof AnalyzeInvestmentPortfolioOutputSchema>;

export async function analyzeInvestmentPortfolio(input: AnalyzeInvestmentPortfolioInput): Promise<AnalyzeInvestmentPortfolioOutput> {
  return analyzeInvestmentPortfolioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeInvestmentPortfolioPrompt',
  input: {schema: AnalyzeInvestmentPortfolioInputSchema},
  output: {schema: AnalyzeInvestmentPortfolioOutputSchema},
  prompt: `You are an AI-powered investment assistant that analyzes user investment portfolios, assesses risk profiles, and provides personalized recommendations.

  Analyze the user's investment portfolio below:
  Investments: {{investments}}

  Based on the investment portfolio and the user's financial goals, assess the user's risk profile as Conservative, Moderate, or Aggressive.
  Financial Goals: {{{financialGoals}}}

  Generate personalized investment recommendations and intelligent alerts based on the portfolio analysis and financial goals.

  Respond in a clear, objective, and minimal manner.

  Output:
  Risk Profile: (Conservative, Moderate, or Aggressive)
  Recommendations: (Personalized investment recommendations)
  Alerts: (Intelligent alerts for high volatility, excessive concentration, high-risk exposure, and investment opportunities)
  `,
});

const analyzeInvestmentPortfolioFlow = ai.defineFlow(
  {
    name: 'analyzeInvestmentPortfolioFlow',
    inputSchema: AnalyzeInvestmentPortfolioInputSchema,
    outputSchema: AnalyzeInvestmentPortfolioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
