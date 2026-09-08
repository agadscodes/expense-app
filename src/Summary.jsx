function Summary({dashBoard}) {

  return (
    <div className="summary">
      <div className="summary-card balance-card">
        <p>Current Balance</p>
        <h2>${dashBoard.currentBalance}</h2>
      </div>
      <div className="summary-card income-card">
        <p>Total Income</p>
        <h2>${dashBoard.totalIncome}</h2>
      </div>
      <div className="summary-card expense-card">
        <p>Total Expenses</p>
        <h2>${dashBoard.totalExpenses}</h2>
      </div>
    </div>
  );
}
export default Summary;
