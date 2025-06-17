import React, { useState, useCallback } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X } from 'lucide-react';
import Modal from '../shared/Modal';
import { useInventory } from '../../context/InventoryContext';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedProduct {
  name: string;
  category: string;
  price: string;
  stock: number;
  description?: string;
  sku?: string;
  minStock?: number;
  status?: string;
  errors?: string[];
}

const BulkUploadModal = ({ isOpen, onClose }: BulkUploadModalProps) => {
  const { addProduct } = useInventory();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'preview' | 'complete'>('upload');
  const [importResults, setImportResults] = useState<{ success: number; errors: number }>({ success: 0, errors: 0 });

  const requiredColumns = ['name', 'category', 'price', 'stock'];
  const optionalColumns = ['description', 'sku', 'minStock'];
  const validCategories = ['Electronics', 'Furniture', 'Accessories', 'Supplies'];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (selectedFile: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(csv|xlsx|xls)$/i)) {
      alert('Please upload a valid CSV or Excel file');
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const text = await selectedFile.text();
      const parsed = parseCSV(text);
      setParsedData(parsed);
      setUploadStep('preview');
    } catch (error) {
      alert('Error reading file. Please check the file format.');
      console.error('File parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCSV = (text: string): ParsedProduct[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('File must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data: ParsedProduct[] = [];

    // Validate required columns
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) continue;

      const product: ParsedProduct = {
        name: '',
        category: '',
        price: '',
        stock: 0,
        errors: []
      };

      headers.forEach((header, index) => {
        const value = values[index];
        
        switch (header) {
          case 'name':
            product.name = value;
            if (!value) product.errors?.push('Name is required');
            break;
          case 'category':
            product.category = value;
            if (!value) {
              product.errors?.push('Category is required');
            } else if (!validCategories.includes(value)) {
              product.errors?.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
            }
            break;
          case 'price':
            const priceNum = parseFloat(value);
            if (isNaN(priceNum) || priceNum < 0) {
              product.errors?.push('Price must be a valid positive number');
              product.price = value;
            } else {
              product.price = `₹${priceNum.toLocaleString('en-IN')}`;
            }
            break;
          case 'stock':
            const stockNum = parseInt(value);
            if (isNaN(stockNum) || stockNum < 0) {
              product.errors?.push('Stock must be a valid non-negative number');
              product.stock = 0;
            } else {
              product.stock = stockNum;
            }
            break;
          case 'description':
            product.description = value;
            break;
          case 'sku':
            product.sku = value;
            break;
          case 'minstock':
            const minStockNum = parseInt(value);
            if (value && !isNaN(minStockNum) && minStockNum >= 0) {
              product.minStock = minStockNum;
            }
            break;
        }
      });

      // Calculate status
      const minStock = product.minStock || 5;
      if (product.stock === 0) {
        product.status = 'Out of Stock';
      } else if (product.stock <= minStock) {
        product.status = 'Low Stock';
      } else {
        product.status = 'In Stock';
      }

      data.push(product);
    }

    return data;
  };

  const handleImport = async () => {
    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    for (const product of parsedData) {
      if (!product.errors || product.errors.length === 0) {
        try {
          addProduct({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            description: product.description,
            sku: product.sku,
            minStock: product.minStock,
          });
          successCount++;
        } catch (error) {
          errorCount++;
        }
      } else {
        errorCount++;
      }
    }

    setImportResults({ success: successCount, errors: errorCount });
    setUploadStep('complete');
    setIsProcessing(false);
  };

  const downloadTemplate = () => {
    const template = [
      'name,category,price,stock,description,sku,minStock',
      'Sample Laptop,Electronics,50000,10,High-performance laptop,LAP-001,5',
      'Office Chair,Furniture,8000,15,Ergonomic office chair,CHR-001,3',
      'Wireless Mouse,Accessories,1500,25,Bluetooth wireless mouse,MOU-001,10'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setFile(null);
    setParsedData([]);
    setUploadStep('upload');
    setImportResults({ success: 0, errors: 0 });
    onClose();
  };

  const validProducts = parsedData.filter(p => !p.errors || p.errors.length === 0);
  const invalidProducts = parsedData.filter(p => p.errors && p.errors.length > 0);

  return (
    <Modal isOpen={isOpen} onClose={resetModal} title="Bulk Upload Inventory">
      <div className="space-y-6">
        {uploadStep === 'upload' && (
          <>
            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Upload Instructions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload CSV or Excel files (.csv, .xlsx, .xls)</li>
                <li>• Required columns: name, category, price, stock</li>
                <li>• Optional columns: description, sku, minStock</li>
                <li>• Valid categories: {validCategories.join(', ')}</li>
                <li>• Use the template below for proper formatting</li>
              </ul>
            </div>

            {/* Template Download */}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Download Template</h4>
                <p className="text-sm text-gray-600">Get a sample CSV file with the correct format</p>
              </div>
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </button>
            </div>

            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Drop your file here, or{' '}
                      <span className="text-blue-600 hover:text-blue-500">browse</span>
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileInput}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    CSV, XLSX, XLS up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {file && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">File Selected</h3>
                    <div className="mt-1 text-sm text-green-700">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-4">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Processing file...</span>
                </div>
              </div>
            )}
          </>
        )}

        {uploadStep === 'preview' && (
          <>
            {/* Preview Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-semibold text-blue-600">{parsedData.length}</p>
                <p className="text-sm text-blue-800">Total Records</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-semibold text-green-600">{validProducts.length}</p>
                <p className="text-sm text-green-800">Valid Records</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-semibold text-red-600">{invalidProducts.length}</p>
                <p className="text-sm text-red-800">Invalid Records</p>
              </div>
            </div>

            {/* Preview Table */}
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Errors</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedData.map((product, index) => (
                    <tr key={index} className={product.errors && product.errors.length > 0 ? 'bg-red-50' : 'bg-green-50'}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {product.errors && product.errors.length > 0 ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{product.category}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{product.price}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{product.stock}</td>
                      <td className="px-4 py-2 text-sm text-red-600">
                        {product.errors && product.errors.length > 0 && (
                          <ul className="list-disc list-inside">
                            {product.errors.map((error, i) => (
                              <li key={i} className="text-xs">{error}</li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {invalidProducts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Some records have errors
                    </h3>
                    <div className="mt-1 text-sm text-yellow-700">
                      {invalidProducts.length} records will be skipped due to validation errors. Only valid records will be imported.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {uploadStep === 'complete' && (
          <>
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Import Complete!</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 max-w-xs mx-auto">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-semibold text-green-600">{importResults.success}</p>
                  <p className="text-sm text-green-800">Imported</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-semibold text-red-600">{importResults.errors}</p>
                  <p className="text-sm text-red-800">Skipped</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {uploadStep === 'upload' && (
            <button
              onClick={resetModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}

          {uploadStep === 'preview' && (
            <>
              <button
                onClick={() => setUploadStep('upload')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                onClick={handleImport}
                disabled={validProducts.length === 0 || isProcessing}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import {validProducts.length} Products
                  </>
                )}
              </button>
            </>
          )}

          {uploadStep === 'complete' && (
            <button
              onClick={resetModal}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BulkUploadModal;