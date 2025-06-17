import React from 'react';
import Modal from '../shared/Modal';
import { useInventory } from '../../context/InventoryContext';

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
  onEdit?: (productId: number) => void;
}

const ViewProductModal = ({ isOpen, onClose, productId, onEdit }: ViewProductModalProps) => {
  const { inventory } = useInventory();
  
  const product = productId ? inventory.find(p => p.id === productId) : null;

  if (!product) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const price = parseFloat(product.price.replace('₹', '').replace(',', ''));
  const totalValue = price * product.stock;

  const handleEdit = () => {
    if (onEdit && productId) {
      onEdit(productId);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Product Details - ${product.name}`}>
      <div className="space-y-6">
        {/* Product Header */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>
            <span
              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}
            >
              {product.status}
            </span>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                Product Name
              </label>
              <p className="mt-1 text-sm text-gray-900">{product.name}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                Category
              </label>
              <p className="mt-1 text-sm text-gray-900">{product.category}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                SKU
              </label>
              <p className="mt-1 text-sm text-gray-900">{product.sku || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                Status
              </label>
              <p className="mt-1 text-sm text-gray-900">{product.status}</p>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Pricing & Stock</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">{product.price}</p>
              <p className="text-xs text-gray-600">Unit Price</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">{product.stock}</p>
              <p className="text-xs text-gray-600">Current Stock</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">₹{totalValue.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-600">Total Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">{product.minStock || 'Not set'}</p>
              <p className="text-xs text-gray-600">Min Stock</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-700">{product.description}</p>
          </div>
        )}

        {/* Stock Alert */}
        {(product.status === 'Low Stock' || product.status === 'Out of Stock') && (
          <div className={`rounded-lg p-4 ${
            product.status === 'Out of Stock' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 ${
                  product.status === 'Out of Stock' ? 'text-red-400' : 'text-yellow-400'
                }`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  product.status === 'Out of Stock' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {product.status === 'Out of Stock' ? 'Out of Stock' : 'Low Stock Alert'}
                </h3>
                <div className={`mt-1 text-sm ${
                  product.status === 'Out of Stock' ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  {product.status === 'Out of Stock' 
                    ? 'This product is currently out of stock. Consider restocking soon.'
                    : 'This product is running low on stock. Consider restocking soon.'
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Product
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProductModal;