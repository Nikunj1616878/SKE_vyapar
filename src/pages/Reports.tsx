import React, { useState } from 'react';
import { Download, Calendar, Filter } from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const reports = [
    { id: 'sales', name: 'Sales Report' },
    { id: 'expenses', name: 'Expense Report' },
    { id: 'inventory', name: 'Inventory Report' },
    { id: 'profit', name: 'Profit & Loss' },
    { id: 'tax', name: 'Tax Report' },
    { id: 'customer', name: 'Customer Report' },
  ];

  const periods = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' },
    { id: 'custom', name: 'Custom Range' },
  ];

  return (
    <div className="pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Reports</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Report types */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Report Types</h2>
          </div>
          <div className="p-4">
            <ul className="space-y-1">
              {reports.map((report) => (
                <li key={report.id}>
                  <button
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      selectedReport === report.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {report.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Report content */}
        <div className="md:col-span-2 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
              {reports.find((r) => r.id === selectedReport)?.name}
            </h2>
            <div className="flex space-x-3">
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="appearance-none pl-8 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </button>
            </div>
          </div>

          <div className="p-6">
            {selectedReport === 'sales' && (
              <div>
                <div className="h-72 bg-gray-50 rounded mb-6 p-4 flex items-center justify-center">
                  {/* Placeholder for sales chart */}
                  <div className="relative w-full h-full">
                    <div className="absolute bottom-0 inset-x-0 h-[80%] bg-gradient-to-t from-blue-500/20 to-blue-500/5 rounded"></div>
                    
                    {/* Simulating chart bars */}
                    <div className="absolute bottom-0 inset-x-0 flex justify-between items-end h-[80%] px-6">
                      {[65, 59, 80, 81, 56, 55, 70, 90, 81, 75, 85, 96].map((height, index) => (
                        <div 
                          key={index} 
                          style={{ height: `${height}%` }}
                          className="w-5 bg-blue-600 rounded-t transition-all duration-300 hover:bg-blue-700"
                        ></div>
                      ))}
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="absolute bottom-[-24px] inset-x-0 flex justify-between px-6">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                        <span key={index} className="text-xs text-gray-500">{month}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-700">Total Sales</h3>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">₹2,58,245</p>
                    <p className="text-sm text-blue-700">+12.5% from last month</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-700">Average Order</h3>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">₹1,850</p>
                    <p className="text-sm text-green-700">+5.2% from last month</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-purple-700">Conversion Rate</h3>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">3.2%</p>
                    <p className="text-sm text-purple-700">+0.8% from last month</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Top Selling Products</h3>
                  <ul className="space-y-3">
                    {[
                      { name: 'Laptop - HP Pavilion', amount: '₹58,999', quantity: 10 },
                      { name: 'Wireless Mouse', amount: '₹999', quantity: 32 },
                      { name: 'Office Desk - Standing', amount: '₹12,499', quantity: 8 },
                      { name: 'USB-C Dock', amount: '₹4,599', quantity: 12 },
                      { name: 'Ergonomic Chair', amount: '₹8,999', quantity: 7 },
                    ].map((product, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-900">{product.name}</span>
                        <span className="text-sm text-gray-500">
                          {product.amount} × {product.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedReport !== 'sales' && (
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
                <p className="text-gray-500">Select a date range and filters to generate the report</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;