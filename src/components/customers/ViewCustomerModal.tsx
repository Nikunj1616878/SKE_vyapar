import React from 'react';
import Modal from '../shared/Modal';
import { useCustomers } from '../../context/CustomerContext';

interface ViewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: number | null;
  onEdit?: (customerId: number) => void;
}

const ViewCustomerModal = ({ isOpen, onClose, customerId, onEdit }: ViewCustomerModalProps) => {
  const { getCustomer } = useCustomers();
  
  const customer = customerId ? getCustomer(customerId) : null;

  if (!customer) {
    return null;
  }

  const handleEdit = () => {
    if (onEdit && customerId) {
      onEdit(customerId);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Customer Details - ${customer.name}`}>
      <div className="space-y-6">
        {/* Customer Header */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xl font-medium text-blue-700">
                {customer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
              <p className="text-sm text-gray-500">{customer.company}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                Email Address
              </label>
              <p className="mt-1 text-sm text-gray-900">{customer.email}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                Phone Number
              </label>
              <p className="mt-1 text-sm text-gray-900">{customer.phone}</p>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Business Information</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                Company Name
              </label>
              <p className="mt-1 text-sm text-gray-900">{customer.company}</p>
            </div>
            {customer.gstin && (
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                  GSTIN
                </label>
                <p className="mt-1 text-sm text-gray-900">{customer.gstin}</p>
              </div>
            )}
            {customer.address && (
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-900">{customer.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order History Summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">0</p>
              <p className="text-xs text-gray-600">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">₹0</p>
              <p className="text-xs text-gray-600">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">-</p>
              <p className="text-xs text-gray-600">Last Order</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {customer.notes && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
            <p className="text-sm text-gray-700">{customer.notes}</p>
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
            Edit Customer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewCustomerModal;