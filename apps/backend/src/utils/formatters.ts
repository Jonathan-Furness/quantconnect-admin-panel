export const asPercentage = (value: number) =>
  Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format((value as number) / 100)

export const asCurrency = (value: number) =>
  Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
    maximumFractionDigits: 0,
  }).format(value)
