import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { useInventory } from '../../context/InventoryContext';
import { useCustomers } from '../../context/CustomerContext';
import CreateCustomerModal from '../customers/CreateCustomerModal';
import SearchSuggestions from '../shared/SearchSuggestions';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface InvoiceItem {
  productId: number;
  description: string;
  quantity: number;
  price: string;
}

const CreateInvoiceModal = ({ isOpen, onClose, onSubmit }: CreateInvoiceModalProps) => {
  const { inventory, getBrands, getProductsByBrand } = useInventory();
  const { customers, addCustomer } = useCustomers();
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ productId: 0, description: '', quantity: 1, price: '' }] as InvoiceItem[],
    notes: '',
  });

  const brands = getBrands();
  const brandProducts = selectedBrand ? getProductsByBrand(selectedBrand) : inventory;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.customerId) {
      alert('Please select a customer');
      return;
    }
    
    if (formData.items.length === 0 || !formData.items[0].productId) {
      alert('Please add at least one item');
      return;
    }

    // Calculate total
    const total = formData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0);

    const invoiceData = {
      ...formData,
      total: total,
      date: new Date().toLocaleDateString('en-IN'),
      status: 'Pending'
    };

    onSubmit(invoiceData);
    
    // Reset form
    setFormData({
      customerId: '',
      items: [{ productId: 0, description: '', quantity: 1, price: '' }],
      notes: '',
    });
    setSelectedBrand('');
    setProductSearchTerm('');
    
    onClose();
  };

  const handleProductSelect = (index: number, productId: number) => {
    const product = inventory.find(p => p.id === productId);
    if (product) {
      const newItems = [...formData.items];
      newItems[index] = {
        productId: product.id,
        description: product.name,
        quantity: 1,
        price: product.price.replace('₹', '').replace(',', ''),
      };
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleProductSuggestionSelect = (product: any) => {
    // Find the first empty item or add a new one
    const emptyItemIndex = formData.items.findIndex(item => item.productId === 0);
    if (emptyItemIndex !== -1) {
      handleProductSelect(emptyItemIndex, product.id);
    } else {
      // Add new item
      const newItems = [...formData.items, {
        productId: product.id,
        description: product.name,
        quantity: 1,
        price: product.price.replace('₹', '').replace(',', ''),
      }];
      setFormData({ ...formData, items: newItems });
    }
    setProductSearchTerm('');
    setShowSuggestions(false);
  };

  const handleNewCustomer = (customerData: any) => {
    const newCustomer = addCustomer(customerData);
    setFormData({ ...formData, customerId: newCustomer.id.toString() });
    setShowCustomerModal(false);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: 0, description: '', quantity: 1, price: '' }]
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    const newItems = [...formData.items];
    newItems[index].quantity = quantity;
    setFormData({ ...formData, items: newItems });
  };

  const updateItemPrice = (index: number, price: string) => {
    const newItems = [...formData.items];
    newItems[index].price = price;
    setFormData({ ...formData, items: newItems });
  };

  const filteredProducts = brandProducts.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create New Invoice">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 mr-4">
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                Customer
              </label>
              <select
                id="customer"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                required
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.company}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setShowCustomerModal(true)}
              className="mt-6 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              + New Customer
            </button>
          </div>

          {/* Brand Selection */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
              Select Brand (Optional - for faster product selection)
            </label>
            <select
              id="brand"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            {selectedBrand && (
              <p className="mt-1 text-sm text-blue-600">
                Showing {getProductsByBrand(selectedBrand).length} products from {selectedBrand}
              </p>
            )}
          </div>

          {/* Quick Product Search */}
          <div className="relative">
            <label htmlFor="productSearch" className="block text-sm font-medium text-gray-700">
              Quick Product Search
            </label>
            <input
              type="text"
              id="productSearch"
              placeholder="Type product name to quickly add..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={productSearchTerm}
              onChange={(e) => {
                setProductSearchTerm(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(productSearchTerm.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <SearchSuggestions
              items={filteredProducts}
              searchTerm={productSearchTerm}
              onSelect={handleProductSuggestionSelect}
              visible={showSuggestions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <select
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={item.productId}
                  onChange={(e) => handleProductSelect(index, Number(e.target.value))}
                  required
                >
                  <option value="">Select a product</option>
                  {brandProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.price} ({product.brand})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={item.quantity}
                  onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={item.price}
                  onChange={(e) => updateItemPrice(index, e.target.value)}
                  required
                />
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-2 py-1 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Item
            </button>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </Modal>

      <CreateCustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSubmit={handleNewCustomer}
      />
    </>
  );
};

export default CreateInvoiceModal;