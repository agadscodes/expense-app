import { transactionTypes } from "./transactionHelpers";

const categories = {
  food: transactionTypes.food,
  housing: transactionTypes.housing,
  transportation: transactionTypes.transportation,
  entertainment: transactionTypes.entertainment,
  other: transactionTypes.other,
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
      progress += (item.amount / totalExpenses) * 50;
      const end = index === breakdown.length - 1 ? 50 : progress;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <section
      className="dashboard-panel breakdown"
      aria-labelledby="breakdown-title"
    >
      <div className="breakdown-content">
        <div className="panel-heading">
          <div>
            <h2 id="breakdown-title">Spending Breakdown</h2>
            <p>See where your money goes.</p>
          </div>
          <span className="panel-period">This month</span>
        </div>
        {totalExpenses > 0 ? (
          <>
            <div
              className="breakdown-chart"
              role="img"
              aria-label={`Spending breakdown totaling $${totalExpenses.toFixed(2)}`}
            >
              <div
                className="breakdown-arc"
                style={{
                  background: `conic-gradient(from 270deg, ${chartStops}, #ecece9 50% 100%)`,
                }}
              />
              <div className="breakdown-hole" />
              <div className="breakdown-center">
                <strong>100%</strong>
                <span>Total</span>
              </div>
            </div>
            <p className="breakdown-total">${totalExpenses.toFixed(2)} spent</p>
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
          <div className="breakdown-empty-state">
            <div
              className="breakdown-chart"
              role="img"
              aria-label="No spending recorded this month"
            >
              <div className="breakdown-arc" />
              <div className="breakdown-hole" />
            </div>
            <p className="breakdown-empty">No expenses recorded this month.</p>
          </div>
        )}
      </div>
    </section>
  );
}
