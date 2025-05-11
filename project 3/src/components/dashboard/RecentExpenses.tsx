import React from 'react';
import { Expense } from '../../lib/types';
import { formatCurrency, formatDate, getCategoryName } from '../../lib/utils';
import * as Icons from 'lucide-react';
import { getCategoryIcon } from '../../lib/utils';

interface RecentExpensesProps {
  expenses: Expense[];
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({ expenses }) => {
  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5); // Show only the 5 most recent
  
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Expenses</h3>
        <p className="mt-1 text-sm text-gray-500">
          Your 5 most recent transactions
        </p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sortedExpenses.length > 0 ? (
          sortedExpenses.map((expense) => {
            // Dynamically get the correct icon from Lucide
            const IconComponent = (Icons as Record<string, React.FC<Icons.LucideProps>>)[getCategoryIcon(expense.category)] || Icons.CircleDot;
            
            return (
              <div key={expense.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="p-2 rounded-full bg-gray-100">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-xs">
                        {expense.description}
                      </p>
                      <div className="flex items-center">
                        <p className="text-xs text-gray-500 mr-2">
                          {getCategoryName(expense.category)}
                        </p>
                        {expense.isRecurring && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            Recurring
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(expense.date)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">
            <p>No recent expenses</p>
          </div>
        )}
      </div>
      
      <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50">
        <div className="text-sm">
          <a href="/expenses" className="font-medium text-teal-600 hover:text-teal-500">
            View all expenses<span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecentExpenses;