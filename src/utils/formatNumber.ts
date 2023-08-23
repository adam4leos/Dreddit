const formatter = Intl.NumberFormat('en', { notation: 'compact' });

export const formatNumber = (num: number): string => formatter.format(num);
