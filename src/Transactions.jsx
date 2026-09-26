import {
  getLocalDateValue,
  getTransactionDate,
  transactionTypes,
} from "./transactionHelpers";

function escapeCsv(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export default function Transactions({ totalTrans, transArray, deleteTrans }) {
  function downloadCsv() {
    const rows = [
      ["Date", "Description", "Type", "Category", "Amount"],
      ...transArray.map((transaction) => {
        const isIncome = transaction.category === "income";
        const amount = Number(transaction.amount) || 0;
        return [
          getTransactionDate(transaction),
          transaction.description,
          isIncome ? "Income" : "Expense",
          transactionTypes[transaction.category]?.label ?? "Other",
          isIncome ? amount : -amount,
        ];
      }),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const file = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions-${getLocalDateValue()}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (totalTrans == 0) {
    return (
      <section className="transactions transactions-empty">
        <h3>No transactions yet</h3>
        <p>Use New transaction to record your first entry.</p>
      </section>
    );
  }
  return (
    <div className="transactions">
      {/* Header */}
      <div className="transactions-header">
        <h2>All Transactions</h2>
        <div className="transactions-header-actions">
          <span>Showing {totalTrans} transactions</span>
          <button
            type="button"
            className="download-csv-btn"
            onClick={downloadCsv}
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="transaction-list">
        {transArray.map((item) => {
          const isIncome = item.category == "income";
          return (
            <div className="transaction-item" key={item.id}>
              <div className="transaction-info">
                <div className="transaction-icon">🛒</div>
                <div className="transaction-details">
                  <h3>{item.description}</h3>
                  <p>
                    {getTransactionDate(item)
                      ? new Intl.DateTimeFormat(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(
                          new Date(`${getTransactionDate(item)}T12:00:00`),
                        )
                      : "Date unavailable"}
                  </p>
                </div>
              </div>
              <div className="transaction-right">
                <span
                  className={`transaction-amount ${isIncome ? "income" : "expense"}`}
                >
                  {isIncome ? "+" : "-"}
                  {item.amount}
                </span>
                <button
                  type="button"
                  className="delete-transaction"
                  onClick={() => deleteTrans(item.id)}
                  aria-label={`Delete ${item.description}`}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
