import React, { useState } from 'react';
import { Download, FileText, Table, File } from 'lucide-react';
import Modal from '../shared/Modal';
import { exportToCSV, exportToPDF, exportToExcel } from '../../utils/exportUtils';

interface InventoryExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: any[];
  filteredInventory: any[];
}

const InventoryExportModal = ({ isOpen, onClose, inventory, filteredInventory }: InventoryExportModalProps) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportData, setExportData] = useState('filtered');
  const [includeDetails, setIncludeDetails] = useState(false);

  const handleExport = () => {
    const dataToExport = exportData === 'all' ? inventory : filteredInventory;
    
    if (dataToExport.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare data for export
    const exportableData = dataToExport.map(item => ({
      'Product Name': item.name,
      'Category': item.category,
      'Stock': item.stock,
      'Price': item.price,
      'Status': item.status,
      ...(includeDetails && {
        'SKU': item.sku || '',
        'Description': item.description || '',
        'Min Stock': item.minStock || '',
      })
    }));

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `inventory_${timestamp}`;

    switch (exportFormat) {
      case 'csv':
        exportToCSV(exportableData, `${filename}.csv`);
        break;
      case 'excel':
        exportToExcel(exportableData, `${filename}.xlsx`);
        break;
      case 'pdf':
        exportInventoryToPDF(dataToExport, `${filename}.pdf`);
        break;
      default:
        exportToCSV(exportableData, `${filename}.csv`);
    }

    onClose();
  };

  const exportInventoryToPDF = (inventory: any[], filename: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    const totalValue = inventory.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('₹', '').replace(',', ''));
      return sum + (price * item.stock);
    }, 0);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Inventory Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { margin-bottom: 20px; }
          .status-in-stock { color: #059669; }
          .status-low-stock { color: #d97706; }
          .status-out-of-stock { color: #dc2626; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Inventory Report</h1>
          <p>Generated on ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
        
        <div class="summary">
          <p><strong>Total Products:</strong> ${inventory.length}</p>
          <p><strong>Total Inventory Value:</strong> ₹${totalValue.toLocaleString('en-IN')}</p>
          <p><strong>Low Stock Items:</strong> ${inventory.filter(item => item.status === 'Low Stock').length}</p>
          <p><strong>Out of Stock Items:</strong> ${inventory.filter(item => item.status === 'Out of Stock').length}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            ${inventory.map(item => {
              const price = parseFloat(item.price.replace('₹', '').replace(',', ''));
              const value = price * item.stock;
              return `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.category}</td>
                  <td>${item.stock}</td>
                  <td>${item.price}</td>
                  <td class="status-${item.status.toLowerCase().replace(' ', '-')}">${item.status}</td>
                  <td>₹${value.toLocaleString('en-IN')}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer;">Print</button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">Close</button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Inventory">
      <div className="space-y-6">
        {/* Export Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setExportFormat('csv')}
              className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                exportFormat === 'csv'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Table className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">CSV</span>
            </button>
            <button
              onClick={() => setExportFormat('excel')}
              className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                exportFormat === 'excel'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <File className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Excel</span>
            </button>
            <button
              onClick={() => setExportFormat('pdf')}
              className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                exportFormat === 'pdf'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <FileText className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">PDF</span>
            </button>
          </div>
        </div>

        {/* Data Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Data to Export
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="exportData"
                value="filtered"
                checked={exportData === 'filtered'}
                onChange={(e) => setExportData(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                Current filtered results ({filteredInventory.length} products)
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="exportData"
                value="all"
                checked={exportData === 'all'}
                onChange={(e) => setExportData(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                All products ({inventory.length} products)
              </span>
            </label>
          </div>
        </div>

        {/* Additional Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Additional Options
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeDetails}
              onChange={(e) => setIncludeDetails(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Include additional details (SKU, description, min stock)
            </span>
          </label>
        </div>

        {/* Export Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Export Summary</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Format: {exportFormat.toUpperCase()}</li>
            <li>• Records: {exportData === 'all' ? inventory.length : filteredInventory.length} products</li>
            <li>• Details: {includeDetails ? 'Included' : 'Basic only'}</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InventoryExportModal;