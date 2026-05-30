export const formatCurrency = (value: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// ✅ تنسيق احترافي: أول 6 + ... + آخر 6 (بدون مسافات)
export const truncateStellarAddress = (address: string): string => {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};
