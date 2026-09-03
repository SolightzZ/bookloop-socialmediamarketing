export interface PriceAlert {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  targetPrice: number;
  currentPrice: number;
  createdAt: number;
  triggered: boolean;
}

export interface PriceAlertContextType {
  alerts: PriceAlert[];
  addAlert: (bookId: string, bookTitle: string, bookCover: string, targetPrice: number, currentPrice: number) => void;
  removeAlert: (id: string) => void;
  hasAlert: (bookId: string) => boolean;
  checkAlerts: (bookId: string, newPrice: number) => boolean;
}
