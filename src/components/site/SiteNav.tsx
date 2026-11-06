import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu as MenuIcon, Moon, Phone, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import logo from "@/assets/costa-logo.webp";
import { SHOP } from "@/data/menu";
import { useOpenStatus } from "./hooks";

const LINKS = [
  { to: "/", label: "Front page", folio: "A", end: true },
  { to: "/menu", label: "Menu", folio: "B", end: false },
  { to: "/contact", label: "Find us", folio: "C", end: false },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      className="cm-nav__icon"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

const SiteNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const status = useOpenStatus();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <nav className="cm-nav" aria-label="Main">
      <div className="cm-wrap cm-nav__inner">
        <NavLink to="/" className="cm-nav__brand" aria-label="Costa's Takeaway, front page">
          <img src={logo} alt="" width={44} height={44} />
          <span>
            <b>Costa's</b>
            <small>Takeaway · Woodridge</small>
          </span>
        </NavLink>

        <div className="cm-nav__links">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="cm-nav__link">
              <small>{l.folio}</small>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="cm-nav__actions">
          <span className="cm-nav__status" data-open={status.open} title={status.detail}>
            <span className="cm-status__dot" />
            {status.open ? "Open now" : "Closed"}
          </span>
          <a className="cm-nav__call" href={SHOP.phoneHref}>
            <Phone size={15} />
            <span>{SHOP.phoneDisplay}</span>
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="cm-nav__icon cm-nav__burger"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="cm-nav-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      <div id="cm-nav-drawer" className="cm-nav__drawer" data-open={open} hidden={!open}>
        <div className="cm-wrap">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="cm-nav__drawer-link">
              <small>{l.folio}</small>
              {l.label}
            </NavLink>
          ))}
          <p className="cm-kicker" style={{ marginTop: 16 }}>
            {SHOP.address}
          </p>
        </div>
      </div>
    </nav>
  );
};

export default SiteNav;
