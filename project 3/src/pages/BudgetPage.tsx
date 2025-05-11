import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BudgetProgress from '../components/budget/BudgetProgress';
import BudgetForm from '../components/budget/BudgetForm';
import { getUserBudgets, getUserExpenses, saveUserBudgets } from '../lib/mockData';
import { Budget, Expense, ExpenseCategory } from '../lib/types';
import { Plus, X } from 'lucide-react';

const BudgetPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      // Load budgets and expenses data
      setBudgets(getUserBudgets(user.id));
      setExpenses(getUserExpenses(user.id));
      setIsLoading(false);
    }
  }, [user, isAuthenticated, navigate]);
  
  const handleAddBudget = () => {
    setEditingBudget(null);
    setShowForm(true);
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBudget(null);
  };
  
  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };
  
  const handleSaveBudget = (budgetData: Budget) => {
    if (!user) return;
    
    let updatedBudgets: Budget[];
    
    if (editingBudget) {
      // Update existing budget
      updatedBudgets = budgets.map(b => 
        b.id === budgetData.id ? { ...budgetData, userId: user.id } : b
      );
    } else {
      // Add new budget
      updatedBudgets = [
        ...budgets,
        { ...budgetData, userId: user.id }
      ];
    }
    
    setBudgets(updatedBudgets);
    saveUserBudgets(user.id, updatedBudgets);
    setShowForm(false);
    setEditingBudget(null);
  };
  
  // Get list of categories that already have budgets
  const existingCategories = budgets.map(budget => budget.category);
  
  // Filter current month expenses for budget progress
  const currentDate = new Date();
  const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const currentMonthExpenses = expenses.filter(expense => 
    expense.date >= currentMonthStart && expense.date <= currentDate
  );
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set and monitor your spending limits
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={handleAddBudget}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            disabled={existingCategories.length === 10} // All categories have budgets
          >
            <Plus className="mr-2 -ml-1 h-5 w-5" />
            Add Budget
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {editingBudget ? 'Edit Budget' : 'Create Budget'}
              </h3>
              <button
                type="button"
                onClick={handleCloseForm}
                className="mt-3 sm:mt-0 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="mt-5">
              <BudgetForm 
                onSubmit={handleSaveBudget} 
                initialData={editingBudget || {}}
                isEditing={!!editingBudget}
                existingCategories={existingCategories as ExpenseCategory[]}
              />
            </div>
          </div>
        </div>
      )}
      
      {budgets.length > 0 ? (
        <BudgetProgress budgets={budgets} expenses={currentMonthExpenses} />
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-8 sm:px-6 text-center">
            <p className="text-sm text-gray-500">
              You haven't set up any budgets yet. Click the 'Add Budget' button to get started.
            </p>
          </div>
        </div>
      )}
      
      <div className="rounded-lg bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Budget Tip</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Experts recommend the 50/30/20 rule: Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;