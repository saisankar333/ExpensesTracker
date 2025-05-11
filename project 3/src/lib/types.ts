// Define all types used across the application

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'housing'
  | 'education'
  | 'travel'
  | 'other';

export interface Budget {
  id: string;
  userId: string;
  category: ExpenseCategory;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  balance: number;
  type: 'cash' | 'bank' | 'credit' | 'investment' | 'other';
}