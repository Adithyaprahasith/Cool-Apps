
export type TransactionType = 'bill' | 'saving' | 'debt' | 'expense' | 'income';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  debts: number;
  bills: number;
}
