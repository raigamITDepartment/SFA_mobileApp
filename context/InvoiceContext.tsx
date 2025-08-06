import React, { createContext, useContext, useState } from 'react';

export type ItemData = {
  quantity: string;
  freeIssue: string;
  goodReturnFreeQty: string;
  marketReturnFreeQty: string;
  lineTotal: string;
};

type InvoiceContextType = {
  items: Record<string, ItemData>;
  updateItem: (itemName: string, data: ItemData) => void;
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Record<string, ItemData>>({});

  const updateItem = (itemName: string, data: ItemData) => {
    setItems((prev) => ({ ...prev, [itemName]: data }));

    console.log(`Updated item: ${itemName}`, data);
    // You can also add any additional logic here, like saving to a database or local storage
  };

  return (
    <InvoiceContext.Provider value={{ items, updateItem }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = (): InvoiceContextType => {
  const context = useContext(InvoiceContext);
  if (!context) throw new Error('useInvoice must be used within InvoiceProvider');
  return context;
};