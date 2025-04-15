import { supabase } from './supabase'
import { Transaction, MonthlyStats, FinancialProfile } from './financial-data'

export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  return data?.map(item => ({
    id: item.id,
    date: item.date,
    amount: item.amount,
    category: item.category,
    description: item.description,
    type: item.type
  })) || [];
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getFinancialProfile(userId: string): Promise<any> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  return {
    user_id: data?.user_id,
    name: data?.name,
    monthly_income: data?.monthly_income,
    savings_goal: data?.savings_goal,
    total_balance: data?.total_balance
  };
}
