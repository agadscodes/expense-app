import { transactionTypes } from "./transactionHelpers";

function Summary({ transactions }) {
  const typeTotals = Object.entries(transactionTypes).map(([type, details]) => {
    const matchingTransactions = transactions.filter(
      (transaction) => transaction.category === type,
    );
    const amount = matchingTransactions.reduce(
      (total, transaction) => total + (Number(transaction.amount) || 0),
      0,
    );

    return { type, ...details, amount, count: matchingTransactions.length };
  });

  return (
    <div className="dashboard-type-grid">
      {typeTotals.map((item) => (
        <div
          className="dashboard-type-card"
          key={item.type}
          style={{ "--category-color": item.color }}
        >
          <p>{item.label}</p>
          <h2>${item.amount.toFixed(2)}</h2>
          <span>
            {item.count} transaction{item.count === 1 ? "" : "s"}
          </span>
        </div>
      ))}
    </div>
  );
}
export default Summary;
