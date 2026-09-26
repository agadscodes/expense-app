import { useState } from "react";

function Header({ balance }) {
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
    <header className="expense-header">
      <div className="welcome-copy">
        <p className="welcome-eyebrow">Personal finance</p>
        <h1>Welcome back, {userName}</h1>
        <p>
          {new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(
            new Date(),
          )}
        </p>
      </div>
      <div className="header-actions">
        <div className="balance-pill">
          <span>Current balance</span>
          <strong>${balance.toFixed(2)}</strong>
        </div>
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
