import { formatCurrency } from "./transactionHelpers";

function Summary({
  currentBalance,
  monthlyBudget,
  monthlyExpenses,
  monthlyIncome,
  isBudgetEditing,
  budgetDraft,
  onBudgetDraftChange,
  onEditBudget,
  onSaveBudget,
  onCancelBudget,
  currency,
  locale,
}) {
  const format = (amount) => formatCurrency(amount, currency, locale);
  const spentPercent = monthlyBudget
    ? Math.min((monthlyExpenses / monthlyBudget) * 100, 100)
    : 0;
  const remaining = Math.max(monthlyBudget - monthlyExpenses, 0);
  const remainingPercent = Math.max(100 - spentPercent, 0);
  const savings = monthlyIncome - monthlyExpenses;
  const savingsPercent = monthlyIncome
    ? Math.max((savings / monthlyIncome) * 100, 0)
    : 0;

  const metrics = [
    {
      label: "Monthly Budget",
      value: monthlyBudget ? format(monthlyBudget) : "Not set",
      detail: monthlyBudget
        ? `${format(monthlyExpenses)} spent this month`
        : "Set a monthly limit to track progress",
      percent: spentPercent,
      color: "#e98a3a",
    },
    {
      label: "Spent",
      value: format(monthlyExpenses),
      detail: monthlyBudget
        ? `${Math.round(spentPercent)}% of budget`
        : "This month's expenses",
      percent: spentPercent,
      color: "#e98a3a",
    },
    {
      label: "Remaining",
      value: format(remaining),
      detail:
        monthlyBudget && monthlyExpenses > monthlyBudget
          ? `${format(monthlyExpenses - monthlyBudget)} over budget`
          : monthlyBudget
            ? `${Math.round(remainingPercent)}% left`
            : "Set a monthly limit to track progress",
      percent: remainingPercent,
      color: "#b977ca",
    },
    {
      label: "Current Balance",
      value: format(currentBalance),
      detail: monthlyIncome
        ? `${format(savings)} net this month`
        : "All-time income less expenses",
      percent: savingsPercent,
      color: "#d5ad3a",
    },
  ];

  return (
    <section className="dashboard-metrics" aria-label="Monthly budget summary">
      {metrics.map((metric) => (
        <article
          className="metric-card"
          id={
            metric.label === "Monthly Budget"
              ? "monthly-budget-settings"
              : undefined
          }
          key={metric.label}
          style={{ "--metric-color": metric.color }}
        >
          <div className="metric-heading">
            <h2>{metric.label}</h2>
            {metric.label === "Monthly Budget" && isBudgetEditing ? (
              <form className="budget-edit-form" onSubmit={onSaveBudget}>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={budgetDraft}
                  onChange={(event) => onBudgetDraftChange(event.target.value)}
                  aria-label="Monthly budget amount"
                  autoFocus
                  required
                />
                <button type="submit">Save</button>
                <button type="button" onClick={onCancelBudget}>
                  Cancel
                </button>
              </form>
            ) : metric.label === "Monthly Budget" ? (
              <button
                type="button"
                className="budget-edit-trigger"
                onClick={onEditBudget}
              >
                {monthlyBudget ? "Edit" : "Set budget"}
              </button>
            ) : null}
          </div>
          <div className="metric-value-row">
            <p className="metric-value">{metric.value}</p>
            <span className="metric-detail">{metric.detail}</span>
          </div>
          <div
            className="metric-track"
            role="meter"
            aria-label={`${metric.label} progress`}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={Math.round(metric.percent)}
          >
            <span style={{ width: `${metric.percent}%` }} />
          </div>
          <span className="metric-percent">{Math.round(metric.percent)}%</span>
        </article>
      ))}
    </section>
  );
}
export default Summary;
