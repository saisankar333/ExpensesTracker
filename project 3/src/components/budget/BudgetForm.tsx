import React, { useState } from 'react';
import { Budget, ExpenseCategory } from '../../lib/types';
import { generateId, getCategoryName } from '../../lib/utils';
import { Save } from 'lucide-react';

interface BudgetFormProps {
  onSubmit: (budget: Budget) => void;
  initialData?: Partial<Budget>;
  isEditing?: boolean;
  existingCategories?: ExpenseCategory[];
}

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  isEditing = false,
  existingCategories = []
}) => {
  const [amount, setAmount] = useState(initialData.amount?.toString() || '');
  const [category, setCategory] = useState<ExpenseCategory>(initialData.category || 'food');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>(
    initialData.period || 'monthly'
  );
  
  const allCategories: ExpenseCategory[] = [
    'food', 'transport', 'utilities', 'entertainment', 
    'shopping', 'health', 'housing', 'education', 
    'travel', 'other'
  ];
  
  // Filter out categories that already have budgets (unless editing)
  const availableCategories = isEditing 
    ? allCategories 
    : allCategories.filter(cat => !existingCategories.includes(cat));
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) return;
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;
    
    const budgetData: Budget = {
      id: initialData.id || generateId('budget'),
      userId: initialData.userId || 'current-user', // In a real app, this would come from auth
      amount: numericAmount,
      category,
      period
    };
    
    onSubmit(budgetData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
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
              disabled={isEditing} // Cannot change category when editing
            >
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>
                  {getCategoryName(cat)}
                </option>
              ))}
            </select>
          </div>
          {availableCategories.length === 0 && !isEditing && (
            <p className="mt-2 text-sm text-red-600">
              All categories already have budgets. Edit existing budgets instead.
            </p>
          )}
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Budget Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              min="0"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="period" className="block text-sm font-medium text-gray-700">
            Budget Period
          </label>
          <div className="mt-1">
            <select
              id="period"
              name="period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'weekly' | 'monthly' | 'yearly')}
              className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={availableCategories.length === 0 && !isEditing}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? 'Update Budget' : 'Create Budget'}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;