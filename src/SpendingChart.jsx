import { getTransactionDate } from "./transactionHelpers";

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function SpendingChart({ transactions }) {
  const year = new Date().getFullYear();
  const monthlySpending = Array(12).fill(0);

  transactions.forEach((transaction) => {
    if (transaction.category === "income") return;

    const dateValue = getTransactionDate(transaction);
    if (!dateValue) return;

    const date = new Date(`${dateValue}T12:00:00`);
    if (date.getFullYear() === year) {
      monthlySpending[date.getMonth()] += Number(transaction.amount) || 0;
    }
  });

  const maxSpending = Math.max(...monthlySpending, 1);

  return (
    <section className="spending-chart" aria-labelledby="spending-chart-title">
      <div className="spending-chart-header">
        <div>
          <h2 id="spending-chart-title">Spending Overview</h2>
          <p>Monthly expenses in {year}</p>
        </div>
        <strong>
          $
          {monthlySpending
            .reduce((total, amount) => total + amount, 0)
            .toFixed(2)}
        </strong>
      </div>
      <div className="spending-chart-scroll">
        <div className="spending-chart-bars">
          {monthLabels.map((month, index) => {
            const amount = monthlySpending[index];
            const height =
              amount > 0 ? Math.max((amount / maxSpending) * 100, 3) : 0;

            return (
              <div className="spending-chart-column" key={month}>
                <div className="spending-chart-bar-track">
                  <div
                    className="spending-chart-bar"
                    style={{ height: `${height}%` }}
                    title={`${month}: $${amount.toFixed(2)}`}
                    aria-label={`${month}: $${amount.toFixed(2)}`}
                  />
                </div>
                <span>{month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
