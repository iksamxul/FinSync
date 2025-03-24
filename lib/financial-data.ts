// Types only
export type Transaction = {
    id: string
    date: string
    amount: number
    category: string
    description: string
    type: 'income' | 'expense'
}

export type MonthlyStats = {
  date: string
  earnings: number
  spendings: number
}

export type FinancialProfile = {
  userId: string
  name: string
  monthlyIncome: number
  savingsGoal: number
  totalBalance: number
  transactions: Transaction[]
  monthlyStats: MonthlyStats[]
}

// Sample user financial data
export const userFinancialData: FinancialProfile = {
  userId: "user123",
  name: "kazi",
  monthlyIncome: 5000,
  savingsGoal: 1000,
  totalBalance: 12474.23,
  transactions: [
    {
      id: "t1",
      date: "2024-03-01",
      amount: 5000.0,
      category: "salary",
      description: "Monthly Salary",
      type: "income" as const
    }
  ],
  monthlyStats: [
    {
      date: "Mar",
      earnings: 5000,
      spendings: 0
    }
  ]
};

// Analysis functions
export function analyzeSpending(profile: FinancialProfile) {
  const currentMonth = new Date().getMonth();
  const currentMonthTransactions = profile.transactions.filter(t => {
    const transactionMonth = new Date(t.date).getMonth();
    return transactionMonth === currentMonth;
  });

  const totalSpent = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const categorizedSpending = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: { [key: string]: number }, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topCategories = Object.entries(categorizedSpending)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalSpent) * 100
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    totalSpent,
    percentOfIncome: totalIncome ? (totalSpent / totalIncome) * 100 : 0,
    topCategories,
    onTrackForSavings: totalIncome - totalSpent >= profile.savingsGoal,
    remainingIncome: totalIncome - totalSpent // Add this line
  };
}

export function generateFinancialSummary(data: any) {
  const analysis = analyzeSpending(data);
  
  return {
    overview: {
      currentBalance: data?.totalBalance?.toFixed(2) || '0.00',
      monthlyIncome: data?.monthlyIncome?.toFixed(2) || '0.00',
      savingsGoal: data?.savingsGoal?.toFixed(2) || '0.00',
    },
    monthlyAnalysis: {
      totalSpent: analysis?.totalSpent?.toFixed(2) || '0.00',
      percentOfIncome: analysis?.percentOfIncome?.toFixed(1) || '0.0',
      remainingIncome: analysis?.remainingIncome?.toFixed(2) || '0.00',
    },
    savings: {
      status: analysis?.onTrackForSavings ? 'On Track' : 'Below Target',
      goal: data?.savingsGoal?.toFixed(2) || '0.00',
      projected: analysis?.remainingIncome?.toFixed(2) || '0.00',
    },
    spending: {
      topCategory: analysis?.topCategories?.[0]?.category || 'No expenses',
      topAmount: analysis?.topCategories?.[0]?.amount?.toFixed(2) || '0.00',
      topPercentage: analysis?.topCategories?.[0]?.percentage?.toFixed(1) || '0.0',
    }
  };
}

