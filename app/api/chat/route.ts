import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { generateFinancialSummary } from "@/lib/financial-data"
import { getTransactions, getFinancialProfile } from "@/lib/financial-service"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function formatTransactionHistory(transactions: any[]) {
  return transactions
    .slice(0, 10) // Get last 10 transactions
    .map(t => ({
      date: new Date(t.date).toLocaleDateString(),
      type: t.type,
      category: t.category,
      amount: `${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}`,
      description: t.description
    }));
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Fetch real-time data from database
    const transactions = await getTransactions()
    const profile = await getFinancialProfile("user123")

    const currentFinancialData = {
      ...profile,
      transactions: transactions || [],
      monthlyStats: [],
      totalBalance: profile?.totalBalance || 0,  // Add default value
    }

    const recentTransactions = formatTransactionHistory(transactions || []);
    const financialSummary = generateFinancialSummary(currentFinancialData)

    // Create system message with financial context
    const systemMessage = `
As a financial assistant, format your responses carefully following these EXACT rules:

1. LISTS FORMAT:
   • Each transaction on a NEW LINE
   • Use "•" as bullet points
   • Add TWO line breaks between sections
   • Never use single line breaks

2. TRANSACTIONS FORMAT:
   • Date - Transaction Type - Category - Amount - (Description)
   • Always add emojis before categories
   • Always add ↗️ before income amounts
   • Always add ↘️ before expense amounts

3. TEXT FORMAT:
   • Use **bold** for numbers and important points
   • Add emoji indicators: 💡 (insights), ⚠️ (warnings), ✅ (achievements)
   • Add TWO line breaks between paragraphs

Example Format:
**Monthly Overview**

Your recent transactions:

• 3/15/2024 - Expense - 🛒 Groceries - ↘️ **$120.50** - (Weekly groceries)
• 3/14/2024 - Income - 💰 Salary - ↗️ **$5,000.00** - (Monthly payment)

💡 Quick Analysis:
Your spending in **Groceries** represents **15%** of your monthly budget.

Here's your current financial data:

Financial Overview:
${JSON.stringify(financialSummary, null, 2)}

Recent Transactions:
${JSON.stringify(recentTransactions, null, 2)}
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',  // Fix model name
      stream: true,
      messages: [
        { role: 'system', content: systemMessage },
        ...messages,
      ],
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)

  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500 }
    )
  }
}

