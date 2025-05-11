import React from 'react';
import { ArrowDown, ArrowUp, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className={`px-5 py-3 ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="text-sm">
          <div className="flex items-center">
            {isPositive ? (
              <TrendingUp className="mr-1.5 h-4 w-4 flex-shrink-0 text-green-500" />
            ) : (
              <TrendingDown className="mr-1.5 h-4 w-4 flex-shrink-0 text-red-500" />
            )}
            <span className={`font-medium ${isPositive ? 'text-green-800' : 'text-red-800'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="ml-2 text-gray-500">from last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  totalExpenses: number;
  budgetUsage: number;
  netWorth: number;
  monthlyChange: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  totalExpenses, 
  budgetUsage, 
  netWorth, 
  monthlyChange 
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Expenses (This Month)"
        value={formatCurrency(totalExpenses)}
        change={-8.2} // Mock data
        icon={<DollarSign className="h-6 w-6 text-red-500" />}
      />
      
      <StatsCard
        title="Budget Usage"
        value={`${budgetUsage}%`}
        change={budgetUsage > 75 ? 12.3 : -12.3} // Change direction based on usage threshold
        icon={
          budgetUsage > 75 ? (
            <ArrowUp className="h-6 w-6 text-red-500" />
          ) : (
            <ArrowDown className="h-6 w-6 text-green-500" />
          )
        }
      />
      
      <StatsCard
        title="Net Worth"
        value={formatCurrency(netWorth)}
        change={monthlyChange}
        icon={<DollarSign className="h-6 w-6 text-green-500" />}
      />
    </div>
  );
};

export default DashboardStats;