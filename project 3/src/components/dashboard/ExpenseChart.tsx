import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ExpenseCategory } from '../../lib/types';
import { getCategoryName, getCategoryColor } from '../../lib/utils';

interface CategoryExpense {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}

interface ExpenseChartProps {
  data: CategoryExpense[];
  title: string;
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data, title }) => {
  const chartData = data.map(item => ({
    name: getCategoryName(item.category),
    value: item.amount,
    color: getCategoryColor(item.category)
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      
      <div className="mt-5">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-4">
          {data.map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: getCategoryColor(item.category) }}
                  ></span>
                  <span className="text-sm font-medium text-gray-700">
                    {getCategoryName(item.category)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    ${item.amount.toFixed(2)}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                  <div
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: getCategoryColor(item.category)
                    }}
                    className="animate-grow-x shadow-none flex flex-col justify-center"
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;