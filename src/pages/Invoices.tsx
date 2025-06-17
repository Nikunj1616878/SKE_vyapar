import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import CreateInvoiceModal from '../components/invoices/CreateInvoiceModal';
import ViewInvoiceModal from '../components/invoices/ViewInvoiceModal';
import EditInvoiceModal from '../components/invoices/EditInvoiceModal';
import InvoiceFilters from '../components/invoices/InvoiceFilters';
import ExportModal from '../components/invoices/ExportModal';
import { useInvoices } from '../context/InvoiceContext';
import { useCustomers } from '../context/CustomerContext';

const Invoices = () => {
  const { invoices, addInvoice } = useInvoices();
  const { customers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    customer: '',
  });

  const handleCreateInvoice = () => {
    setShowCreateModal(true);
  };

  const handleSubmitInvoice = (invoiceData: any) => {
    // Get customer name
    const customer = customers.find(c => c.id === parseInt(invoiceData.customerId));
    const invoiceWithCustomer = {
      ...invoiceData,
      customerName: customer ? `${customer.name} - ${customer.company}` : 'Unknown Customer'
    };
    
    addInvoice(invoiceWithCustomer);
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

  const handleView = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setShowViewModal(true);
  };

  const handleEdit = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setShowEditModal(true);
  };

  // Parse date string to Date object for comparison
  const parseDate = (dateString: string) => {
    // Handle different date formats
    const parts = dateString.split(' ');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const monthMap: { [key: string]: number } = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      return new Date(parseInt(year), monthMap[month], parseInt(day));
    }
    return new Date(dateString);
  };

  // Apply filters and search
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      // Search filter
      const matchesSearch = !searchTerm || 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = !filters.status || invoice.status === filters.status;

      // Date range filter
      let matchesDateRange = true;
      if (filters.dateFrom || filters.dateTo) {
        const invoiceDate = parseDate(invoice.date);
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          matchesDateRange = matchesDateRange && invoiceDate >= fromDate;
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          matchesDateRange = matchesDateRange && invoiceDate <= toDate;
        }
      }

      // Amount range filter
      let matchesAmountRange = true;
      if (filters.amountMin || filters.amountMax) {
        const amount = parseFloat(invoice.amount.replace('₹', '').replace(',', ''));
        if (filters.amountMin) {
          matchesAmountRange = matchesAmountRange && amount >= parseFloat(filters.amountMin);
        }
        if (filters.amountMax) {
          matchesAmountRange = matchesAmountRange && amount <= parseFloat(filters.amountMax);
        }
      }

      // Customer filter
      const matchesCustomer = !filters.customer || 
        invoice.customerName.toLowerCase().includes(filters.customer.toLowerCase());

      return matchesSearch && matchesStatus && matchesDateRange && matchesAmountRange && matchesCustomer;
    });
  }, [invoices, searchTerm, filters]);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Invoices</h1>
        <button 
          onClick={handleCreateInvoice}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
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
              placeholder="Search invoices..."
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
              {filters.status && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Status: {filters.status}
                </span>
              )}
              {filters.dateFrom && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  From: {filters.dateFrom}
                </span>
              )}
              {filters.dateTo && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  To: {filters.dateTo}
                </span>
              )}
              {filters.amountMin && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Min: ₹{filters.amountMin}
                </span>
              )}
              {filters.amountMax && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Max: ₹{filters.amountMax}
                </span>
              )}
              {filters.customer && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Customer: {filters.customer}
                </span>
              )}
              <button
                onClick={() => handleApplyFilters({
                  status: '', dateFrom: '', dateTo: '', amountMin: '', amountMax: '', customer: ''
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
          Showing {filteredInvoices.length} of {invoices.length} invoices
          {hasActiveFilters && ' (filtered)'}
        </p>
      </div>

      {/* Invoices list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {hasActiveFilters ? 'No invoices match your filters' : 'No invoices found'}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleView(invoice.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleEdit(invoice.id)}
                        className="text-gray-600 hover:text-gray-900"
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
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitInvoice}
      />

      <ViewInvoiceModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedInvoiceId(null);
        }}
        invoiceId={selectedInvoiceId}
      />

      <EditInvoiceModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedInvoiceId(null);
        }}
        invoiceId={selectedInvoiceId}
      />

      <InvoiceFilters
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        invoices={invoices}
        filteredInvoices={filteredInvoices}
      />
    </div>
  );
};

export default Invoices;