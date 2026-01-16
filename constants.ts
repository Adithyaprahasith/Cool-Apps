
import { TransactionType } from './types';

export const DEFAULT_CATEGORIES: Record<TransactionType, string[]> = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  bill: ['Rent/Mortgage', 'Utilities', 'Internet', 'Phone', 'Subscription'],
  expense: ['Groceries', 'Dining', 'Transport', 'Shopping', 'Entertainment', 'Health'],
  saving: ['Emergency Fund', 'Retirement', 'Travel Fund', 'General Savings'],
  debt: ['Credit Card', 'Personal Loan', 'Student Loan', 'Car Loan'],
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MOCK_INITIAL_DATA = [
  // MARCH 2024
  { id: 'm1', date: '2024-03-01', amount: 4800, type: 'income', category: 'Salary', description: 'Tech Corp Monthly' },
  { id: 'm2', date: '2024-03-01', amount: 1500, type: 'bill', category: 'Rent/Mortgage', description: 'Apartment Rent' },
  { id: 'm3', date: '2024-03-05', amount: 80, type: 'bill', category: 'Utilities', description: 'City Power & Water' },
  { id: 'm4', date: '2024-03-10', amount: 600, type: 'saving', category: 'Retirement', description: '401k Contribution' },
  { id: 'm5', date: '2024-03-12', amount: 145.50, type: 'expense', category: 'Groceries', description: 'Whole Foods Market' },
  { id: 'm6', date: '2024-03-15', amount: 350, type: 'debt', category: 'Personal Loan', description: 'Bank Loan Payment' },
  { id: 'm7', date: '2024-03-18', amount: 220, type: 'expense', category: 'Dining', description: 'Sushi Dinner' },
  { id: 'm8', date: '2024-03-22', amount: 90, type: 'expense', category: 'Transport', description: 'Uber Rides' },
  
  // FEBRUARY 2024
  { id: 'f1', date: '2024-02-01', amount: 4800, type: 'income', category: 'Salary', description: 'Tech Corp Monthly' },
  { id: 'f2', date: '2024-02-01', amount: 1500, type: 'bill', category: 'Rent/Mortgage', description: 'Apartment Rent' },
  { id: 'f3', date: '2024-02-05', amount: 110, type: 'bill', category: 'Utilities', description: 'City Power & Water' },
  { id: 'f4', date: '2024-02-10', amount: 500, type: 'saving', category: 'Retirement', description: '401k Contribution' },
  { id: 'f5', date: '2024-02-12', amount: 180.20, type: 'expense', category: 'Groceries', description: 'Traders Joes' },
  { id: 'f6', date: '2024-02-15', amount: 350, type: 'debt', category: 'Personal Loan', description: 'Bank Loan Payment' },
  { id: 'f7', date: '2024-02-20', amount: 1200, type: 'expense', category: 'Shopping', description: 'New Laptop' },
  
  // JANUARY 2024
  { id: 'j1', date: '2024-01-01', amount: 4800, type: 'income', category: 'Salary', description: 'Tech Corp Monthly' },
  { id: 'j2', date: '2024-01-01', amount: 1500, type: 'bill', category: 'Rent/Mortgage', description: 'Apartment Rent' },
  { id: 'j3', date: '2024-01-05', amount: 75, type: 'bill', category: 'Utilities', description: 'City Power & Water' },
  { id: 'j4', date: '2024-01-10', amount: 1000, type: 'saving', category: 'Emergency Fund', description: 'Initial Savings' },
  { id: 'j5', date: '2024-01-15', amount: 350, type: 'debt', category: 'Personal Loan', description: 'Bank Loan Payment' },
  { id: 'j6', date: '2024-01-20', amount: 300, type: 'expense', category: 'Health', description: 'Gym Membership Annual' },
];
