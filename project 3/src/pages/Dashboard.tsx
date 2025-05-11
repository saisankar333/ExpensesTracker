import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardStats from '../components/dashboard/DashboardStats';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import ExpenseGraph from '../components/dashboard/ExpenseGraph';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { getUserExpenses, getUserBudgets, getUserAccounts, initializeUserData } from '../lib/mockData';
import { Expense, Budget, Account, ExpenseCategory } from '../lib/types';
import { calculateBudgetUsage, calculateNetWorth, groupExpensesByCategory } from '../lib/utils';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      initializeUserData(user.id);
      setExpenses(getUserExpenses(user.id));
      setBudgets(getUserBudgets(user.id));
      setAccounts(getUserAccounts(user.id));
      setIsLoading(false);
    }
  }, [user, isAuthenticated, navigate]);
  
  const currentDate = new Date();
  const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const currentMonthExpenses = expenses.filter(expense => 
    expense.date >= currentMonthStart && expense.date <= currentDate
  );
  
  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetUsage = budgets.length > 0 
    ? Math.round((totalExpenses / budgets.reduce((sum, budget) => sum + budget.amount, 0)) * 100) 
    : 0;
  const netWorth = calculateNetWorth(accounts);
  const monthlyChange = 3.5;
  
  const expensesByCategory = groupExpensesByCategory(currentMonthExpenses);
  const totalMonthlyExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  
  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category: category as ExpenseCategory,
    amount,
    percentage: totalMonthlyExpenses > 0 ? (amount / totalMonthlyExpenses) * 100 : 0
  }));
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your financial situation for {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </p>
      </div>
      
      <DashboardStats 
        totalExpenses={totalExpenses}
        budgetUsage={budgetUsage}
        netWorth={netWorth}
        monthlyChange={monthlyChange}
      />
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ExpenseChart 
          data={chartData} 
          title="Monthly Expenses by Category" 
        />
        <RecentTransactions transactions={expenses} />
      </div>
      
      <ExpenseGraph expenses={expenses} days={7} />
      
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Budget Progress</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {calculateBudgetUsage(currentMonthExpenses, budgets)
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 3)
            .map(budget => (
              <div key={budget.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
                    </h3>
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        budget.percentage >= 100 
                          ? 'bg-red-100 text-red-800' 
                          : budget.percentage >= 75 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {budget.percentage}%
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-xl font-semibold text-gray-900">
                      ${budget.spent.toFixed(2)}
                    </p>
                    <p className="ml-2 text-sm text-gray-500">
                      of ${budget.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div 
                          style={{ 
                            width: `${Math.min(budget.percentage, 100)}%`,
                            backgroundColor: budget.percentage >= 100 
                              ? '#EF4444' 
                              : budget.percentage >= 75 
                                ? '#F59E0B' 
                                : '#10B981' 
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        
        <div className="mt-4 text-right">
          <a href="/budget" className="text-sm font-medium text-teal-600 hover:text-teal-500">
            View all budgets<span aria-hidden="true"> →</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;