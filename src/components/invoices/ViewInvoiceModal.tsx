import React from 'react';
import Modal from '../shared/Modal';
import { useInvoices } from '../../context/InvoiceContext';
import { useCustomers } from '../../context/CustomerContext';

interface ViewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string | null;
}

const ViewInvoiceModal = ({ isOpen, onClose, invoiceId }: ViewInvoiceModalProps) => {
  const { getInvoice } = useInvoices();
  const { getCustomer } = useCustomers();
  
  const invoice = invoiceId ? getInvoice(invoiceId) : null;
  const customer = invoice ? getCustomer(invoice.customerId) : null;

  if (!invoice) {
    return null;
  }

  const subtotal = invoice.items.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * item.quantity);
  }, 0);

  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Invoice ${invoice.id}`}>
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Invoice {invoice.id}</h3>
              <p className="text-sm text-gray-500">Date: {invoice.date}</p>
            </div>
            <div className="text-right">
              <span
                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  invoice.status === 'Paid'
                    ? 'bg-green-100 text-green-800'
                    : invoice.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {invoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        {customer && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Bill To:</h4>
            <div className="text-sm text-gray-700">
              <p className="font-medium">{customer.name}</p>
              <p>{customer.company}</p>
              <p>{customer.email}</p>
              <p>{customer.phone}</p>
              {customer.address && <p>{customer.address}</p>}
              {customer.gstin && <p>GSTIN: {customer.gstin}</p>}
            </div>
          </div>
        )}

        {/* Invoice Items */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Items:</h4>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Qty
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-center">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      ₹{parseFloat(item.price).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      ₹{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Totals */}
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST (18%):</span>
              <span className="text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Notes:</h4>
            <p className="text-sm text-gray-700">{invoice.notes}</p>
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
            onClick={() => window.print()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewInvoiceModal;