-- Drop existing constraints and tables
-- DROP TABLE IF EXISTS transactions CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    monthly_income DECIMAL DEFAULT 0,
    savings_goal DECIMAL DEFAULT 0,
    total_balance DECIMAL DEFAULT 0,
    CONSTRAINT profiles_user_id_key UNIQUE (user_id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    amount DECIMAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('income', 'expense')),
    CONSTRAINT transactions_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES profiles(user_id) 
        ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);

-- Insert test data
INSERT INTO profiles (user_id, name, monthly_income, savings_goal, total_balance)
VALUES ('user123', 'kazi', 5000, 1000, 12474.23)
ON CONFLICT (user_id) DO UPDATE SET
    monthly_income = EXCLUDED.monthly_income,
    savings_goal = EXCLUDED.savings_goal;

-- Insert sample transactions
INSERT INTO transactions (user_id, date, amount, category, description, type)
VALUES 
    ('user123', '2024-03-01', 5000.00, 'salary', 'Monthly Salary', 'income'),
    ('user123', '2024-03-02', 1200.00, 'rent', 'Monthly Rent', 'expense'),
    ('user123', '2024-03-03', 200.00, 'groceries', 'Weekly Groceries', 'expense'),
    ('user123', '2024-03-04', 150.00, 'utilities', 'Electricity Bill', 'expense'),
    ('user123', '2024-03-05', 500.00, 'freelance', 'Web Design Project', 'income'),
    ('user123', '2024-03-06', 100.00, 'entertainment', 'Movie Night', 'expense'),
    ('user123', '2024-03-07', 300.00, 'shopping', 'New Clothes', 'expense'),
    ('user123', '2024-03-08', 250.00, 'transportation', 'Monthly Bus Pass', 'expense')
ON CONFLICT DO NOTHING;
