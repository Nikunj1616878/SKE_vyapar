import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  BarChart3 
} from 'lucide-react';

const MobileNav = () => {
  const navItems = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Invoices', to: '/invoices', icon: FileText },
    { name: 'Inventory', to: '/inventory', icon: Package },
    { name: 'Customers', to: '/customers', icon: Users },
    { name: 'Reports', to: '/reports', icon: BarChart3 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 lg:hidden">
      <nav className="flex justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 text-xs font-medium ${
                isActive ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-6 w-6 mb-1 ${
                    isActive ? 'text-blue-700' : 'text-gray-500'
                  }`}
                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;