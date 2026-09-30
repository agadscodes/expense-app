import {
  formatCurrency,
  getLocalDateValue,
  getTransactionDate,
} from "./transactionHelpers";

export default function SpendingChart({ transactions, currency, locale }) {
  const today = new Date();
  const days = Array.from({ length: 8 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (7 - index));
    const dateValue = getLocalDateValue(date);
    const amount = transactions
      .filter(
        (transaction) =>
          transaction.category !== "income" &&
          getTransactionDate(transaction) === dateValue,
      )
      .reduce(
        (total, transaction) => total + (Number(transaction.amount) || 0),
        0,
      );
    return { date, dateValue, amount };
  });
  const maxSpending = Math.max(...days.map((day) => day.amount), 1);
  const totalSpending = days.reduce((total, day) => total + day.amount, 0);
  const axisValues = [1, 0.75, 0.5, 0.25, 0];

  return (
    <section
      className="dashboard-panel spending-chart"
      aria-labelledby="spending-chart-title"
    >
      <div className="panel-heading">
        <div>
          <h2 id="spending-chart-title">Spending Trend</h2>
          <p>Daily spending over the last 8 days</p>
        </div>
        <span className="panel-period">This month</span>
      </div>
      <div className="trend-chart">
        <div className="trend-axis" aria-hidden="true">
          {axisValues.map((ratio) => (
            <span key={ratio}>
              {formatCurrency(maxSpending * ratio, currency, locale, 0)}
            </span>
          ))}
        </div>
        <div className="trend-plot">
          <div className="trend-gridlines" aria-hidden="true">
            {axisValues.map((ratio) => (
              <span key={ratio} />
            ))}
          </div>
          <div className="trend-bars">
            {days.map((day) => {
              const height = day.amount
                ? Math.max((day.amount / maxSpending) * 100, 3)
                : 0;
              const isToday = day.dateValue === getLocalDateValue(today);
              return (
                <div className="trend-bar-column" key={day.dateValue}>
                  <div
                    className={`trend-bar${isToday ? " is-today" : ""}`}
                    style={{ height: `${height}%` }}
                    title={`${day.date.toLocaleDateString(locale)}: ${formatCurrency(day.amount, currency, locale)}`}
                    aria-label={`${day.date.toLocaleDateString(locale)}: ${formatCurrency(day.amount, currency, locale)}`}
                  />
                  <span>{day.date.getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="trend-footer">
        <span>Last 8 days</span>
        <strong>{formatCurrency(totalSpending, currency, locale)}</strong>
      </div>
    </section>
  );
}
