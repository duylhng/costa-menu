import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Phone, Search, ShoppingBag, Star } from "lucide-react";
import { ALL_ITEMS, MENU, SHOP, displayName, formatPrice, type IndexedItem } from "@/data/menu";
import FryerCam from "./menu/FryerCam";
import { ClassifiedsSection, CursorPreview, MenuActionsContext, MenuSection, flyToParcel, type MenuActions } from "./menu/Items";
import { ItemDialog, ParcelSheet, SearchPalette } from "./menu/Overlays";
import { useOpenStatus, useOrder, useScrollSpy } from "./menu/hooks";
import "./menu/menu.css";

const MAIN_SECTIONS = MENU.filter((c) => c.layout !== "compact");
const SIDE_SECTIONS = MENU.filter((c) => c.layout === "compact");

/* -------------------------------------------------------------------------- */
/*  Masthead                                                                   */
/* -------------------------------------------------------------------------- */

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

function Masthead() {
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
          <h1 className="cm-title" aria-label="The Daily Catch">
            <span style={{ display: "block", fontSize: "0.38em", letterSpacing: "-0.02em", marginBottom: "0.08em" }}>
              <SplitLetters text="The" />
            </span>
            <SplitLetters text="Daily " offset={3} />
            <em>
              <SplitLetters text="Catch" offset={9} />
            </em>
          </h1>
          <p className="cm-subtitle">
            Costa's Takeaway — fish, chips &amp; everything golden, cooked to order and wrapped while it's hot.
          </p>
        </div>
        <FryerCam open={status.open} />
      </div>

      <hr className="cm-rule" />
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
    </header>
  );
}

