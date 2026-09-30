function Header({ searchQuery, onSearch }) {
  return (
    <header className="dashboard-header">
      <label className="dashboard-search">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search transactions..."
          aria-label="Search transactions"
        />
      </label>
    </header>
  );
}
export default Header;
