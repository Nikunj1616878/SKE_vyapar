import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import CreateCustomerModal from '../components/customers/CreateCustomerModal';
import ViewCustomerModal from '../components/customers/ViewCustomerModal';
import EditCustomerModal from '../components/customers/EditCustomerModal';
import CustomerFilters from '../components/customers/CustomerFilters';
import CustomerExportModal from '../components/customers/CustomerExportModal';
import { useCustomers } from '../context/CustomerContext';

const Customers = () => {
  const { customers, addCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    company: '',
    location: '',
    hasGSTIN: '',
    orderCount: '',
  });

  const handleAddCustomer = () => {
    setShowCreateModal(true);
  };

  const handleSubmitCustomer = (customerData: any) => {
    addCustomer(customerData);
    setShowCreateModal(false);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleView = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setShowViewModal(true);
  };

  const handleEdit = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setShowEditModal(true);
  };

  // Apply filters and search
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Search filter
      const matchesSearch = !searchTerm || 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Company filter
      const matchesCompany = !filters.company || 
        customer.company.toLowerCase().includes(filters.company.toLowerCase());

      // Location filter
      const matchesLocation = !filters.location || 
        customer.address.toLowerCase().includes(filters.location.toLowerCase());

      // GSTIN filter
      let matchesGSTIN = true;
      if (filters.hasGSTIN === 'yes') {
        matchesGSTIN = customer.gstin && customer.gstin.trim() !== '';
      } else if (filters.hasGSTIN === 'no') {
        matchesGSTIN = !customer.gstin || customer.gstin.trim() === '';
      }

      // Order count filter (placeholder logic - in real app would check actual orders)
      let matchesOrderCount = true;
      if (filters.orderCount === 'active') {
        // Placeholder: customers with recent activity
        matchesOrderCount = true;
      } else if (filters.orderCount === 'new') {
        // Placeholder: new customers
        matchesOrderCount = true;
      } else if (filters.orderCount === 'inactive') {
        // Placeholder: inactive customers
        matchesOrderCount = true;
      }

      return matchesSearch && matchesCompany && matchesLocation && matchesGSTIN && matchesOrderCount;
    });
  }, [customers, searchTerm, filters]);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Customers</h1>
        <button 
          onClick={handleAddCustomer}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </button>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleFilter}
              className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                hasActiveFilters 
                  ? 'border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                  •
                </span>
              )}
            </button>
            <button 
              onClick={handleExport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {filters.company && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Company: {filters.company}
                </span>
              )}
              {filters.location && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Location: {filters.location}
                </span>
              )}
              {filters.hasGSTIN && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  GSTIN: {filters.hasGSTIN === 'yes' ? 'Has GSTIN' : 'No GSTIN'}
                </span>
              )}
              {filters.orderCount && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Activity: {filters.orderCount}
                </span>
              )}
              <button
                onClick={() => handleApplyFilters({
                  company: '', location: '', hasGSTIN: '', orderCount: ''
                })}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredCustomers.length} of {customers.length} customers
          {hasActiveFilters && ' (filtered)'}
        </p>
      </div>

      {/* Customer list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {hasActiveFilters ? 'No customers match your filters' : 'No customers found'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">
                            {customer.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹0
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleView(customer.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-150 ease-in-out"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleEdit(customer.id)}
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-150 ease-in-out"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateCustomerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitCustomer}
      />

      <ViewCustomerModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCustomerId(null);
        }}
        customerId={selectedCustomerId}
      />

      <EditCustomerModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCustomerId(null);
        }}
        customerId={selectedCustomerId}
      />

      <CustomerFilters
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

      <CustomerExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        customers={customers}
        filteredCustomers={filteredCustomers}
      />
    </div>
  );
};

export default Customers;