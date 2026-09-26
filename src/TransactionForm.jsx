import { useEffect, useRef, useState } from "react";
import { getLocalDateValue } from "./transactionHelpers";

export default function TransactionForm({ addTrans, isOpen, onClose }) {
  const dialogRef = useRef(null);
  const [transaction, setTransaction] = useState({
    id: "",
    description: "",
    amount: "",
    category: "",
    date: getLocalDateValue(),
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  function handleChange(event) {
    setTransaction((prev) => {
      const { name, value } = event.target;
      return {
        ...prev,
        [name]: value,
      };
    });
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (
      !transaction.description ||
      !transaction.amount ||
      !transaction.category
    ) {
      alert("Plese input required values");
      return;
    }
    addTrans({
      ...transaction,
      amount: parseFloat(transaction.amount),
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    });
    setTransaction({
      id: "",
      description: "",
      amount: "",
      category: "",
      date: getLocalDateValue(),
    });
    onClose();
  }
  return (
    <dialog
      className="transaction-modal"
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="transaction-modal-header">
        <div>
          <p>PERSONAL FINANCE</p>
          <h2>New transaction</h2>
        </div>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close transaction form"
        >
          ×
        </button>
      </div>
      <form className="transaction-form" onSubmit={handleSubmit}>
        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            value={transaction.description}
            name="description"
            type="text"
            id="description"
            placeholder="e.g., Grocery Shopping"
            onChange={handleChange}
            required
          />
        </div>

        {/* Form Row: Amount & Category */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              value={transaction.amount}
              onChange={handleChange}
              name="amount"
              type="number"
              id="amount"
              placeholder="0.00"
              min="100"
              step="100"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={transaction.category}
              name="category"
              onChange={handleChange}
            >
              <option value="" disabled>
                Select a Category
              </option>
              <option value="income">Income</option>
              <option value="food">Food & Dining</option>
              <option value="housing">Housing & Utilities</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="transaction-date">Date</label>
          <input
            value={transaction.date}
            onChange={handleChange}
            name="date"
            type="date"
            id="transaction-date"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="add-transaction-btn">
          Save transaction
        </button>
      </form>
    </dialog>
  );
}
