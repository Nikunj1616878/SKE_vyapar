import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { useInventory } from '../../context/InventoryContext';
import { useCustomers } from '../../context/CustomerContext';
import { useInvoices } from '../../context/InvoiceContext';

interface EditInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string | null;
}

interface InvoiceItem {
  productId: number;
  description: string;
  quantity: number;
  price: string;
}

const EditInvoiceModal = ({ isOpen, onClose, invoiceId }: EditInvoiceModalProps) => {
  const { inventory } = useInventory();
  const { customers } = useCustomers();
  const { getInvoice, updateInvoice } = useInvoices();
  
  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ productId: 0, description: '', quantity: 1, price: '' }] as InvoiceItem[],
    notes: '',
    status: 'Pending',
  });

  const invoice = invoiceId ? getInvoice(invoiceId) : null;

  useEffect(() => {
    if (invoice && isOpen) {
      setFormData({
        customerId: invoice.customerId.toString(),
        items: invoice.items.map(item => ({
          productId: item.productId,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
        })),
        notes: invoice.notes || '',
        status: invoice.status,
      });
    }
  }, [invoice, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoiceId || !invoice) return;
    
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

    const customer = customers.find(c => c.id === parseInt(formData.customerId));
    
    const updatedInvoiceData = {
      ...invoice,
      customerId: parseInt(formData.customerId),
      customerName: customer ? `${customer.name} - ${customer.company}` : 'Unknown Customer',
      items: formData.items,
      notes: formData.notes,
      status: formData.status,
      amount: `₹${total.toLocaleString('en-IN')}`,
    };

    updateInvoice(updatedInvoiceData);
    onClose();
  };

  const handleProductSelect = (index: number, productId: number) => {
    const product = inventory.find(p => p.id === productId);
    if (product) {
      const newItems = [...formData.items];
      newItems[index] = {
        productId: product.id,
        description: product.name,
        quantity: newItems[index].quantity,
        price: product.price.replace('₹', '').replace(',', ''),
      };
      setFormData({ ...formData, items: newItems });
    }
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

  if (!invoice) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Invoice ${invoice.id}`}>
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
          <div className="w-32">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
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
                {inventory.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.price}
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
            Update Invoice
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditInvoiceModal;