export const formatCurrency = (value: number): string => {
  return `Rp ${value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatAccountNumber = (accountNumber: string): string => {
  // Format account number with spaces every 4 digits
  return accountNumber.replace(/(\d{4})/g, '$1 ').trim();
};

export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};