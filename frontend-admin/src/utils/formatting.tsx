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

export const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  }
  return phone;
};
