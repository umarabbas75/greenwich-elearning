export const formatNumber = (
  number: number,
  notation:
    | 'standard'
    | 'scientific'
    | 'engineering'
    | 'compact'
    | undefined = 'standard',
) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    notation: notation,
  });
  return formatter.format(number);
};
