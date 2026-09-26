import { useState } from "react";

function Header({ balance, onOpenForm }) {
  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem("expense-user-name") || "there";
    } catch {
      return "there";
    }
  });
  const [nameInput, setNameInput] = useState(
    userName === "there" ? "" : userName,
  );
  const [isEditing, setIsEditing] = useState(false);

  function saveName(event) {
    event.preventDefault();
    const nextName = nameInput.trim();
    if (!nextName) return;

    setUserName(nextName);
    setIsEditing(false);
    try {
      localStorage.setItem("expense-user-name", nextName);
    } catch {}
  }

  return (
    <header className="dashboard-header">
      <div className="dashboard-welcome">
        <p className="dashboard-eyebrow">Personal finance</p>
        <h1>Welcome back, {userName}</h1>
        <p>
          {new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(
            new Date(),
          )}
        </p>
      </div>
      <div className="dashboard-controls">
        <div className="dashboard-balance">
          <span>Current balance</span>
          <strong>${balance.toFixed(2)}</strong>
        </div>
        <button
          type="button"
          className="new-transaction-btn"
          onClick={onOpenForm}
        >
          <span aria-hidden="true">+</span> New transaction
        </button>
        {isEditing ? (
          <form className="name-edit-form" onSubmit={saveName}>
            <input
              aria-label="Your name"
              autoFocus
              maxLength={40}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Your name"
              value={nameInput}
            />
            <button type="submit">Save</button>
          </form>
        ) : (
          <button
            type="button"
            className="edit-name-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit name
          </button>
        )}
      </div>
    </header>
  );
}
export default Header;
