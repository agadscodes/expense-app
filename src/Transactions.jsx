import {
  getLocalDateValue,
  getTransactionDate,
  formatCurrency,
  transactionTypes,
} from "./transactionHelpers";

function escapeCsv(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function formatDate(value) {
  if (!value) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export default function Transactions({
  totalTrans,
  allCount,
  transArray,
  allTransactions,
  deleteTrans,
  onOpenForm,
  currency,
  locale,
}) {
  function downloadCsv() {
    const rows = [
      ["Date", "Description", "Type", "Category", "Amount"],
      ...allTransactions.map((transaction) => {
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

  const sortedTransactions = [...transArray].sort((first, second) =>
    getTransactionDate(second).localeCompare(getTransactionDate(first)),
  );

  return (
    <section
      className="dashboard-panel transactions"
      aria-labelledby="transactions-title"
    >
      <div className="transactions-header">
        <div>
          <h2 id="transactions-title">Recent Transactions</h2>
          <p>Review your latest financial activity.</p>
        </div>
        <div className="transactions-header-actions">
          <span>
            {totalTrans === allCount
              ? `${allCount} total`
              : `${totalTrans} of ${allCount}`}
          </span>
          <button
            type="button"
            className="new-transaction-btn"
            onClick={onOpenForm}
          >
            <span aria-hidden="true">+</span> New transaction
          </button>
          <button
            type="button"
            className="download-csv-btn"
            onClick={downloadCsv}
            disabled={allCount === 0}
          >
            Download CSV
          </button>
        </div>
      </div>
      <div className="transaction-table-scroll">
        <table className="transaction-table">
          <thead>
            <tr>
              <th scope="col">Transaction</th>
              <th scope="col">Category</th>
              <th scope="col">Date</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((transaction) => {
                const isIncome = transaction.category === "income";
                return (
                  <tr key={transaction.id}>
                    <td className="table-description">
                      {transaction.description}
                    </td>
                    <td>
                      <span className="table-category">
                        {transactionTypes[transaction.category]?.label ??
                          "Other"}
                      </span>
                    </td>
                    <td className="table-date">
                      {formatDate(getTransactionDate(transaction))}
                    </td>
                    <td
                      className={`table-amount ${isIncome ? "income" : "expense"}`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount, currency, locale)}
                    </td>
                    <td>
                      <span className="table-status">Completed</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="delete-transaction"
                        onClick={() => deleteTrans(transaction.id)}
                        aria-label={`Delete ${transaction.description}`}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="table-empty" colSpan="6">
                  {allCount === 0
                    ? "No transactions yet. Add one to see it here."
                    : "No transactions match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
