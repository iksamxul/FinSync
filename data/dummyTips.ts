// data/dummyTips.ts
export interface Tip {
  id: string;
  text: string;
}

export const financialTips: Tip[] = [
  { id: 'tip1', text: 'Review your bank statements weekly to spot errors or unauthorized charges.' },
  { id: 'tip2', text: 'Try the 50/30/20 budget rule: 50% needs, 30% wants, 20% savings/debt.' },
  { id: 'tip3', text: 'Automate your savings! Set up automatic transfers to your savings account each payday.' },
  { id: 'tip4', text: 'Before making a large non-essential purchase, wait 24 hours to avoid impulse buying.' },
  { id: 'tip5', text: 'Check your credit report for free annually from official sources.' },
  { id: 'tip6', text: 'Consider packing your lunch a few times a week instead of buying it.' },
  { id: 'tip7', text: 'Look for opportunities to increase your income, even small side hustles can add up.' },
  { id: 'tip8', text: 'Understand the difference between "good debt" (like a mortgage) and "bad debt" (high-interest credit cards).' },
];

// Function to get a daily tip based on the day of the year
export const getTodaysFinancialTip = (): Tip => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Use a different calculation from daily buzz to ensure different tips
    const index = (dayOfYear + 5) % financialTips.length; // Add offset
    return financialTips[index];
} 