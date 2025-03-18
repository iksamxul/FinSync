import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { userFinancialData, generateFinancialSummary } from "@/lib/financial-data"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Generate financial context
  const financialSummary = generateFinancialSummary(userFinancialData)

  // Create system message with financial context
  const systemMessage = `
You are a helpful financial assistant with access to the user's financial data.
Use this information to provide personalized financial advice and insights.
Be specific when referencing their spending patterns, savings goals, and transactions.
Suggest actionable ways to improve their financial health based on their actual data.

${financialSummary}
`

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: systemMessage,
  })

  return result.toDataStreamResponse()
}

