import React from 'react';
import { Budget, Expense, ExpenseCategory } from '../../lib/types';
import { formatCurrency, getCategoryName, getCategoryColor } from '../../lib/utils';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetItemProps {
  category: ExpenseCategory;
  budgetAmount: number;
  spentAmount: number;
  percentage: number;
}

const BudgetItem: React.FC<BudgetItemProps> = ({
  category,
  budgetAmount,
  spentAmount,
  percentage
}) => {
  const isOverBudget = percentage >= 100;
  const isNearLimit = percentage >= 80 && percentage < 100;
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg p-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{getCategoryName(category)}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(spentAmount)}
            </p>
            <p className="ml-2 text-sm text-gray-500">
              of {formatCurrency(budgetAmount)}
            </p>
          </div>
        </div>
        
        {isOverBudget ? (
          <div className="flex-shrink-0 bg-red-100 rounded-full p-1">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
        ) : isNearLimit ? (
          <div className="flex-shrink-0 bg-yellow-100 rounded-full p-1">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
        ) : (
          <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <div className="relative pt-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-teal-600">
                {percentage}% used
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-teal-600">
                {formatCurrency(budgetAmount - spentAmount)} remaining
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 mt-1">
            <div
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: percentage >= 100 
                  ? '#EF4444' 
                  : percentage >= 80 
                    ? '#F59E0B' 
                    : getCategoryColor(category)
              }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BudgetProgressProps {
  budgets: Budget[];
  expenses: Expense[];
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budgets, expenses }) => {
  // Calculate spent amount for each budget category
  const spentByCategory: Record<ExpenseCategory, number> = {};
  
  // Initialize all budget categories with zero
  budgets.forEach(budget => {
    spentByCategory[budget.category] = 0;
  });
  
  // Sum up expenses for each category
  expenses.forEach(expense => {
    if (spentByCategory[expense.category] !== undefined) {
      spentByCategory[expense.category] += expense.amount;
    }
  });
  
  // Calculate percentage and prepare data for display
  const budgetData = budgets.map(budget => {
    const spent = spentByCategory[budget.category] || 0;
    const percentage = Math.round((spent / budget.amount) * 100);
    
    return {
      category: budget.category,
      budgetAmount: budget.amount,
      spentAmount: spent,
      percentage,
      id: budget.id
    };
  });
  
  return (
    <div className="space-y-6">
      {budgetData.map(item => (
        <BudgetItem
          key={item.id}
          category={item.category}
          budgetAmount={item.budgetAmount}
          spentAmount={item.spentAmount}
          percentage={item.percentage}
        />
      ))}
    </div>
  );
};

export default BudgetProgress;