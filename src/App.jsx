import { useState } from "react";
import Header from "./Header";
import Summary from "./Summary";
import TransactionForm from "./TransactionForm";
import Transactions from "./Transactions";

function App() {

  const [transArray, setTransArr] = useState([]);
  function addTrans(transObj) {
    setTransArr((prev) => [...prev, transObj]);
  }

  function deleteTrans(index){
setTransArr(prev=> prev.toSpliced(index, 1))
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
    totalExpenses
  }
  const totalTrans = transArray.length
  return (
    <div className="expense-app">
      <Header />
      <Summary dashBoard={dashBoard}/>
      <TransactionForm addTrans={addTrans} />
      <Transactions totalTrans={totalTrans} transArray={transArray} deleteTrans={deleteTrans}/>
    </div>
  );
}

export default App;
