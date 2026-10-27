import { type FC, type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";
import Navbar from "@/components/layout/Navbar";

// ─── Shared CSS ───────────────────────────────────────────────────────────────

const ACCOUNT_CSS = `
  .acct-input {
    display: block; width: 100%;
    background: #EDE8DC; border: 1px solid #E2DAC8; border-radius: 4px;
    padding: 12px 16px;
    font-family: var(--font-body); font-size: 14px; color: #1C1A17;
    outline: none; box-sizing: border-box;
    transition: border-color 150ms, box-shadow 150ms;
  }
  .acct-input:focus { border-color: #7B5EA7; box-shadow: 0 0 0 3px #F0EAF7; }
  .acct-input::placeholder { color: #C4B89A; }
  .acct-input:disabled { opacity: 0.6; cursor: not-allowed; }

  .acct-btn-gold {
    display: inline-flex; align-items: center; justify-content: center;
    background: #C49A3C; color: #fff; border: none; border-radius: 4px;
    font-family: var(--font-body); font-size: 13px; font-weight: 400;
    text-transform: uppercase; letter-spacing: 0.05em;
    padding: 12px 28px; cursor: pointer;
    transition: background 150ms, transform 100ms;
  }
  .acct-btn-gold:hover:not(:disabled) { background: #D4B060; transform: translateY(-1px); }
  .acct-btn-gold:disabled { opacity: 0.6; cursor: not-allowed; }

  .acct-btn-ghost {
    display: inline-flex; align-items: center; justify-content: center;
    background: none; color: #6B6057;
    border: 1px solid #E2DAC8; border-radius: 4px;
    font-family: var(--font-body); font-size: 13px;
    text-transform: uppercase; letter-spacing: 0.05em;
    padding: 12px 24px; cursor: pointer;
    transition: border-color 150ms, color 150ms;
  }
  .acct-btn-ghost:hover:not(:disabled) { border-color: #C4B89A; color: #1C1A17; }
  .acct-btn-ghost:disabled { opacity: 0.6; cursor: not-allowed; }

  .acct-btn-danger {
    display: inline-flex; align-items: center; justify-content: center;
    background: none; color: #A85050;
    border: 1px solid #E2C8C8; border-radius: 4px;
    font-family: var(--font-body); font-size: 13px;
    text-transform: uppercase; letter-spacing: 0.05em;
    padding: 12px 24px; cursor: pointer;
    transition: background 150ms, border-color 150ms;
  }
  .acct-btn-danger:hover { background: #FDF0F0; border-color: #A85050; }

  .acct-label {
    display: block;
    font-family: var(--font-body); font-size: 13px;
    text-transform: uppercase; letter-spacing: 0.05em; color: #6B6057;
    margin-bottom: 6px;
  }
  .acct-error {
    font-family: var(--font-body); font-size: 13px; color: #A85050;
    margin-top: 4px;
  }
  .acct-section-header {
    margin-bottom: 32px;
  }
  .acct-eyebrow {
    font-family: var(--font-body); font-size: 13px;
    text-transform: uppercase; letter-spacing: 0.05em; color: #C49A3C;
  }
  .acct-page-title {
    font-family: var(--font-heading); font-weight: 400;
    font-size: clamp(24px, 4vw, 32px); color: #1C1A17; margin: 6px 0 0;
  }
  .acct-shell {
    min-height: 100vh;
    padding-top: 96px;
    display: flex;
    flex-direction: column;
    background: #F5F0E8;
  }
  .acct-main {
    flex: 1;
    min-width: 0;
    padding: 28px 16px 40px;
  }
  .acct-mobile-nav {
    position: sticky;
    top: 96px;
    z-index: 150;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    width: 100%;
    border-bottom: 1px solid #E2DAC8;
    background: #EDE8DC;
  }
  .acct-mobile-nav button {
    min-width: 0;
    min-height: 50px;
    padding: 8px 2px;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: #6B6057;
    font-family: var(--font-body);
    font-size: 10px;
    letter-spacing: 0.04em;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;
  }
  .acct-mobile-nav button[aria-current="page"] {
    border-bottom-color: #7B5EA7;
    background: #F0EAF7;
    color: #7B5EA7;
  }
  .acct-mobile-nav button.acct-mobile-logout {
    color: #A85050;
  }
  .acct-mobile-nav button:focus-visible {
    position: relative;
    z-index: 1;
    outline-offset: -3px;
  }
  .order-detail-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
  @media (min-width: 768px) {
    .acct-shell {
      padding-top: 72px;
      flex-direction: row;
    }
    .acct-main {
      padding: 48px clamp(24px, 5vw, 80px);
    }
    .acct-mobile-nav {
      display: none;
    }
  }
  @media (max-width: 360px) {
    .acct-mobile-nav button {
      font-size: 9px;
      letter-spacing: 0.015em;
    }
  }
  @media (max-width: 480px) {
    .rewards-history-content {
      padding-right: 14px !important;
      padding-left: 14px !important;
    }
    .rewards-history-header {
      display: none !important;
    }
    .rewards-history-row {
      grid-template-columns: minmax(0, 1fr) auto !important;
      gap: 6px 12px;
      padding: 14px 0 !important;
    }
    .rewards-history-product {
      grid-column: 1 / -1;
      white-space: normal !important;
      overflow-wrap: anywhere;
    }
    .rewards-history-date,
    .rewards-history-amount,
    .rewards-history-points {
      font-size: 11px !important;
      white-space: normal;
    }
    .rewards-history-date {
      grid-column: 1;
      grid-row: 2;
    }
    .rewards-history-amount {
      grid-column: 1;
      grid-row: 3;
    }
    .rewards-history-date::before { content: "Date · "; color: #9A8F85; }
    .rewards-history-amount::before { content: "Amount · "; color: #9A8F85; }
    .rewards-history-points {
      grid-column: 2;
      grid-row: 2 / 4;
      align-self: center;
      text-align: right;
    }
    .rewards-history-row-skeleton {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .rewards-history-row-skeleton > * {
      width: 100% !important;
      min-width: 0;
    }
  }
  @media (min-width: 768px) {
    .order-detail-grid {
      grid-template-columns: minmax(0, 1fr) 300px;
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export type AccountTab = "orders" | "rewards" | "addresses" | "profile";

interface AccountLayoutProps {
  children: ReactNode;
  activeTab: AccountTab;
}

const NAV_ITEMS: {
  key: AccountTab;
  label: string;
  mobileLabel: string;
  path: string;
}[] = [
  {
    key: "orders",
    label: "My Orders",
    mobileLabel: "Orders",
    path: "/account/orders",
  },
  {
    key: "rewards",
    label: "My Rewards",
    mobileLabel: "Rewards",
    path: "/account/rewards",
  },
  {
    key: "addresses",
    label: "My Addresses",
    mobileLabel: "Addresses",
    path: "/account/addresses",
  },
  {
    key: "profile",
    label: "Profile",
    mobileLabel: "Profile",
    path: "/account/profile",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const AccountLayout: FC<AccountLayoutProps> = ({ children, activeTab }) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0 });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.warning("You were signed out on this device, but the server could not be reached.");
    } finally {
      navigate("/");
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <>
      <style>{ACCOUNT_CSS}</style>
      <Navbar />

      {/* ── Page shell ── */}
      <div className="acct-shell">
        {/* ── Desktop sidebar ── */}
        <aside
          className="hidden md:flex"
          style={{
            width: 240,
            flexShrink: 0,
            flexDirection: "column",
            background: "#EDE8DC",
            borderRight: "1px solid #E2DAC8",
            position: "sticky",
            top: 72,
            height: "calc(100vh - 72px)",
            overflowY: "auto",
          }}
        >
          {/* User card */}
          <div style={{ padding: "32px 24px 20px" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#7B5EA7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  color: "#fff",
                  fontFamily: 'var(--font-body)',
                  fontSize: 18,
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                {initials}
              </span>
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 14,
                color: "#1C1A17",
                margin: 0,
              }}
            >
              {user.name}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: "#6B6057",
                margin: "4px 0 0",
              }}
            >
              {user.phone ?? user.email}
            </p>
          </div>

          <div style={{ height: 1, background: "#E2DAC8" }} />

          {/* Nav items */}
          <nav style={{ paddingTop: 12, flex: 1 }}>
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.path)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "11px 24px",
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background: active ? "#F0EAF7" : "none",
                    color: active ? "#7B5EA7" : "#6B6057",
                    border: "none",
                    borderLeft: `2px solid ${active ? "#7B5EA7" : "transparent"}`,
                    cursor: "pointer",
                    transition: "background 150ms, color 150ms",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div style={{ padding: "8px 0 28px" }}>
            <div
              style={{ height: 1, background: "#E2DAC8", marginBottom: 8 }}
            />
            <button
              onClick={() => {
                void handleLogout();
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "11px 24px",
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                background: "none",
                color: "#A85050",
                border: "none",
                borderLeft: "2px solid transparent",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        {/* ── Mobile account navigation ── */}
        <nav className="acct-mobile-nav md:hidden" aria-label="Account navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNav(item.path)}
              aria-current={activeTab === item.key ? "page" : undefined}
            >
              {item.mobileLabel}
            </button>
          ))}
          <button
            type="button"
            className="acct-mobile-logout"
            onClick={() => { void handleLogout(); }}
          >
            Logout
          </button>
        </nav>

        {/* ── Main content ── */}
        <main
          className="acct-main pb-12"
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default AccountLayout;
