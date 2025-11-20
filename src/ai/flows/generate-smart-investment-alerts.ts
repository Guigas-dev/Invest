'use server';

/**
 * @fileOverview Generates smart investment alerts based on the user's portfolio analysis.
 *
 * - generateSmartInvestmentAlerts - A function that generates smart investment alerts.
 * - GenerateSmartInvestmentAlertsInput - The input type for the generateSmartInvestmentAlerts function.
 * - GenerateSmartInvestmentAlertsOutput - The return type for the generateSmartInvestmentAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSmartInvestmentAlertsInputSchema = z.object({
  portfolioAnalysis: z
    .string()
    .describe("A comprehensive analysis of the user's investment portfolio."),
  riskProfile: z
    .string()
    .describe("The user's risk profile (e.g., conservative, moderate, aggressive)."),
});
export type GenerateSmartInvestmentAlertsInput = z.infer<typeof GenerateSmartInvestmentAlertsInputSchema>;

const GenerateSmartInvestmentAlertsOutputSchema = z.object({
  alerts: z.array(
    z.object({
      type: z
        .string()
        .describe(
          'The type of alert (e.g., high volatility, excessive concentration, high-risk exposure, investment opportunity, maturity reminder).'
        ),
      message: z.string().describe('The alert message to display to the user.'),
      asset: z.string().optional().describe('The asset the alert is related to, if applicable.'),
    })
  ).describe('A list of smart investment alerts.'),
});
export type GenerateSmartInvestmentAlertsOutput = z.infer<typeof GenerateSmartInvestmentAlertsOutputSchema>;

export async function generateSmartInvestmentAlerts(
  input: GenerateSmartInvestmentAlertsInput
): Promise<GenerateSmartInvestmentAlertsOutput> {
  return generateSmartInvestmentAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSmartInvestmentAlertsPrompt',
  input: {schema: GenerateSmartInvestmentAlertsInputSchema},
  output: {schema: GenerateSmartInvestmentAlertsOutputSchema},
  prompt: `You are an AI-powered investment assistant that analyzes investment portfolios and generates smart alerts for users.

  Based on the user's portfolio analysis and risk profile, identify potential risks and opportunities and generate relevant alerts.

  Portfolio Analysis: {{{portfolioAnalysis}}}
  Risk Profile: {{{riskProfile}}}

  Consider the following alert types:
  - High Volatility: Alert the user when an asset in their portfolio experiences high volatility.
  - Excessive Concentration: Alert the user if their portfolio is excessively concentrated in a single asset or sector.
  - High-Risk Exposure: Alert the user if their portfolio has a high-risk exposure based on their risk profile.
  - Investment Opportunity: Alert the user of potential investment opportunities that align with their risk profile.
  - Maturity Reminder: Alert the user of upcoming maturity dates for fixed-income investments.

  The alerts should be clear, concise, and actionable.

  Format the output as a JSON array of alerts, where each alert has a type and message field.

  Example:
  ```json
  {
    "alerts": [
      {
        "type": "High Volatility",
        "message": "Asset XYZ is experiencing high volatility. Consider rebalancing your portfolio.",
        "asset": "XYZ",
      },
      {
        "type": "Excessive Concentration",
        "message": "Your portfolio is heavily concentrated in the tech sector. Diversify to reduce risk.",
      },
      {
        "type": "Maturity Reminder",
        "message": "Your bond XYZ is maturing on 2024-12-31.",
        "asset": "XYZ",
      },
    ]
  }
  ```
  `,
});

const generateSmartInvestmentAlertsFlow = ai.defineFlow(
  {
    name: 'generateSmartInvestmentAlertsFlow',
    inputSchema: GenerateSmartInvestmentAlertsInputSchema,
    outputSchema: GenerateSmartInvestmentAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
