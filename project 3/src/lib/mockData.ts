import { Expense, ExpenseCategory, Budget, Account } from './types';

// Mock expenses data
export const generateMockExpenses = (userId: string): Expense[] => {
  const categories: ExpenseCategory[] = [
    'food', 'transport', 'utilities', 'entertainment', 
    'shopping', 'health', 'housing', 'education', 
    'travel', 'other'
  ];
  
  // Create date objects for the last 30 days
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  });
  
  // Generate random expenses
  return Array.from({ length: 45 }, (_, i) => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomDate = dates[Math.floor(Math.random() * dates.length)];
    const isRecurring = Math.random() > 0.7;
    
    let amount;
    switch (randomCategory) {
      case 'housing':
        amount = Math.floor(Math.random() * 1000) + 500;
        break;
      case 'food':
        amount = Math.floor(Math.random() * 50) + 10;
        break;
      case 'travel':
        amount = Math.floor(Math.random() * 500) + 100;
        break;
      default:
        amount = Math.floor(Math.random() * 100) + 10;
    }
    
    return {
      id: `exp_${i}_${Date.now()}`,
      userId,
      amount,
      category: randomCategory,
      description: `${randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)} expense`,
      date: randomDate,
      isRecurring,
      ...(isRecurring && {
        recurringInterval: ['monthly', 'weekly', 'yearly'][Math.floor(Math.random() * 3)] as 'weekly' | 'monthly' | 'yearly'
      })
    };
  });
};

// Mock budgets data
export const generateMockBudgets = (userId: string): Budget[] => {
  return [
    {
      id: 'budget_1',
      userId,
      category: 'food',
      amount: 500,
      period: 'monthly'
    },
    {
      id: 'budget_2',
      userId,
      category: 'transport',
      amount: 200,
      period: 'monthly'
    },
    {
      id: 'budget_3',
      userId,
      category: 'entertainment',
      amount: 300,
      period: 'monthly'
    },
    {
      id: 'budget_4',
      userId,
      category: 'housing',
      amount: 1200,
      period: 'monthly'
    },
    {
      id: 'budget_5',
      userId,
      category: 'utilities',
      amount: 250,
      period: 'monthly'
    }
  ];
};

// Mock accounts data
export const generateMockAccounts = (userId: string): Account[] => {
  return [
    {
      id: 'acc_1',
      userId,
      name: 'Checking Account',
      balance: 4750.25,
      type: 'bank'
    },
    {
      id: 'acc_2',
      userId,
      name: 'Savings Account',
      balance: 12500.80,
      type: 'bank'
    },
    {
      id: 'acc_3',
      userId,
      name: 'Credit Card',
      balance: -1250.45,
      type: 'credit'
    },
    {
      id: 'acc_4',
      userId,
      name: 'Investment Portfolio',
      balance: 8750.32,
      type: 'investment'
    },
    {
      id: 'acc_5',
      userId,
      name: 'Cash',
      balance: 325.75,
      type: 'cash'
    }
  ];
};

// Initialize data for a user if it doesn't exist
export const initializeUserData = (userId: string) => {
  // Load existing data from localStorage or initialize
  const expensesKey = `expenseTracker_expenses_${userId}`;
  const budgetsKey = `expenseTracker_budgets_${userId}`;
  const accountsKey = `expenseTracker_accounts_${userId}`;
  
  if (!localStorage.getItem(expensesKey)) {
    localStorage.setItem(expensesKey, JSON.stringify(generateMockExpenses(userId)));
  }
  
  if (!localStorage.getItem(budgetsKey)) {
    localStorage.setItem(budgetsKey, JSON.stringify(generateMockBudgets(userId)));
  }
  
  if (!localStorage.getItem(accountsKey)) {
    localStorage.setItem(accountsKey, JSON.stringify(generateMockAccounts(userId)));
  }
};

// Helper functions to get data for a user
export const getUserExpenses = (userId: string): Expense[] => {
  const expensesKey = `expenseTracker_expenses_${userId}`;
  const storedExpenses = localStorage.getItem(expensesKey);
  
  if (!storedExpenses) {
    const expenses = generateMockExpenses(userId);
    localStorage.setItem(expensesKey, JSON.stringify(expenses));
    return expenses;
  }
  
  return JSON.parse(storedExpenses).map((expense: any) => ({
    ...expense,
    date: new Date(expense.date)
  }));
};

export const getUserBudgets = (userId: string): Budget[] => {
  const budgetsKey = `expenseTracker_budgets_${userId}`;
  const storedBudgets = localStorage.getItem(budgetsKey);
  
  if (!storedBudgets) {
    const budgets = generateMockBudgets(userId);
    localStorage.setItem(budgetsKey, JSON.stringify(budgets));
    return budgets;
  }
  
  return JSON.parse(storedBudgets);
};

export const getUserAccounts = (userId: string): Account[] => {
  const accountsKey = `expenseTracker_accounts_${userId}`;
  const storedAccounts = localStorage.getItem(accountsKey);
  
  if (!storedAccounts) {
    const accounts = generateMockAccounts(userId);
    localStorage.setItem(accountsKey, JSON.stringify(accounts));
    return accounts;
  }
  
  return JSON.parse(storedAccounts);
};

// Save data functions
export const saveUserExpenses = (userId: string, expenses: Expense[]) => {
  const expensesKey = `expenseTracker_expenses_${userId}`;
  localStorage.setItem(expensesKey, JSON.stringify(expenses));
};

export const saveUserBudgets = (userId: string, budgets: Budget[]) => {
  const budgetsKey = `expenseTracker_budgets_${userId}`;
  localStorage.setItem(budgetsKey, JSON.stringify(budgets));
};

export const saveUserAccounts = (userId: string, accounts: Account[]) => {
  const accountsKey = `expenseTracker_accounts_${userId}`;
  localStorage.setItem(accountsKey, JSON.stringify(accounts));
};