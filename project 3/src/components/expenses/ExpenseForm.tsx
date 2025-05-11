import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '../../lib/types';
import { generateId, getCategoryName } from '../../lib/utils';
import { Calendar, DollarSign, Save } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  initialData?: Partial<Expense>;
  isEditing?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  isEditing = false 
}) => {
  const [amount, setAmount] = useState(initialData.amount?.toString() || '');
  const [category, setCategory] = useState<ExpenseCategory>(initialData.category || 'other');
  const [description, setDescription] = useState(initialData.description || '');
  const [date, setDate] = useState(
    initialData.date 
      ? initialData.date.toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );
  const [isRecurring, setIsRecurring] = useState(initialData.isRecurring || false);
  const [recurringInterval, setRecurringInterval] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>(
    initialData.recurringInterval || 'monthly'
  );
  
  const categories: ExpenseCategory[] = [
    'food', 'transport', 'utilities', 'entertainment', 
    'shopping', 'health', 'housing', 'education', 
    'travel', 'other'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !date) return;
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;
    
    const expenseData: Expense = {
      id: initialData.id || generateId('exp'),
      userId: initialData.userId || 'current-user', // In a real app, this would come from auth
      amount: numericAmount,
      category,
      description,
      date: new Date(date),
      isRecurring,
      ...(isRecurring && { recurringInterval })
    };
    
    onSubmit(expenseData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <div className="mt-1">
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {getCategoryName(cat)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="description"
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Grocery shopping, Netflix subscription, etc."
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="date"
              id="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <div className="flex items-start">
            <div className="flex items-center h-5 mt-6">
              <input
                id="isRecurring"
                name="isRecurring"
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isRecurring" className="font-medium text-gray-700">
                Recurring Expense
              </label>
              <p className="text-gray-500">Check if this is a recurring expense</p>
            </div>
          </div>
        </div>

        {isRecurring && (
          <div className="sm:col-span-3">
            <label htmlFor="recurringInterval" className="block text-sm font-medium text-gray-700">
              Recurrence Interval
            </label>
            <div className="mt-1">
              <select
                id="recurringInterval"
                name="recurringInterval"
                value={recurringInterval}
                onChange={(e) => setRecurringInterval(e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly')}
                className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? 'Update Expense' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;