import { useContext } from 'react';
import { PriceAlertContext } from '../context/PriceAlertContext';

export function usePriceAlert() {
  const ctx = useContext(PriceAlertContext);
  if (!ctx) throw new Error('usePriceAlert must be used within PriceAlertProvider');
  return ctx;
}
