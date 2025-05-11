import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Expense } from '../../lib/types';
import { formatCurrency } from '../../lib/utils';

interface ExpenseGraphProps {
  expenses: Expense[];
  days?: number;
}

const ExpenseGraph: React.FC<ExpenseGraphProps> = ({ expenses, days = 7 }) => {
  const today = new Date();
  const data = Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayExpenses = expenses.filter(expense => 
      expense.date.toDateString() === date.toDateString()
    );
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    };
  }).reverse();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900">Daily Expenses</h3>
      <div className="mt-5 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Amount']}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#0D9488"
              fillOpacity={1}
              fill="url(#colorAmount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseGraph;