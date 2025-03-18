// Sample financial data structure
export type Transaction = {
    id: string
    date: string
    amount: number
    category: string
    description: string
  }
  
  export type FinancialProfile = {
    userId: string
    name: string
    monthlyIncome: number
    savingsGoal: number
    transactions: Transaction[]
  }
  
  // Sample user financial data - replace with your actual data
  export const userFinancialData: FinancialProfile = {
    userId: "user123",
    name: "John Doe",
    monthlyIncome: 5000,
    savingsGoal: 1000,
    transactions: [
      {
        id: "t1",
        date: "2024-03-15",
        amount: 120.5,
        category: "groceries",
        description: "Weekly grocery shopping",
      },
      {
        id: "t2",
        date: "2024-03-14",
        amount: 45.0,
        category: "dining",
        description: "Dinner at Italian restaurant",
      },
      {
        id: "t3",
        date: "2024-03-12",
        amount: 9.99,
        category: "subscription",
        description: "Streaming service",
      },
      {
        id: "t4",
        date: "2024-03-10",
        amount: 65.3,
        category: "utilities",
        description: "Electricity bill",
      },
      {
        id: "t5",
        date: "2024-03-08",
        amount: 35.0,
        category: "dining",
        description: "Lunch with colleagues",
      },
      {
        id: "t6",
        date: "2024-03-05",
        amount: 150.0,
        category: "shopping",
        description: "New clothes",
      },
      {
        id: "t7",
        date: "2024-03-01",
        amount: 800.0,
        category: "rent",
        description: "Monthly rent",
      },
    ],
  }
  
  // Function to analyze spending patterns
  export function analyzeSpending(profile: FinancialProfile) {
    // Group transactions by category
    const categoryTotals: Record<string, number> = {}
  
    profile.transactions.forEach((transaction) => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0
      }
      categoryTotals[transaction.category] += transaction.amount
    })
  
    // Calculate total spending
    const totalSpent = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)
  
    // Calculate percentage of income
    const percentOfIncome = (totalSpent / profile.monthlyIncome) * 100
  
    // Find top spending categories
    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpent) * 100,
      }))
  
    // Check if user is on track for savings goal
    const remainingIncome = profile.monthlyIncome - totalSpent
    const onTrackForSavings = remainingIncome >= profile.savingsGoal
  
    return {
      totalSpent,
      percentOfIncome,
      topCategories: sortedCategories.slice(0, 3),
      onTrackForSavings,
      remainingIncome,
    }
  }
  
  // Generate a financial summary for the AI context
  export function generateFinancialSummary(profile: FinancialProfile) {
    const analysis = analyzeSpending(profile)
  
    const topCategoriesText = analysis.topCategories
      .map((cat) => `${cat.category} ($${cat.amount.toFixed(2)}, ${cat.percentage.toFixed(1)}% of total)`)
      .join(", ")
  
    return `
  User Financial Profile:
  - Name: ${profile.name}
  - Monthly Income: $${profile.monthlyIncome}
  - Savings Goal: $${profile.savingsGoal}
  
  Recent Spending Analysis:
  - Total Spent: $${analysis.totalSpent.toFixed(2)} (${analysis.percentOfIncome.toFixed(1)}% of monthly income)
  - Top Spending Categories: ${topCategoriesText}
  - Remaining Income: $${analysis.remainingIncome.toFixed(2)}
  - On Track for Savings Goal: ${analysis.onTrackForSavings ? "Yes" : "No"}
  
  Recent Transactions:
  ${profile.transactions
    .slice(0, 5)
    .map((t) => `- ${t.date}: $${t.amount.toFixed(2)} on ${t.category} (${t.description})`)
    .join("\n")}
  `
  }
  
  