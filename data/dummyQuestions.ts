// data/dummyQuestions.ts

export type QuestionType = 'multiple-choice' | 'short-text' | 'number';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string; // Unique identifier for the question
  text: string; // The question text
  type: QuestionType;
  options?: QuestionOption[]; // Only for multiple-choice
  category: 'setup' | 'daily-buzz'; // Differentiates the questionnaires
}

// --- Setup Questions ---
// These aim to understand the user's initial financial state or goals
export const setupQuestions: Question[] = [
  {
    id: 'setup-goal',
    text: 'What is your primary financial goal right now?',
    type: 'multiple-choice',
    category: 'setup',
    options: [
      { value: 'save-emergency', label: 'Building an emergency fund' },
      { value: 'save-purchase', label: 'Saving for a large purchase (car, house)' },
      { value: 'invest', label: 'Investing for the future' },
      { value: 'debt-repayment', label: 'Paying off debt' },
      { value: 'budgeting', label: 'Getting better at budgeting' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'setup-income-freq',
    text: 'How often do you typically receive income?',
    type: 'multiple-choice',
    category: 'setup',
    options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'bi-weekly', label: 'Bi-weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'irregular', label: 'Irregularly / Freelance' },
    ],
  },
  {
    id: 'setup-confidence',
    text: 'On a scale of 1-5, how confident do you feel about managing your finances?',
    type: 'multiple-choice', // Using multiple choice for scale
    category: 'setup',
    options: [
        { value: '1', label: '1 (Not confident at all)' },
        { value: '2', label: '2' },
        { value: '3', label: '3 (Somewhat confident)' },
        { value: '4', label: '4' },
        { value: '5', label: '5 (Very confident)' },
    ],
  },
];

// --- Daily Buzz Questions ---
// These are meant to be quick, engaging questions about recent financial decisions or thoughts
export const dailyBuzzQuestions: Question[] = [
  {
    id: 'daily- splurge',
    text: 'Did you make any impulse buys yesterday? What was it?',
    type: 'short-text',
    category: 'daily-buzz',
  },
  {
    id: 'daily-saving-win',
    text: "What's one small way you saved money recently?",
    type: 'short-text',
    category: 'daily-buzz',
  },
  {
    id: 'daily-learn',
    text: 'Did you learn anything new about finance in the last few days?',
    type: 'short-text',
    category: 'daily-buzz',
  },
  {
    id: 'daily-future-spend',
    text: 'Are you planning any significant non-essential purchases this month?',
    type: 'multiple-choice',
    category: 'daily-buzz',
    options: [
        {value: 'yes', label: 'Yes'},
        {value: 'no', label: 'No'},
        {value: 'maybe', label: 'Maybe'},
    ]
  },
   {
    id: 'daily-meal-cost',
    text: 'Roughly how much did you spend on food yesterday (including groceries and eating out)?',
    type: 'number', // Could also be multiple choice ranges
    category: 'daily-buzz',
  },
];

// Function to get a daily question based on the day of the year
export const getTodaysDailyQuestion = (): Question => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = dayOfYear % dailyBuzzQuestions.length;
    return dailyBuzzQuestions[index];
} 