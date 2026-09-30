import { useEffect, useState } from "react";
import Header from "./Header";
import Summary from "./Summary";
import Breakdown from "./Breakdown";
import BudgetPlan from "./BudgetPlan";
import SpendingChart from "./SpendingChart";
import CardModal from "./CardModal";
import TransactionForm from "./TransactionForm";
import Transactions from "./Transactions";
import { getLocalDateValue, getTransactionDate } from "./transactionHelpers";
import Sidebar from "./Sidebar";

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [isBudgetEditing, setIsBudgetEditing] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem("expense-currency") || "USD";
    } catch {
      return "USD";
    }
  });
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("expense-language") || "en-US";
    } catch {
      return "en-US";
    }
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem("expense-dark-mode") !== "false";
    } catch {
      return true;
    }
  });
  const [paymentCards, setPaymentCards] = useState(() => {
    try {
      const savedCards = JSON.parse(
        localStorage.getItem("expense-payment-cards") || "[]",
      );
      return Array.isArray(savedCards) ? savedCards : [];
    } catch {
      return [];
    }
  });
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    try {
      const savedBudget = localStorage.getItem("expense-monthly-budget");
      return savedBudget === null ? 0 : Math.max(0, Number(savedBudget) || 0);
    } catch {
      return 0;
    }
  });
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

  useEffect(() => {
    try {
      localStorage.setItem("expense-monthly-budget", String(monthlyBudget));
    } catch {}
  }, [monthlyBudget]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "expense-payment-cards",
        JSON.stringify(paymentCards),
      );
    } catch {}
  }, [paymentCards]);

  useEffect(() => {
    try {
      localStorage.setItem("expense-currency", currency);
      localStorage.setItem("expense-language", language);
      localStorage.setItem("expense-dark-mode", String(isDarkMode));
    } catch {}
    document.documentElement.lang = language;
    document.body.dataset.theme = isDarkMode ? "dark" : "light";
  }, [currency, language, isDarkMode]);

  function addTrans(transObj) {
    setTransArr((prev) => [...prev, transObj]);
  }

  function deleteTrans(id) {
    setTransArr((prev) => prev.filter((transaction) => transaction.id !== id));
  }

  function addPaymentCard(card) {
    setPaymentCards((prev) => [...prev, card]);
  }

  function removePaymentCard(id) {
    setPaymentCards((prev) => prev.filter((card) => card.id !== id));
  }

  const currentMonth = getLocalDateValue().slice(0, 7);
  const monthlyTransactions = transArray.filter((transaction) =>
    getTransactionDate(transaction).startsWith(currentMonth),
  );
  const monthlyExpenses = monthlyTransactions
    .filter((transaction) => transaction.category !== "income")
    .reduce(
      (total, transaction) => total + (Number(transaction.amount) || 0),
      0,
    );
  const monthlyIncome = monthlyTransactions
    .filter((transaction) => transaction.category === "income")
    .reduce(
      (total, transaction) => total + (Number(transaction.amount) || 0),
      0,
    );

  const totalIncome = transArray
    .filter((t) => t.category === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transArray
    .filter((t) => t.category !== "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpenses;
  const visibleTransactions = transArray.filter((transaction) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const description = String(transaction.description ?? "").toLowerCase();
    const category = String(transaction.category ?? "").toLowerCase();
    return description.includes(query) || category.includes(query);
  });

  function saveBudget(event) {
    event.preventDefault();
    const nextBudget = Number(budgetDraft);
    if (!Number.isFinite(nextBudget) || nextBudget <= 0) return;
    setMonthlyBudget(nextBudget);
    setIsBudgetEditing(false);
  }

  function openSettings() {
    setActiveNav("settings");
  }

  return (
    <div className="expense-app" data-theme={isDarkMode ? "dark" : "light"}>
      <Sidebar
        activeNav={activeNav}
        onNavigate={setActiveNav}
        onAddCard={() => {
          setActiveNav("dashboard");
          setIsCardModalOpen(true);
        }}
        onOpenSettings={openSettings}
      />
      <main
        className="dashboard"
        id="dashboard-content"
        aria-label="Finance dashboard"
      >
        {activeNav === "settings" ? (
          <section className="settings-view" aria-labelledby="settings-title">
            <div className="settings-heading">
              <p className="settings-eyebrow">PREFERENCES</p>
              <h1 id="settings-title">Settings</h1>
              <p>Personalize your TrackIt experience.</p>
            </div>
            <div className="settings-list">
              <label className="settings-row" htmlFor="language-setting">
                <span>
                  <strong>Language</strong>
                  <small>Choose your display language</small>
                </span>
                <select
                  id="language-setting"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                >
                  <option value="en-US">English</option>
                  <option value="es-ES">Español</option>
                  <option value="fr-FR">Français</option>
                </select>
              </label>
              <label className="settings-row" htmlFor="dark-mode-setting">
                <span>
                  <strong>Dark mode</strong>
                  <small>Use a dark appearance across the dashboard</small>
                </span>
                <input
                  className="settings-toggle"
                  id="dark-mode-setting"
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={(event) => setIsDarkMode(event.target.checked)}
                />
              </label>
              <label className="settings-row" htmlFor="currency-setting">
                <span>
                  <strong>Currency</strong>
                  <small>Used to display your amounts</small>
                </span>
                <select
                  id="currency-setting"
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CHF">CHF - Swiss Franc</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="NZD">NZD - New Zealand Dollar</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                  <option value="HKD">HKD - Hong Kong Dollar</option>
                  <option value="SEK">SEK - Swedish Krona</option>
                  <option value="NOK">NOK - Norwegian Krone</option>
                  <option value="DKK">DKK - Danish Krone</option>
                  <option value="MXN">MXN - Mexican Peso</option>
                  <option value="BRL">BRL - Brazilian Real</option>
                  <option value="ZAR">ZAR - South African Rand</option>
                  <option value="KRW">KRW - South Korean Won</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="PLN">PLN - Polish Zloty</option>
                </select>
              </label>
            </div>
          </section>
        ) : (
          <>
            <Header searchQuery={searchQuery} onSearch={setSearchQuery} />
            <Summary
              currentBalance={currentBalance}
              monthlyBudget={monthlyBudget}
              monthlyExpenses={monthlyExpenses}
              monthlyIncome={monthlyIncome}
              isBudgetEditing={isBudgetEditing}
              budgetDraft={budgetDraft}
              onBudgetDraftChange={setBudgetDraft}
              onEditBudget={() => {
                setBudgetDraft(String(monthlyBudget || ""));
                setIsBudgetEditing(true);
              }}
              onSaveBudget={saveBudget}
              onCancelBudget={() => setIsBudgetEditing(false)}
              currency={currency}
              locale={language}
            />
            <div className="dashboard-workspace">
              <SpendingChart
                transactions={monthlyTransactions}
                currency={currency}
                locale={language}
              />
              <Breakdown transactions={monthlyTransactions} />
              <Transactions
                totalTrans={visibleTransactions.length}
                allCount={transArray.length}
                transArray={visibleTransactions}
                allTransactions={transArray}
                deleteTrans={deleteTrans}
                onOpenForm={() => setIsFormOpen(true)}
                currency={currency}
                locale={language}
              />
              <BudgetPlan
                transactions={monthlyTransactions}
                monthlyBudget={monthlyBudget}
                currency={currency}
                locale={language}
              />
            </div>
          </>
        )}
      </main>
      <TransactionForm
        addTrans={addTrans}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
      <CardModal
        cards={paymentCards}
        isOpen={isCardModalOpen}
        onAddCard={addPaymentCard}
        onRemoveCard={removePaymentCard}
        onClose={() => setIsCardModalOpen(false)}
      />
    </div>
  );
}

export default App;
