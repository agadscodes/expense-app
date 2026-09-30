import { useEffect, useRef, useState } from "react";

function formatExpiry(value) {
  if (!value) return "";
  const [year, month] = value.split("-");
  return `${month}/${year}`;
}

export default function CardModal({
  cards,
  isOpen,
  onAddCard,
  onRemoveCard,
  onClose,
}) {
  const dialogRef = useRef(null);
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  function handleSubmit(event) {
    event.preventDefault();
    const digits = cardNumber.replaceAll(" ", "");
    const month = Number(expiryMonth);
    const year = Number(expiryYear);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (digits.length < 12 || digits.length > 19) {
      setError("Enter a card number between 12 and 19 digits.");
      return;
    }
    if (
      month < 1 ||
      month > 12 ||
      year < currentYear ||
      year > currentYear + 30 ||
      (year === currentYear && month < currentMonth)
    ) {
      setError("Enter an expiry month that has not passed.");
      return;
    }

    onAddCard({
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      cardholder: cardholder.trim(),
      lastFour: digits.slice(-4),
      expiry: `${year}-${String(month).padStart(2, "0")}`,
    });
    setCardholder("");
    setCardNumber("");
    setExpiryMonth("");
    setExpiryYear("");
    setError("");
  }

  return (
    <dialog
      className="transaction-modal card-modal"
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
          <p>PAYMENT METHODS</p>
          <h2>Add a card</h2>
        </div>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close card form"
        >
          ×
        </button>
      </div>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cardholder-name">Cardholder name</label>
          <input
            id="cardholder-name"
            name="cardholder"
            type="text"
            autoComplete="cc-name"
            value={cardholder}
            onChange={(event) => setCardholder(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="card-number">Card number</label>
          <input
            id="card-number"
            name="cardNumber"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            maxLength={23}
            value={cardNumber}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "").slice(0, 19);
              setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
            }}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        <div className="form-row card-expiry-inputs">
          <div className="form-group">
            <label htmlFor="card-expiry-month">Expiration month</label>
            <input
              id="card-expiry-month"
              name="expiryMonth"
              type="number"
              inputMode="numeric"
              min="1"
              max="12"
              step="1"
              placeholder="MM"
              autoComplete="cc-exp-month"
              value={expiryMonth}
              onChange={(event) => setExpiryMonth(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="card-expiry-year">Expiration year</label>
            <input
              id="card-expiry-year"
              name="expiryYear"
              type="number"
              inputMode="numeric"
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 30}
              step="1"
              placeholder="YYYY"
              autoComplete="cc-exp-year"
              value={expiryYear}
              onChange={(event) => setExpiryYear(event.target.value)}
              required
            />
          </div>
        </div>
        {error && (
          <p className="card-form-error" role="alert">
            {error}
          </p>
        )}
        <p className="card-storage-note">
          Only the cardholder, expiration, and last four digits are saved.
        </p>
        <button type="submit" className="add-transaction-btn">
          Save card
        </button>
      </form>
      {cards.length > 0 && (
        <section className="saved-cards" aria-labelledby="saved-cards-title">
          <h3 id="saved-cards-title">Saved cards</h3>
          {cards.map((card) => (
            <div className="saved-card" key={card.id}>
              <span>
                <strong>{card.cardholder}</strong>
                <small>
                  •••• {card.lastFour} · Expires {formatExpiry(card.expiry)}
                </small>
              </span>
              <button
                type="button"
                className="saved-card-remove"
                aria-label={`Remove card ending in ${card.lastFour}`}
                onClick={() => onRemoveCard(card.id)}
              >
                ×
              </button>
            </div>
          ))}
        </section>
      )}
    </dialog>
  );
}
