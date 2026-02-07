
export interface Book {
  id: string;
  name: string;
  writer: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  category: string;
  shelfNumber?: string;
}

export interface Purchase {
  id: string;
  bookName: string;
  writer: string;
  quantity: number;
  purchasePricePerUnit: number;
  sellingPricePerUnit: number;
  totalAmount: number;
  date: string;
  shelfNumber?: string;
}

export interface Sale {
  id: string;
  bookName: string;
  customerName: string;
  mobileNumber: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  date: string;
}

export type ViewType = 'dashboard' | 'purchases' | 'inventory' | 'sales' | 'reports' | 'ai-assistant';
