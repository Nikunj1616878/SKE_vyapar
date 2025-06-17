import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  stock: number;
  price: string;
  status: string;
  description?: string;
  sku?: string;
  minStock?: number;
}

interface InventoryContextType {
  inventory: Product[];
  addProduct: (product: Omit<Product, 'id' | 'status'>) => void;
  updateProduct: (product: Product) => void;
  getBrands: () => string[];
  getProductsByBrand: (brand: string) => Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [inventory, setInventory] = useState<Product[]>([
    {
      id: 1,
      name: 'Pavilion 15',
      brand: 'HP',
      category: 'Electronics',
      stock: 15,
      price: '₹58,999',
      status: 'In Stock',
      description: 'High-performance laptop with Intel Core i5 processor',
      sku: 'HP-PAV-001',
      minStock: 5,
    },
    {
      id: 2,
      name: 'ThinkPad E14',
      brand: 'Lenovo',
      category: 'Electronics',
      stock: 12,
      price: '₹65,999',
      status: 'In Stock',
      description: 'Business laptop with excellent build quality',
      sku: 'LEN-TP-001',
      minStock: 3,
    },
    {
      id: 3,
      name: 'Standing Desk Pro',
      brand: 'IKEA',
      category: 'Furniture',
      stock: 8,
      price: '₹12,499',
      status: 'In Stock',
      description: 'Adjustable height standing desk for office use',
      sku: 'IKEA-DESK-001',
      minStock: 3,
    },
    {
      id: 4,
      name: 'MX Master 3',
      brand: 'Logitech',
      category: 'Accessories',
      stock: 32,
      price: '₹7,995',
      status: 'In Stock',
      description: 'Advanced wireless mouse for professionals',
      sku: 'LOG-MX3-001',
      minStock: 10,
    },
    {
      id: 5,
      name: 'Basic Wireless Mouse',
      brand: 'Logitech',
      category: 'Accessories',
      stock: 45,
      price: '₹999',
      status: 'In Stock',
      description: 'Simple wireless mouse for everyday use',
      sku: 'LOG-BWM-001',
      minStock: 15,
    },
    {
      id: 6,
      name: 'MacBook Air M2',
      brand: 'Apple',
      category: 'Electronics',
      stock: 5,
      price: '₹1,14,900',
      status: 'Low Stock',
      description: 'Ultra-thin laptop with M2 chip',
      sku: 'APL-MBA-001',
      minStock: 3,
    },
    {
      id: 7,
      name: 'Magic Mouse',
      brand: 'Apple',
      category: 'Accessories',
      stock: 18,
      price: '₹7,900',
      status: 'In Stock',
      description: 'Multi-touch wireless mouse',
      sku: 'APL-MM-001',
      minStock: 5,
    },
  ]);

  const addProduct = (product: Omit<Product, 'id' | 'status'>) => {
    const newProduct = {
      ...product,
      id: Math.max(...inventory.map(p => p.id), 0) + 1,
      status: product.stock > (product.minStock || 5) ? 'In Stock' : product.stock === 0 ? 'Out of Stock' : 'Low Stock',
    };
    setInventory([...inventory, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setInventory(inventory.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  const getBrands = () => {
    const brands = [...new Set(inventory.map(product => product.brand))];
    return brands.sort();
  };

  const getProductsByBrand = (brand: string) => {
    return inventory.filter(product => product.brand === brand);
  };

  return (
    <InventoryContext.Provider value={{ 
      inventory, 
      addProduct, 
      updateProduct, 
      getBrands, 
      getProductsByBrand 
    }}>
      {children}
    </InventoryContext.Provider>
  );
};