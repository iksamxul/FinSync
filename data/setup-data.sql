-- First insert the profile
INSERT INTO profiles (user_id, name, monthly_income, savings_goal, total_balance)
VALUES ('user123', 'kazi', 5000, 1000, 12474.23);

-- Then insert transactions
COPY transactions (date, amount, category, description, type, user_id)
FROM STDIN (FORMAT csv, HEADER true);
date,amount,category,description,type,user_id
2024-03-01,5000.00,salary,"Monthly Salary",income,user123
// ...existing transaction data...
