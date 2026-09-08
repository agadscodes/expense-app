export default function Transactions({totalTrans, transArray, deleteTrans}) {
  if(totalTrans == 0){
      return <div className="empty-transactions">
        <h3>No transactions yet</h3>
        <p>Add a new transaction above to get started.</p>
      </div>
  }
  return (
    <div className="transactions">
      {/* Header */}
      <div className="transactions-header">
        <h2>All Transactions</h2>
        <span>Showing {totalTrans} transactions</span>
      </div>

      {/* Transaction List */}
      <div className="transaction-list">
{transArray.map((item, index) => {
const isIncome = item.category == "income"
        return <div className="transaction-item">
          <div className="transaction-info">
            <div className="transaction-icon">🛒</div>
            <div className="transaction-details">
              <h3>{item.description}</h3>
              <p>Oct 22, 2026</p>
            </div>
          </div>
          <div className="transaction-right">
            <span className={`transaction-amount ${isIncome ? "income" : "expense"}`}>{isIncome ? "+" : "-"}{item.amount}</span>
            <button type="button" className="delete-transaction" onClick={()=> deleteTrans(index)}>✕</button>
          </div>
        </div>
})}

      </div>


    </div>
  );
}