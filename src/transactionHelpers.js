export const transactionTypes = {
  income: { label: "Income", color: "#d2a72c" },
  food: { label: "Food & Dining", color: "#171717" },
  housing: { label: "Housing & Utilities", color: "#e4c978" },
  transportation: { label: "Transportation", color: "#5d5b54" },
  entertainment: { label: "Entertainment", color: "#f0dfa8" },
  other: { label: "Other", color: "#99978f" },
};

export function getTransactionDate(transaction) {
  if (transaction.date) return transaction.date;

  const legacyTimestamp = String(transaction.id ?? "").match(/^\d{13}/)?.[0];
  return legacyTimestamp
    ? new Date(Number(legacyTimestamp)).toISOString().slice(0, 10)
    : "";
}

export function getLocalDateValue(date = new Date()) {
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );
  return localDate.toISOString().slice(0, 10);
}

export function formatCurrency(
  amount,
  currency = "USD",
  locale = "en-US",
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(Number(amount) || 0);
}
