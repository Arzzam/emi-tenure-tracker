export const formatAmount = (amount: number) => {
  const fixedAmount = amount.toFixed(2);
  return Number(fixedAmount).toLocaleString();
};
