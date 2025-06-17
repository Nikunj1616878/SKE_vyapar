import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, AlertCircle, Download, Upload } from 'lucide-react';
import CreateProductModal from '../components/inventory/CreateProductModal';
import ViewProductModal from '../components/inventory/ViewProductModal';
import EditProductModal from '../components/inventory/EditProductModal';
import InventoryFilters from '../components/inventory/InventoryFilters';
import InventoryExportModal from '../components/inventory/InventoryExportModal';
import BulkUploadModal from '../components/inventory/BulkUploadModal';
import { useInventory } from '../context/InventoryContext';

const Inventory = () => {
  const { inventory, addProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    status: '',
    priceMin: '',
    priceMax: '',
    stockMin: '',
    stockMax: '',
  });

  const handleAddProduct = () => {
    setShowCreateModal(true);
  };

  const handleBulkUpload = () => {
    setShowBulkUploadModal(true);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleView = (productId: number) => {
    setSelectedProductId(productId);
    setShowViewModal(true);
  };

  const handleEdit = (productId: number) => {
    setSelectedProductId(productId);
    setShowEditModal(true);
  };

  const handleSubmit = (productData: any) => {
    addProduct({
      name: productData.name,
      brand: productData.brand,
      category: productData.category,
      stock: parseInt(productData.stock),
      price: `₹${parseFloat(productData.price).toLocaleString('en-IN')}`,
      description: productData.description,
      sku: productData.sku,
      minStock: productData.minStock ? parseInt(productData.minStock) : undefined,
    });
    setShowCreateModal(false);
  };

  // Apply filters and search
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      // Search filter
      const matchesSearch = !searchTerm || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Brand filter
      const matchesBrand = !filters.brand || item.brand === filters.brand;

      // Category filter
      const matchesCategory = !filters.category || item.category === filters.category;

      // Status filter
      const matchesStatus = !filters.status || item.status === filters.status;

      // Price range filter
      let matchesPriceRange = true;
      if (filters.priceMin || filters.priceMax) {
        const price = parseFloat(item.price.replace('₹', '').replace(',', ''));
        if (filters.priceMin) {
          matchesPriceRange = matchesPriceRange && price >= parseFloat(filters.priceMin);
        }
        if (filters.priceMax) {
          matchesPriceRange = matchesPriceRange && price <= parseFloat(filters.priceMax);
        }
      }

      // Stock range filter
      let matchesStockRange = true;
      if (filters.stockMin || filters.stockMax) {
        if (filters.stockMin) {
          matchesStockRange = matchesStockRange && item.stock >= parseInt(filters.stockMin);
        }
        if (filters.stockMax) {
          matchesStockRange = matchesStockRange && item.stock <= parseInt(filters.stockMax);
        }
      }

      return matchesSearch && matchesBrand && matchesCategory && matchesStatus && matchesPriceRange && matchesStockRange;
    });
  }, [inventory, searchTerm, filters]);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const lowStockItems = filteredInventory.filter(item => 
    item.status === 'Low Stock' || item.status === 'Out of Stock'
  ).length;

  return (
    <div className="pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Inventory</h1>
        <div className="flex space-x-3">
          <button 
            onClick={handleBulkUpload}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </button>
          <button 
            onClick={handleAddProduct}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {lowStockItems > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-700">
                Low stock alert
              </h3>
              <div className="mt-1 text-sm text-yellow-600">
                You have {lowStockItems} {lowStockItems === 1 ? 'item' : 'items'} that {lowStockItems === 1 ? 'is' : 'are'} low or out of stock.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name, brand, or category..."
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
              {filters.brand && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Brand: {filters.brand}
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Category: {filters.category}
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Status: {filters.status}
                </span>
              )}
              {filters.priceMin && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Min Price: ₹{filters.priceMin}
                </span>
              )}
              {filters.priceMax && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Max Price: ₹{filters.priceMax}
                </span>
              )}
              {filters.stockMin && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Min Stock: {filters.stockMin}
                </span>
              )}
              {filters.stockMax && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Max Stock: {filters.stockMax}
                </span>
              )}
              <button
                onClick={() => handleApplyFilters({
                  brand: '', category: '', status: '', priceMin: '', priceMax: '', stockMin: '', stockMax: ''
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
          Showing {filteredInventory.length} of {inventory.length} products
          {hasActiveFilters && ' (filtered)'}
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
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
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {hasActiveFilters ? 'No products match your filters' : 'No products found'}
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'In Stock'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleView(item.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-150 ease-in-out"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleEdit(item.id)}
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
      <CreateProductModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmit}
      />

      <ViewProductModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedProductId(null);
        }}
        productId={selectedProductId}
        onEdit={handleEdit}
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProductId(null);
        }}
        productId={selectedProductId}
      />

      <InventoryFilters
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

      <InventoryExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        inventory={inventory}
        filteredInventory={filteredInventory}
      />

      <BulkUploadModal
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
      />
    </div>
  );
};

export default Inventory;