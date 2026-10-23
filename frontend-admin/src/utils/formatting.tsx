/* export const formatMoneyCZK = (amount: number) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(amount); */

export const formatMoneyEUR = (amount: number) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatPhoneNumber = (phone: string): string => {
  const trimmed = phone.trim();
  const cleaned = trimmed.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+420")) {
    const number = cleaned.slice(4);
    if (number.length === 9) {
      return `+420 ${number.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}`;
    }
  }

  if (cleaned.startsWith("+34")) {
    const number = cleaned.slice(3);
    if (number.length === 9) {
      return `+34 ${number.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4")}`;
    }
  }

  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  }

  return phone;
};
