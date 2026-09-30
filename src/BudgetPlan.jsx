import { formatCurrency, transactionTypes } from "./transactionHelpers";

const expenseTypes = Object.entries(transactionTypes).filter(
  ([type]) => type !== "income",
);

export default function BudgetPlan({
  transactions,
  monthlyBudget,
  currency,
  locale,
}) {
  const totals = transactions
    .filter((transaction) => transaction.category !== "income")
    .reduce((result, transaction) => {
      const category = transactionTypes[transaction.category]
        ? transaction.category
        : "other";
      result[category] =
        (result[category] ?? 0) + (Number(transaction.amount) || 0);
      return result;
    }, {});
  const totalExpenses = Object.values(totals).reduce(
    (total, amount) => total + amount,
    0,
  );
  const denominator = monthlyBudget || totalExpenses;
  const format = (amount) => formatCurrency(amount, currency, locale, 0);

  return (
    <section
      className="dashboard-panel budget-plan"
      aria-labelledby="budget-plan-title"
    >
      <div className="panel-heading">
        <div>
          <h2 id="budget-plan-title">My Budget Plan</h2>
          <p>
            {monthlyBudget
              ? "Monthly spend by category."
              : "Set a budget to track category progress."}
          </p>
        </div>
        <span className="budget-plan-total">
          {monthlyBudget ? format(monthlyBudget) : "No limit"}
        </span>
      </div>
      <div className="budget-plan-list">
        {expenseTypes.map(([type, details]) => {
          const amount = totals[type] ?? 0;
          const percent = denominator ? (amount / denominator) * 100 : 0;
          return (
            <div
              className="budget-plan-row"
              key={type}
              style={{ "--category-color": details.color }}
            >
              <div className="budget-plan-row-heading">
                <span className="budget-plan-dot" />
                <span>{details.label}</span>
                <strong>{Math.round(percent)}%</strong>
              </div>
              <div className="budget-plan-track">
                <span style={{ width: `${Math.min(percent, 100)}%` }} />
              </div>
              <span className="budget-plan-amount">{format(amount)} spent</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
