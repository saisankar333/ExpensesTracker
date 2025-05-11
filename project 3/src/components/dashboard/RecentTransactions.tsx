import React from 'react';
import { Expense } from '../../lib/types';
import { formatCurrency, formatDate, getCategoryName, getCategoryIcon } from '../../lib/utils';
import * as Icons from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Expense[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const sortedTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {sortedTransactions.map((transaction) => {
          const IconComponent = (Icons as Record<string, React.FC<Icons.LucideProps>>)[getCategoryIcon(transaction.category)];
          
          return (
            <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-full bg-gray-100">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {getCategoryName(transaction.category)}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
        <a href="/expenses" className="text-sm font-medium text-teal-600 hover:text-teal-500">
          View all transactions →
        </a>
      </div>
    </div>
  );
};

export default RecentTransactions;