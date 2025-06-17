import React from 'react';

const SalesChart = () => {
  // This is a placeholder for a real chart component
  // In a real application, you would use a charting library like Chart.js, Recharts, etc.
  return (
    <div className="h-64 w-full bg-gray-50 rounded flex items-center justify-center">
      <div className="relative w-full h-full p-4">
        {/* Placeholder for chart - in a real app, this would be an actual chart */}
        <div className="absolute bottom-0 inset-x-0 h-[60%] bg-gradient-to-t from-blue-500/20 to-blue-500/5 rounded"></div>
        
        {/* Simulating chart bars */}
        <div className="absolute bottom-0 inset-x-0 flex justify-between items-end h-[60%] px-6">
          {[40, 65, 50, 80, 60, 55, 70].map((height, index) => (
            <div 
              key={index} 
              style={{ height: `${height}%` }}
              className="w-8 bg-blue-600 rounded-t transition-all duration-300 hover:bg-blue-700"
            ></div>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-[-24px] inset-x-0 flex justify-between px-6">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <span key={index} className="text-xs text-gray-500">{day}</span>
          ))}
        </div>
        
        {/* Y-axis (simplified) */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
          <span>₹5K</span>
          <span>₹3K</span>
          <span>₹1K</span>
          <span>₹0</span>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;