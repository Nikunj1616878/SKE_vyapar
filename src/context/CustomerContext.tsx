import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  notes?: string;
}

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer;
  updateCustomer: (customer: Customer) => void;
  getCustomer: (id: number) => Customer | undefined;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Rahul Sharma',
      company: 'Acme Corp',
      email: 'rahul@acmecorp.com',
      phone: '+91 98765 43210',
      address: '123 Business Park, Mumbai',
      gstin: '27AAPFU0939F1ZV',
    },
    {
      id: 2,
      name: 'Priya Patel',
      company: 'Globex Inc',
      email: 'priya@globex.com',
      phone: '+91 87654 32109',
      address: '456 Tech Hub, Bangalore',
      gstin: '29ABCDE1234F1Z5',
    },
  ]);

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = {
      ...customer,
      id: Math.max(...customers.map(c => c.id), 0) + 1,
    };
    setCustomers([...customers, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
  };

  const getCustomer = (id: number) => {
    return customers.find(customer => customer.id === id);
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, updateCustomer, getCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};