import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  color: string;
}

const MetricCard = ({ title, value, change, isPositive, icon: Icon, color }: MetricCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 transition-transform duration-300 hover:transform hover:scale-[1.02]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-3">
        <span
          className={`inline-flex items-center text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change}
          <span className="ml-1">vs last month</span>
        </span>
      </div>
    </div>
  );
};

export default MetricCard;