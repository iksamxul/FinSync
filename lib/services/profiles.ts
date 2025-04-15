import { supabase } from '../supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { Transaction } from '@/lib/financial-data';

export class ProfileError extends Error {
  constructor(message: string, public cause?: PostgrestError) {
    super(message);
    this.name = 'ProfileError';
  }
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  monthly_income: number;
  savings_goal: number;
  total_balance: number;
}

export interface ProfileWithTransactions extends Profile {
  transactions: Transaction[];
}

export async function getProfile(userId: string): Promise<ProfileWithTransactions> {
  try {
    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) throw new ProfileError('Failed to fetch profile', profileError);
    if (!profile) throw new ProfileError('Profile not found');

    // Get transactions in a separate query for better reliability
    const { data: transactions, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (transactionError) {
      console.error('Transaction fetch error:', transactionError);
      throw new ProfileError('Failed to fetch transactions');
    }

    return {
      ...profile,
      transactions: transactions || []
    };
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error instanceof ProfileError ? error : new ProfileError('Unexpected error fetching profile');
  }
}

export async function updateProfile(
  userId: string,
  updates: { monthly_income?: number; savings_goal?: number }
): Promise<Profile> {
  try {
    // First verify the profile exists
    const { data: existingProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (verifyError) {
      console.error('Verify error:', verifyError);
      throw new ProfileError('Failed to verify profile');
    }

    if (!existingProfile) {
      throw new ProfileError(`Profile not found for user: ${userId}`);
    }

    console.log('Found profile, attempting update:', {
      userId,
      updates,
      existingProfile
    });

    const { data, error } = await supabase
      .from('profiles')
      .update({
        monthly_income: updates.monthly_income,
        savings_goal: updates.savings_goal
      })
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Update error:', error);
      throw new ProfileError(`Update failed: ${error.message}`);
    }

    if (!data) {
      throw new ProfileError('No data returned after update');
    }

    console.log('Update successful:', data);
    return data;
  } catch (error) {
    console.error('Update failed:', error);
    throw error instanceof ProfileError ? error : new ProfileError('Update failed');
  }
}
