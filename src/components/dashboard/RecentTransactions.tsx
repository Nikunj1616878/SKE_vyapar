import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

const transactions = [
  {
    id: 1,
    name: 'Invoice #INV-001',
    date: 'Jun 12, 2025',
    amount: '₹1,250',
    status: 'paid',
    type: 'income',
  },
  {
    id: 2,
    name: 'Office Supplies',
    date: 'Jun 10, 2025',
    amount: '₹350',
    status: 'completed',
    type: 'expense',
  },
  {
    id: 3,
    name: 'Invoice #INV-002',
    date: 'Jun 8, 2025',
    amount: '₹2,840',
    status: 'paid',
    type: 'income',
  },
  {
    id: 4,
    name: 'Electricity Bill',
    date: 'Jun 5, 2025',
    amount: '₹630',
    status: 'completed',
    type: 'expense',
  },
  {
    id: 5,
    name: 'Invoice #INV-003',
    date: 'Jun 3, 2025',
    amount: '₹980',
    status: 'pending',
    type: 'income',
  },
];

const RecentTransactions = () => {
  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full mr-3 ${
                    transaction.type === 'income'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.name}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'} {transaction.amount}
                </p>
                <p
                  className={`text-xs ${
                    transaction.status === 'paid' || transaction.status === 'completed'
                      ? 'text-green-600'
                      : transaction.status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                  }`}
                >
                  {transaction.status}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;