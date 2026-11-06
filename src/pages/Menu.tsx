import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { MENU, formatPrice, type IndexedItem } from "@/data/menu";
import { Masthead, PriceNotice, Ticker, useDocumentTitle } from "@/components/site/Broadsheet";
import { useOrder, useScrollSpy } from "@/components/site/hooks";
import { ClassifiedsSection, CursorPreview, MenuActionsContext, MenuSection, flyToParcel, type MenuActions } from "./menu/Items";
import { ItemDialog, ParcelSheet, SearchPalette } from "./menu/Overlays";

const MAIN_SECTIONS = MENU.filter((c) => c.layout !== "compact");
const SIDE_SECTIONS = MENU.filter((c) => c.layout === "compact");

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
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const Menu = () => {
  const order = useOrder();
  const [inspecting, setInspecting] = useState<IndexedItem | null>(null);
  const [parcelOpen, setParcelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  useDocumentTitle("Menu");

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
        flyToParcel(from, item.thumb);
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
    flyToParcel(from, item.thumb);
    window.setTimeout(celebrate, 700);
  };

  const pick = (item: IndexedItem) => {
    const section = document.getElementById(item.category.id);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => setInspecting(item), 450);
  };

  return (
    <MenuActionsContext.Provider value={actions}>
      <>
        <Masthead
          pre="Section B ·"
          main="The"
          accent="Menu"
          subtitle="Everything we fry, grill and wrap, from cod and scallops to burgers, rolls and dim sims."
        />
        <PriceNotice />
        <Ticker />
        <SectionRail onSearch={() => setSearchOpen(true)} />

        <div className="cm-wrap">
          {MAIN_SECTIONS.map((category) => (
            <MenuSection key={category.id} category={category} />
          ))}
          <ClassifiedsSection categories={SIDE_SECTIONS} />
        </div>

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
          <span className="cm-mono">≈ {formatPrice(order.totalCents)}</span>
        </button>

        <CursorPreview image={previewImage} />
      </>

      <ItemDialog item={inspecting} onClose={() => setInspecting(null)} onAdd={addFromDialog} />
      <ParcelSheet order={order} open={parcelOpen} onOpenChange={setParcelOpen} />
      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} onPick={pick} />
    </MenuActionsContext.Provider>
  );
};

export default Menu;
