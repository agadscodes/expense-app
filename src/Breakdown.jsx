const categories = {
  food: { label: "Food & Dining", color: "#e76f51" },
  housing: { label: "Housing & Utilities", color: "#2a9d8f" },
  transportation: { label: "Transportation", color: "#457b9d" },
  entertainment: { label: "Entertainment", color: "#e9c46a" },
  other: { label: "Other", color: "#8d99ae" },
};

export default function Breakdown({ transactions }) {
  const totals = transactions
    .filter((transaction) => transaction.category !== "income")
    .reduce((result, transaction) => {
      const category = categories[transaction.category]
        ? transaction.category
        : "other";
      const amount = Number(transaction.amount);
      result[category] = (result[category] ?? 0) + (amount > 0 ? amount : 0);
      return result;
    }, {});

  const breakdown = Object.entries(totals)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      ...categories[category],
      amount,
    }));
  const totalExpenses = breakdown.reduce(
    (total, item) => total + item.amount,
    0,
  );

  let progress = 0;
  const chartStops = breakdown
    .map((item, index) => {
      const start = progress;
      progress += (item.amount / totalExpenses) * 100;
      const end = index === breakdown.length - 1 ? 100 : progress;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <section className="breakdown" aria-labelledby="breakdown-title">
      <div
        className="breakdown-chart"
        role="img"
        aria-label={
          totalExpenses > 0
            ? `Expense breakdown totaling $${totalExpenses.toFixed(2)}`
            : "No expense data yet"
        }
        style={{
          background: chartStops ? `conic-gradient(${chartStops})` : "#e5e7eb",
        }}
      />
      <div className="breakdown-content">
        <h2 id="breakdown-title">Expense Breakdown</h2>
        {totalExpenses > 0 ? (
          <>
            <p className="breakdown-total">${totalExpenses.toFixed(2)} total</p>
            <div className="breakdown-legend">
              {breakdown.map((item) => (
                <div className="breakdown-legend-item" key={item.label}>
                  <span
                    className="breakdown-swatch"
                    style={{ "--category-color": item.color }}
                  />
                  <span>{item.label}</span>
                  <span className="breakdown-amount">
                    ${item.amount.toFixed(2)} (
                    {((item.amount / totalExpenses) * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="breakdown-empty">No expense data yet</p>
        )}
      </div>
    </section>
  );
}
