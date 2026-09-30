const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "add-card", label: "Add Card", icon: "+" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

function Sidebar({ activeNav, onNavigate, onAddCard, onOpenSettings }) {
  function handleNavigation(id) {
    onNavigate(id);
    if (id === "add-card") onAddCard();
    if (id === "settings") onOpenSettings();
  }

  return (
    <aside className="app-sidebar" aria-label="Main navigation">
      <a
        className="sidebar-brand"
        href="#dashboard-content"
        onClick={() => onNavigate("dashboard")}
      >
        TrackIt
      </a>
      <nav className="sidebar-nav" aria-label="Main">
        {navigationItems.map((item) => (
          <button
            className={`sidebar-nav-item${activeNav === item.id ? " is-active" : ""}`}
            type="button"
            key={item.id}
            aria-current={activeNav === item.id ? "page" : undefined}
            onClick={() => handleNavigation(item.id)}
          >
            <span className="sidebar-nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <span className="sidebar-caption">PERSONAL FINANCE</span>
    </aside>
  );
}

export default Sidebar;
