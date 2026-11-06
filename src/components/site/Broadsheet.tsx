import { useEffect, type CSSProperties, type ReactNode } from "react";
import { AlertTriangle, Star } from "lucide-react";
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
/*  Status line (live open / closed)                                           */
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
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Front-page masthead                                                        */
/* -------------------------------------------------------------------------- */

interface MastheadProps {
  /** Small line above the title, e.g. "The". */
  pre: string;
  /** Upright part of the title. */
  main: string;
  /** Italic red part of the title. */
  accent: string;
  subtitle: ReactNode;
  children?: ReactNode;
}

export function Masthead({ pre, main, accent, subtitle, children }: MastheadProps) {
  const status = useOpenStatus();
  return (
    <header className="cm-masthead cm-wrap">
      <div className="cm-title-row">
        <div>
          <h1 className="cm-title" aria-label={`${pre} ${main} ${accent}`.replace(/\s+/g, " ").trim()}>
            {pre && (
              <span className="cm-title__pre">
                <SplitLetters text={pre} />
              </span>
            )}
            {main && <SplitLetters text={`${main} `} offset={pre.length} />}
            <em>
              <SplitLetters text={accent} offset={pre.length + main.length + 1} />
            </em>
          </h1>
          <p className="cm-subtitle">{subtitle}</p>
          <StatusBar />
          {children}
        </div>
        <FryerCam open={status.open} />
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inner-page header (compact)                                                */
/* -------------------------------------------------------------------------- */

export function PageHead({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <header className="cm-wrap cm-pagehead">
      <h1 className="cm-pagehead__title">{title}</h1>
      {children && <p className="cm-subtitle cm-pagehead__lede">{children}</p>}
      <StatusBar />
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Price disclaimer: one clear line                                           */
/* -------------------------------------------------------------------------- */

export function PriceNotice() {
  return (
    <div className="cm-notice-strip" role="note">
      <span className="cm-notice-strip__icon" aria-hidden="true">
        <AlertTriangle size={22} strokeWidth={2.4} />
      </span>
      <div>
        <p className="cm-notice-strip__title">Prices are a guide only.</p>
        <p className="cm-notice-strip__text">
          The price at the counter is the price you pay. To check a price, call{" "}
          <a href={SHOP.phoneHref} className="cm-notice-strip__call">
            {SHOP.phoneDisplay}
          </a>
          .
        </p>
      </div>
    </div>
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
