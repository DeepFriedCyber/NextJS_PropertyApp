export function formatPrice(price: number | null): string {
  if (!price) return '0';
  return new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: 0
  }).format(price);
}