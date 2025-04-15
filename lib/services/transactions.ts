import { supabase } from '../supabase/client';
import { Transaction } from '@/lib/financial-data';

export async function createTransaction(transaction: Omit<Transaction, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to create transaction:', error);
    throw error;
  }
}

export async function getAllTransactions(userId: string) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw error;
  }
}

export async function deleteTransaction(id: string) {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    throw error;
  }
}
