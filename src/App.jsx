import { useEffect, useState } from "react";
import Header from "./Header";
import Summary from "./Summary";
import Breakdown from "./Breakdown";
import TransactionForm from "./TransactionForm";
import Transactions from "./Transactions";

function App() {
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
  const dashBoard = {
    currentBalance,
    totalIncome,
    totalExpenses,
  };
  const totalTrans = transArray.length;
  return (
    <div className="expense-app">
      <Header />
      <Summary dashBoard={dashBoard} />
      <Breakdown transactions={transArray} />
      <TransactionForm addTrans={addTrans} />
      <Transactions
        totalTrans={totalTrans}
        transArray={transArray}
        deleteTrans={deleteTrans}
      />
    </div>
  );
}

export default App;
