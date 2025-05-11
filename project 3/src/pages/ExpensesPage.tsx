import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseForm from '../components/expenses/ExpenseForm';
import { getUserExpenses, saveUserExpenses } from '../lib/mockData';
import { Expense } from '../lib/types';
import { Plus, X } from 'lucide-react';

const ExpensesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      // Load expenses data
      setExpenses(getUserExpenses(user.id));
      setIsLoading(false);
    }
    
    // Show form if the URL includes /new
    if (location.pathname.includes('/expenses/new')) {
      setShowForm(true);
    }
  }, [user, isAuthenticated, navigate, location.pathname]);
  
  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
    navigate('/expenses/new');
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
    navigate('/expenses');
  };
  
  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };
  
  const handleDeleteExpense = (expense: Expense) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const updatedExpenses = expenses.filter(e => e.id !== expense.id);
      setExpenses(updatedExpenses);
      saveUserExpenses(user.id, updatedExpenses);
    }
  };
  
  const handleSaveExpense = (expenseData: Expense) => {
    if (!user) return;
    
    let updatedExpenses: Expense[];
    
    if (editingExpense) {
      // Update existing expense
      updatedExpenses = expenses.map(e => 
        e.id === expenseData.id ? { ...expenseData, userId: user.id } : e
      );
    } else {
      // Add new expense
      updatedExpenses = [
        { ...expenseData, userId: user.id },
        ...expenses
      ];
    }
    
    setExpenses(updatedExpenses);
    saveUserExpenses(user.id, updatedExpenses);
    setShowForm(false);
    setEditingExpense(null);
    navigate('/expenses');
  };
  
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
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your expenses
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={handleAddExpense}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <Plus className="mr-2 -ml-1 h-5 w-5" />
            Add Expense
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
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
              <ExpenseForm 
                onSubmit={handleSaveExpense} 
                initialData={editingExpense || {}}
                isEditing={!!editingExpense}
              />
            </div>
          </div>
        </div>
      )}
      
      <ExpenseList 
        expenses={expenses} 
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />
    </div>
  );
};

export default ExpensesPage;