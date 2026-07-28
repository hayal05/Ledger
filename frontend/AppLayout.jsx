import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/reports", label: "Reports" },
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-12">
          <div className="flex items-center gap-8">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
              LedgerPro
            </p>
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-ledger-navy/10 text-ledger-navy"
                        : "text-ink-muted hover:text-ink"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink-muted sm:inline">
              {user?.full_name}
            </span>
            <Button variant="ghost" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-12">{children}</main>
    </div>
  );
}