function Ticker() {
  const items = ALL_ITEMS.filter((i) => i.popular);
  const run = (hidden: boolean) =>
    items.map((item) => (
      <span key={`${hidden}-${item.id}`} className="cm-ticker__item" aria-hidden={hidden || undefined}>
        <Star size={11} className="cm-ticker__star" fill="currentColor" strokeWidth={0} />
        {displayName(item)} <b>{item.description && /for \$/.test(item.description) ? item.description : formatPrice(item.priceCents)}</b>
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
/*  Sticky section rail with a springy indicator blob                          */
/* -------------------------------------------------------------------------- */

function SectionRail({ onSearch }: { onSearch: () => void }) {
  const ids = useMemo(() => MENU.map((c) => c.id), []);
  const active = useScrollSpy(ids, 220);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLSpanElement>(null);
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const blob = blobRef.current;
    if (!scroller || !blob || !active) return;
    const link = scroller.querySelector<HTMLAnchorElement>(`[data-target="${active}"]`);
    if (!link) return;
    blob.style.setProperty("--x", `${link.offsetLeft}px`);
    blob.style.setProperty("--w", `${link.offsetWidth}px`);
    // keep the active link in view on narrow screens
    const left = link.offsetLeft - scroller.clientWidth / 2 + link.offsetWidth / 2;
    scroller.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <nav className="cm-rail" aria-label="Menu sections">
      <div className="cm-wrap cm-rail__inner">
        <div ref={scrollerRef} className="cm-rail__scroller">
          <span ref={blobRef} className="cm-rail__blob" aria-hidden="true" />
          {MENU.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              data-target={c.id}
              className="cm-rail__link"
              aria-current={active === c.id ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", `#${c.id}`);
              }}
            >
              <small>{c.folio}</small>
              {c.title.replace("Minimum Hot ", "")}
            </a>
          ))}
        </div>
        <button type="button" className="cm-rail__btn" onClick={onSearch} aria-label="Search the menu">
          <Search size={16} />
          <span>Search</span>
          <kbd>{isMac ? "⌘K" : "/"}</kbd>
        </button>
      </div>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*  Colophon (hours, address, fine print)                                      */
/* -------------------------------------------------------------------------- */

function Colophon() {
  const todayIdx = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    new Intl.DateTimeFormat("en-US", { timeZone: SHOP.timeZone, weekday: "short" }).format(new Date()),
  );
  const rows: [string, number[], string][] = [
    ["Monday", [1], "12:00pm – 7:30pm"],
    ["Tuesday – Friday", [2, 3, 4, 5], "10:30am – 7:30pm"],
    ["Saturday", [6], "10:30am – 7:00pm"],
    ["Sunday", [0], "Closed"],
  ];
  return (
    <footer className="cm-colophon cm-wrap">
      <div className="cm-colophon__grid">
        <div>
          <div className="cm-kicker">Trading hours</div>
          <h4>When the fryers are on</h4>
          <table className="cm-hours">
            <tbody>
              {rows.map(([label, days, hours]) => (
                <tr key={label} data-today={days.includes(todayIdx)}>
                  <td>{label}</td>
                  <td>{hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="cm-kicker">Where to find us</div>
          <h4>Shop 3, 153 Smith Rd</h4>
          <p className="cm-fineprint">
            Woodridge, QLD 4114. Pickup only — call ahead on{" "}
            <a href={SHOP.phoneHref} style={{ color: "var(--tomato)", fontWeight: 700, fontStyle: "normal" }}>
              {SHOP.phoneDisplay}
            </a>{" "}
            and we'll have it wrapped and ready when you arrive.
          </p>
        </div>
        <div>
          <div className="cm-kicker">The fine print</div>
          <h4>Corrections &amp; clarifications</h4>
          <p className="cm-fineprint">
            Prices are subject to change; please call to confirm current pricing. No newspapers were harmed in the making of
            this menu, though several potatoes were.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const Menu = () => {
  const order = useOrder();
  const [inspecting, setInspecting] = useState<IndexedItem | null>(null);
  const [parcelOpen, setParcelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Measure the site's own sticky nav so our rail docks exactly beneath it.
  useLayoutEffect(() => {
    const nav = document.querySelector<HTMLElement>("body > #root nav.sticky, nav.sticky");
    const root = rootRef.current;
    if (!nav || !root) return;
    const set = () => root.style.setProperty("--site-nav-h", `${nav.getBoundingClientRect().height}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  // Keyboard: ⌘K / Ctrl+K / "/" opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Deep links: /menu#snacks scrolls on load.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
  }, []);

  const celebrate = useCallback(() => setBump((b) => b + 1), []);

  const actions = useMemo<MenuActions>(
    () => ({
      quickAdd: (item, from) => {
        // Items with choices (e.g. battered vs grilled fish) open the dialog instead.
        if (item.options?.length) {
          setInspecting(item);
          return;
        }
        order.add(item.id);
        flyToParcel(from, item.image);
        window.setTimeout(celebrate, 700);
      },
      inspect: (item) => {
        setPreviewImage(null);
        setInspecting(item);
      },
      qtyOf: order.qtyOf,
      preview: setPreviewImage,
    }),
    [order, celebrate],
  );

  const addFromDialog = (item: IndexedItem, optionId: string | undefined, qty: number, from: HTMLElement) => {
    for (let i = 0; i < qty; i++) order.add(item.id, optionId);
    flyToParcel(from, item.image);
    window.setTimeout(celebrate, 700);
  };

  const pick = (item: IndexedItem) => {
    const section = document.getElementById(item.category.id);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => setInspecting(item), 450);
  };

  return (
    <MenuActionsContext.Provider value={actions}>
      <div ref={rootRef} className="cm">
        <Masthead />
        <Ticker />
        <SectionRail onSearch={() => setSearchOpen(true)} />

        <main className="cm-wrap">
          {MAIN_SECTIONS.map((category) => (
            <MenuSection key={category.id} category={category} />
          ))}
          <ClassifiedsSection categories={SIDE_SECTIONS} />
        </main>

        <Colophon />

        <button
          id="cm-parcel-button"
          type="button"
          className="cm-parcel-btn"
          data-empty={order.count === 0}
          data-bump={bump > 0 ? "true" : undefined}
          key={bump}
          onClick={() => setParcelOpen(true)}
          aria-label={`Open your parcel: ${order.count} items, ${formatPrice(order.totalCents)}`}
        >
          <span className="cm-parcel-btn__icon">
            <ShoppingBag size={18} />
            <span className="cm-parcel-btn__count">{order.count}</span>
          </span>
          <span>Your parcel</span>
          <span className="cm-mono">{formatPrice(order.totalCents)}</span>
        </button>

        <CursorPreview image={previewImage} />
      </div>

      <ItemDialog item={inspecting} onClose={() => setInspecting(null)} onAdd={addFromDialog} />
      <ParcelSheet order={order} open={parcelOpen} onOpenChange={setParcelOpen} />
      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} onPick={pick} />
    </MenuActionsContext.Provider>
  );
};

export default Menu;
