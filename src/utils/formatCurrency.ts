export const formatCurrency = (amount: number): string => {
  return `฿${amount.toLocaleString('th-TH')}`;
};

export const calculateDiscount = (
  price: number,
  originalPrice?: number
): { savings: number; percentage: number } => {
  if (!originalPrice || originalPrice <= price) {
    return { savings: 0, percentage: 0 };
  }
  const savings = originalPrice - price;
  const percentage = Math.round((savings / originalPrice) * 100);
  return { savings, percentage };
};
