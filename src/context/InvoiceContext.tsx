import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Invoice {
  id: string;
  customerId: number;
  customerName: string;
  date: string;
  amount: string;
  status: string;
  items: Array<{
    productId: number;
    description: string;
    quantity: number;
    price: string;
  }>;
  notes?: string;
}

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: any) => void;
  updateInvoice: (invoice: Invoice) => void;
  getInvoice: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { 
      id: 'INV-001', 
      customerId: 1,
      customerName: 'Rahul Sharma - Acme Corp', 
      date: '12 Jun 2025', 
      amount: '₹12,500', 
      status: 'Paid',
      items: [
        { productId: 1, description: 'Laptop - HP Pavilion', quantity: 1, price: '12500' }
      ]
    },
    { 
      id: 'INV-002', 
      customerId: 2,
      customerName: 'Priya Patel - Globex Inc', 
      date: '10 Jun 2025', 
      amount: '₹8,750', 
      status: 'Pending',
      items: [
        { productId: 2, description: 'Office Desk - Standing', quantity: 1, price: '8750' }
      ]
    },
    { 
      id: 'INV-003', 
      customerId: 1,
      customerName: 'Rahul Sharma - Acme Corp', 
      date: '05 Jun 2025', 
      amount: '₹15,200', 
      status: 'Paid',
      items: [
        { productId: 1, description: 'Laptop - HP Pavilion', quantity: 1, price: '15200' }
      ]
    },
    { 
      id: 'INV-004', 
      customerId: 2,
      customerName: 'Priya Patel - Globex Inc', 
      date: '01 Jun 2025', 
      amount: '₹9,300', 
      status: 'Overdue',
      items: [
        { productId: 3, description: 'Wireless Mouse', quantity: 10, price: '930' }
      ]
    },
    { 
      id: 'INV-005', 
      customerId: 1,
      customerName: 'Rahul Sharma - Acme Corp', 
      date: '28 May 2025', 
      amount: '₹11,800', 
      status: 'Paid',
      items: [
        { productId: 2, description: 'Office Desk - Standing', quantity: 1, price: '11800' }
      ]
    },
  ]);

  const addInvoice = (invoiceData: any) => {
    const newInvoiceId = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    
    const newInvoice: Invoice = {
      id: newInvoiceId,
      customerId: parseInt(invoiceData.customerId),
      customerName: invoiceData.customerName || 'Unknown Customer',
      date: invoiceData.date,
      amount: `₹${invoiceData.total.toLocaleString('en-IN')}`,
      status: invoiceData.status,
      items: invoiceData.items,
      notes: invoiceData.notes,
    };

    setInvoices([newInvoice, ...invoices]);
    return newInvoice;
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === updatedInvoice.id ? updatedInvoice : invoice
    ));
  };

  const getInvoice = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, getInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
};