export const formatMoneyCZK = (amount: number) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatMoneyEUR = (amount: number) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatMoneyGBP = (amount: number) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  }
  return phone;
};
