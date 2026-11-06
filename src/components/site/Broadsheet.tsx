import { useEffect, type CSSProperties, type ReactNode } from "react";
import { AlertTriangle, Phone, Star } from "lucide-react";
import { ALL_ITEMS, SHOP, displayName, formatPrice } from "@/data/menu";
import FryerCam from "./FryerCam";
import { useOpenStatus } from "./hooks";

/* -------------------------------------------------------------------------- */
/*  Small utilities                                                            */
/* -------------------------------------------------------------------------- */

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · Costa's Takeaway` : "Costa's Takeaway | Fish & Chips, Woodridge QLD";
  }, [title]);
}

export function brisbaneWeekday(date = new Date()): number {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    new Intl.DateTimeFormat("en-US", { timeZone: SHOP.timeZone, weekday: "short" }).format(date),
  );
}

function SplitLetters({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="cm-letter" style={{ "--i": i + offset } as CSSProperties}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Status bar (live open / closed)                                            */
/* -------------------------------------------------------------------------- */

export function StatusBar() {
  const status = useOpenStatus();
  return (
    <div className="cm-status" role="status">
      <span className="cm-status__pill" data-open={status.open}>
        <span className="cm-status__dot" />
        {status.headline}
      </span>
      <span className="cm-status__detail">{status.detail}</span>
      {status.progress !== null && (
        <span className="cm-status__bar" aria-hidden="true" title="How far through today's trading we are">
          <span style={{ transform: `scaleX(${status.progress})` }} />
        </span>
      )}
      <a className="cm-status__phone" href={SHOP.phoneHref}>
        <Phone size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "-2px" }} />
        {SHOP.phoneDisplay}
      </a>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Masthead                                                                   */
/* -------------------------------------------------------------------------- */

interface MastheadProps {
  /** Small line above the title, e.g. "The". */
  pre: string;
  /** Upright part of the title. */
  main: string;
  /** Italic red part of the title. */
  accent: string;
  subtitle: ReactNode;
}

export function Masthead({ pre, main, accent, subtitle }: MastheadProps) {
  const status = useOpenStatus();
  const today = new Date();
  const dateline = new Intl.DateTimeFormat("en-AU", {
    timeZone: SHOP.timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);
  const start = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - start.getTime()) / 86_400_000);

  return (
    <header className="cm-masthead cm-wrap">
      <hr className="cm-rule" />
      <div className="cm-dateline cm-kicker">
        <span>
          Vol. {today.getFullYear() - 2000} · No. {dayOfYear}
        </span>
        <span>{dateline}</span>
        <span>Woodridge, QLD · Price: free (the food isn't)</span>
      </div>
      <hr className="cm-rule cm-rule--double" />

      <div className="cm-title-row">
        <div>
          <h1 className="cm-title" aria-label={`${pre} ${main} ${accent}`.replace(/\s+/g, " ").trim()}>
            <span className="cm-title__pre">
              <SplitLetters text={pre} />
            </span>
            {main && <SplitLetters text={`${main} `} offset={pre.length} />}
            <em>
              <SplitLetters text={accent} offset={pre.length + main.length + 1} />
            </em>
          </h1>
          <p className="cm-subtitle">{subtitle}</p>
        </div>
        <FryerCam open={status.open} />
      </div>

      <hr className="cm-rule" />
      <StatusBar />
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inner-page header (smaller than the masthead)                              */
/* -------------------------------------------------------------------------- */

export function PageHead({ folio, kicker, title, children }: { folio: string; kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="cm-wrap cm-pagehead">
      <hr className="cm-rule cm-rule--double" />
      <div className="cm-pagehead__row">
        <span className="cm-section__folio" aria-hidden="true">
          {folio}
        </span>
        <div>
          <div className="cm-kicker">{kicker}</div>
          <h1 className="cm-pagehead__title">{title}</h1>
        </div>
      </div>
      {children && <p className="cm-subtitle cm-pagehead__lede">{children}</p>}
      <hr className="cm-rule" />
      <StatusBar />
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Price disclaimer                                                           */
/* -------------------------------------------------------------------------- */

export function PriceNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="cm-notice-strip" role="note">
        <AlertTriangle size={16} strokeWidth={2.4} aria-hidden="true" />
        <span>
          <b>Prices shown are a guide.</b> The price at the counter is the price you pay.
        </span>
      </p>
    );
  }
  return (
    <aside className="cm-wrap" aria-labelledby="cm-notice-title">
      <div className="cm-notice" role="note">
        <div className="cm-notice__badge" aria-hidden="true">
          <AlertTriangle size={28} strokeWidth={2.4} />
        </div>
        <div className="cm-notice__body">
          <div className="cm-kicker cm-notice__kicker">Important notice to all readers</div>
          <h2 id="cm-notice-title" className="cm-notice__title">
            Prices on this page are a guide only.
          </h2>
          <p className="cm-notice__text">
            The price at the counter is the price you pay. If anything here is different from what you're charged in
            store, <strong>the in-store price applies</strong>. To check a price before you come in, call{" "}
            <a href={SHOP.phoneHref}>{SHOP.phoneDisplay}</a>.
          </p>
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  Ticker                                                                     */
/* -------------------------------------------------------------------------- */

export function Ticker() {
  const items = ALL_ITEMS.filter((i) => i.popular);
  const run = (hidden: boolean) =>
    items.map((item) => (
      <span key={`${hidden}-${item.id}`} className="cm-ticker__item" aria-hidden={hidden || undefined}>
        <Star size={11} className="cm-ticker__star" fill="currentColor" strokeWidth={0} />
        {displayName(item)}{" "}
        <b>{item.description && /for \$/.test(item.description) ? item.description : formatPrice(item.priceCents)}</b>
      </span>
    ));
  return (
    <div className="cm-ticker" role="marquee" aria-label="Local favourites">
      <div className="cm-ticker__track">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Trading hours table                                                        */
/* -------------------------------------------------------------------------- */

const HOUR_ROWS: [string, number[], string][] = [
  ["Monday", [1], "12:00pm – 7:30pm"],
  ["Tuesday – Friday", [2, 3, 4, 5], "10:30am – 7:30pm"],
  ["Saturday", [6], "10:30am – 7:00pm"],
  ["Sunday", [0], "Closed"],
];

export function HoursTable() {
  const today = brisbaneWeekday();
  return (
    <table className="cm-hours">
      <tbody>
        {HOUR_ROWS.map(([label, days, hours]) => (
          <tr key={label} data-today={days.includes(today)}>
            <td>{label}</td>
            <td>{hours}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
