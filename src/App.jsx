import { useEffect, useState } from "react";
import Header from "./Header";
import Summary from "./Summary";
import Breakdown from "./Breakdown";
import SpendingChart from "./SpendingChart";
import TransactionForm from "./TransactionForm";
import Transactions from "./Transactions";

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [transArray, setTransArr] = useState(() => {
    try {
      const savedTransactions = localStorage.getItem("expense-transactions");
      const parsedTransactions = savedTransactions
        ? JSON.parse(savedTransactions)
        : [];
      return Array.isArray(parsedTransactions) ? parsedTransactions : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("expense-transactions", JSON.stringify(transArray));
    } catch {}
  }, [transArray]);

  function addTrans(transObj) {
    setTransArr((prev) => [...prev, transObj]);
  }

  function deleteTrans(id) {
    setTransArr((prev) => prev.filter((transaction) => transaction.id !== id));
  }

  const totalIncome = transArray
    .filter((t) => t.category === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transArray
    .filter((t) => t.category !== "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpenses;
  const totalTrans = transArray.length;
  return (
    <div className="expense-app">
      <section className="dashboard" aria-label="Finance dashboard">
        <Header
          balance={currentBalance}
          onOpenForm={() => setIsFormOpen(true)}
        />
        <Summary transactions={transArray} />
        <div className="dashboard-insights">
          <SpendingChart transactions={transArray} />
          <Breakdown transactions={transArray} />
        </div>
      </section>
      <TransactionForm
        addTrans={addTrans}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
      <Transactions
        totalTrans={totalTrans}
        transArray={transArray}
        deleteTrans={deleteTrans}
      />
    </div>
  );
}

export default App;
