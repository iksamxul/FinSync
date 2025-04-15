import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    console.log('Request body:', body); // Debug log

    // Simpler update query matching exact column names
    const { data, error } = await supabase
      .from('profiles')
      .update({
        monthly_income: body.monthlyIncome,
        savings_goal: body.savingsGoal
      })
      .eq('user_id', body.userId) // Make sure this matches your table's primary key column
      .select()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Update result:', data) // Debug log
    return NextResponse.json(data)
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
