import { ExpenseCategory } from './types';

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Get human-readable category name
export const getCategoryName = (category: ExpenseCategory): string => {
  const names: Record<ExpenseCategory, string> = {
    food: 'Food & Dining',
    transport: 'Transportation',
    utilities: 'Utilities',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    health: 'Health & Medical',
    housing: 'Housing & Rent',
    education: 'Education',
    travel: 'Travel',
    other: 'Other'
  };
  
  return names[category] || 'Unknown';
};

// Get category color
export const getCategoryColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    food: '#FF6B6B',         // Red
    transport: '#48BEFF',    // Blue
    utilities: '#8C82FC',    // Purple
    entertainment: '#FF9F1C', // Orange
    shopping: '#FF85EA',     // Pink
    health: '#4ECDC4',       // Teal
    housing: '#8A9BA8',      // Grey
    education: '#41EAD4',    // Turquoise
    travel: '#FBAD50',       // Amber
    other: '#B8B8B8'         // Light grey
  };
  
  return colors[category] || '#B8B8B8';
};

// Get category icon name (to be used with Lucide icons)
export const getCategoryIcon = (category: ExpenseCategory): string => {
  const icons: Record<ExpenseCategory, string> = {
    food: 'UtensilsCrossed',
    transport: 'Car',
    utilities: 'Lightbulb',
    entertainment: 'Tv',
    shopping: 'ShoppingBag',
    health: 'Stethoscope',
    housing: 'Home',
    education: 'GraduationCap',
    travel: 'Plane',
    other: 'CircleDot'
  };
  
  return icons[category] || 'CircleDot';
};

// Group expenses by category
export const groupExpensesByCategory = (expenses: Array<{ category: ExpenseCategory; amount: number }>) => {
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);
};

// Group expenses by day for the last n days
export const groupExpensesByDay = (expenses: Array<{ date: Date; amount: number }>, days: number) => {
  const result: Record<string, number> = {};
  const today = new Date();
  
  // Initialize all dates with zero
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    result[dateStr] = 0;
  }
  
  // Fill in actual expense amounts
  expenses.forEach(expense => {
    const dateStr = expense.date.toISOString().split('T')[0];
    if (result[dateStr] !== undefined) {
      result[dateStr] += expense.amount;
    }
  });
  
  return result;
};

// Calculate total expenses
export const calculateTotalExpenses = (expenses: Array<{ amount: number }>): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Calculate budget usage
export const calculateBudgetUsage = (
  expenses: Array<{ category: ExpenseCategory; amount: number }>,
  budgets: Array<{ category: ExpenseCategory; amount: number }>
) => {
  const expensesByCategory = groupExpensesByCategory(expenses);
  
  return budgets.map(budget => {
    const spent = expensesByCategory[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;
    
    return {
      ...budget,
      spent,
      remaining: budget.amount - spent,
      percentage: Math.min(100, Math.round(percentage))
    };
  });
};

// Calculate net worth across all accounts
export const calculateNetWorth = (accounts: Array<{ balance: number }>): number => {
  return accounts.reduce((total, account) => total + account.balance, 0);
};

// Generate random ID
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Filter expenses by date range
export const filterExpensesByDateRange = (
  expenses: Array<{ date: Date }>,
  startDate: Date,
  endDate: Date
) => {
  return expenses.filter(expense => {
    return expense.date >= startDate && expense.date <= endDate;
  });
};

// Filter expenses by category
export const filterExpensesByCategory = (
  expenses: Array<{ category: ExpenseCategory }>,
  categories: ExpenseCategory[]
) => {
  if (!categories.length) return expenses;
  return expenses.filter(expense => categories.includes(expense.category));
};

// Get month name
export const getMonthName = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};