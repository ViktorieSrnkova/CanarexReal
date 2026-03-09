export const formatMoneyCZK = (amount: number) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
  }).format(amount);

export const formatMoneyEUR = (amount: number) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
