export const transactionTypes = {
  income: { label: "Income", color: "#248a69" },
  food: { label: "Food & Dining", color: "#e76f51" },
  housing: { label: "Housing & Utilities", color: "#2a9d8f" },
  transportation: { label: "Transportation", color: "#457b9d" },
  entertainment: { label: "Entertainment", color: "#d39b35" },
  other: { label: "Other", color: "#8d99ae" },
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
