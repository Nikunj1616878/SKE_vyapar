import React from 'react';
import { DollarSign, Users, ShoppingCart, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/dashboard/MetricCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SalesChart from '../components/dashboard/SalesChart';

const Dashboard = () => {
  const { user } = useAuth();

  const metrics = [
    { 
      title: 'Total Sales', 
      value: '₹58,245', 
      change: '+12.5%', 
      isPositive: true, 
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-700',
    },
    { 
      title: 'Total Customers', 
      value: '156', 
      change: '+8.2%', 
      isPositive: true, 
      icon: Users,
      color: 'bg-green-50 text-green-700',
    },
    { 
      title: 'Total Products', 
      value: '432', 
      change: '+5.1%', 
      isPositive: true, 
      icon: ShoppingCart,
      color: 'bg-purple-50 text-purple-700',
    },
    { 
      title: 'Total Profit', 
      value: '₹16,853', 
      change: '-2.4%', 
      isPositive: false, 
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-700',
    },
  ];

  return (
    <div className="pb-16 lg:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-600">Here's what's happening with your business today.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
            <select className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <SalesChart />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </button>
          </div>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;