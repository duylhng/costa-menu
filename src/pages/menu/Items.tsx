import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { Plus, Star, UtensilsCrossed } from "lucide-react";
import { formatPrice, type IndexedItem, type MenuCategory } from "@/data/menu";
import { useReveal, useTilt } from "@/components/site/hooks";

/* -------------------------------------------------------------------------- */
/*  Page-wide context so every item can add to the parcel / open the sheet     */
/* -------------------------------------------------------------------------- */

export interface MenuActions {
  quickAdd: (item: IndexedItem, from: HTMLElement) => void;
  inspect: (item: IndexedItem) => void;
  qtyOf: (itemId: string) => number;
  preview: (image: string | null) => void;
}

export const MenuActionsContext = createContext<MenuActions | null>(null);

function useActions() {
  const ctx = useContext(MenuActionsContext);
  if (!ctx) throw new Error("MenuActionsContext missing");
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Fly-to-parcel: a little photo arcs from the button into the parcel         */
/* -------------------------------------------------------------------------- */

export function flyToParcel(from: HTMLElement, image?: string) {
  const target = document.getElementById("cm-parcel-button");
  if (!target) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  // If the parcel button is still hidden (first item), aim for where it will land.
  const bx = b.left + 30;
  const by = Math.min(b.top + 28, window.innerHeight - 50);

  const el = document.createElement(image ? "img" : "div");
  el.className = "cm-fly";
  if (image && el instanceof HTMLImageElement) el.src = image;
  document.body.appendChild(el);

  const x0 = a.left + a.width / 2 - 22;
  const y0 = a.top + a.height / 2 - 22;
  const x1 = bx - 22;
  const y1 = by - 22;
  // Quadratic bezier sampled into keyframes for a nice arc.
  const cx = (x0 + x1) / 2;
  const cy = Math.min(y0, y1) - 180;
  const frames: Keyframe[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t ** 2 * x1;
    const y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t ** 2 * y1;
    const s = 1 - t * 0.55;
    frames.push({ transform: `translate(${x}px, ${y}px) scale(${s}) rotate(${t * 540}deg)`, opacity: t > 0.92 ? 0 : 1 });
  }
  const anim = el.animate(frames, { duration: 750, easing: "cubic-bezier(.5,0,.75,0)" });
  anim.onfinish = () => el.remove();
}

/* -------------------------------------------------------------------------- */
/*  Add button                                                                 */
/* -------------------------------------------------------------------------- */

function AddButton({ item, label }: { item: IndexedItem; label?: string }) {
  const { quickAdd, qtyOf } = useActions();
  const qty = qtyOf(item.id);
  return (
    <button
      type="button"
      className="cm-add"
      data-qty={qty > 0 ? qty : undefined}
      aria-label={label ?? `Add ${item.name} to your parcel`}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        quickAdd(item, e.currentTarget);
      }}
    >
      <Plus size={18} strokeWidth={2.5} />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card variants                                                              */
/* -------------------------------------------------------------------------- */

function FeatureCard({ item, lead, wide, index }: { item: IndexedItem; lead: boolean; wide: boolean; index: number }) {
  const { inspect } = useActions();
  const ref = useTilt<HTMLDivElement>(lead ? 4 : 7);
  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className={`cm-feature cm-tilt ${lead ? "cm-feature--lead" : ""} ${wide ? "cm-feature--wide" : ""}`}
      style={{ "--i": index } as CSSProperties}
      onClick={() => inspect(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inspect(item);
        }
      }}
    >
      <span className="cm-tilt__glare" />
      {item.popular && (
        <span className="cm-stamp" aria-label="Local favourite">
          <span>
            <Star fill="currentColor" strokeWidth={0} />
            Local
            <br />
            fave
          </span>
        </span>
      )}
      {item.image && (
        <div className="cm-feature__media cm-halftone">
          <img src={item.image} alt={item.name} loading={index < 3 ? "eager" : "lazy"} decoding="async" />
        </div>
      )}
      <div className="cm-feature__body">
        <span className="cm-kicker">No. {String(index + 1).padStart(2, "0")} · {item.category.title}</span>
        <h3 className="cm-feature__name">{item.name}</h3>
        {item.description && <p className="cm-feature__desc">{item.description}</p>}
        <div className="cm-feature__foot">
          <span className="cm-price cm-feature__price">{formatPrice(item.priceCents)}</span>
          <AddButton item={item} />
        </div>
      </div>
    </div>
  );
}

function GalleryCard({ item, index }: { item: IndexedItem; index: number }) {
  const { inspect } = useActions();
  const ref = useTilt<HTMLDivElement>(8);
  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className="cm-card cm-tilt"
      style={{ "--i": index } as CSSProperties}
      onClick={() => inspect(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inspect(item);
        }
      }}
    >
      <span className="cm-tilt__glare" />
      {item.image && (
        <div className="cm-card__media cm-halftone">
          <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
          {item.popular && (
            <span className="cm-chip">
              <Star size={10} fill="currentColor" strokeWidth={0} /> Popular
            </span>
          )}
        </div>
      )}
      <div className="cm-card__body">
        <div>
          <h3 className="cm-card__name">{item.name}</h3>
          <span className="cm-price cm-card__price">{formatPrice(item.priceCents)}</span>
          {item.options && (
            <div className="cm-card__opts">
              {item.options.map((o) => (
                <span key={o.id} className="cm-chip cm-chip--ghost">
                  {o.label}
                  {o.extraCents ? ` +${formatPrice(o.extraCents).replace(".00", "")}` : ""}
                </span>
              ))}
            </div>
          )}
        </div>
        <AddButton item={item} />
      </div>
    </div>
  );
}

function LedgerRow({ item, index, showThumb = true }: { item: IndexedItem; index: number; showThumb?: boolean }) {
  const { inspect, preview } = useActions();
  return (
    <div
      role="button"
      tabIndex={0}
      className="cm-row"
      style={{ "--i": index } as CSSProperties}
      onClick={() => inspect(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inspect(item);
        }
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && preview(item.image ?? null)}
      onPointerLeave={() => preview(null)}
    >
      {showThumb &&
        (item.image ? (
          <img className="cm-row__thumb" src={item.thumb} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="cm-row__thumb cm-row__thumb--empty">
            <UtensilsCrossed size={18} />
          </span>
        ))}
      <div style={{ minWidth: 0 }}>
        <div className="cm-row__line">
          <span className="cm-row__name">
            {item.name}
            {item.popular && (
              <Star
                size={12}
                fill="var(--tomato)"
                strokeWidth={0}
                style={{ display: "inline", marginLeft: 6, verticalAlign: "1px" }}
                aria-label="Popular"
              />
            )}
          </span>
          <span className="cm-row__dots" aria-hidden="true" />
          <span className="cm-price cm-row__price">{formatPrice(item.priceCents)}</span>
        </div>
        {item.description && <div className="cm-row__desc">{item.description}</div>}
      </div>
      <AddButton item={item} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */

export function MenuSection({ category }: { category: MenuCategory }) {
  const reveal = useReveal<HTMLDivElement>();
  const items = category.items.map((item) => ({ ...item, category }));
  const prices = items.map((i) => i.priceCents);
  const range =
    Math.min(...prices) === Math.max(...prices)
      ? formatPrice(prices[0])
      : `${formatPrice(Math.min(...prices))} – ${formatPrice(Math.max(...prices))}`;

  let body: JSX.Element;
  switch (category.layout) {
    case "feature":
      body = (
        <div ref={reveal} className="cm-feature-grid cm-reveal">
          {items.map((item, i) => (
            <FeatureCard
              key={item.id}
              item={item}
              lead={i === 0}
              // After the 2×2 lead + 4 cards, any leftovers become wide cards so the row stays full.
              wide={i >= 5 && (items.length - 5) % 2 === 0}
              index={i}
            />
          ))}
        </div>
      );
      break;
    case "gallery":
      body = (
        <div ref={reveal} className="cm-gallery cm-reveal">
          {items.map((item, i) => (
            <GalleryCard key={item.id} item={item} index={i} />
          ))}
        </div>
      );
      break;
    default:
      body = (
        <div ref={reveal} className="cm-ledger cm-reveal">
          {items.map((item, i) => (
            <LedgerRow key={item.id} item={item} index={i} />
          ))}
        </div>
      );
  }

  return (
    <section id={category.id} className="cm-section" aria-labelledby={`${category.id}-title`}>
      <header className="cm-section__head">
        <span className="cm-section__folio" aria-hidden="true">
          {category.folio}
        </span>
        <div>
          <div className="cm-kicker">{category.kicker}</div>
          <h2 id={`${category.id}-title`} className="cm-section__title">
            {category.title}
          </h2>
        </div>
        <div className="cm-section__count">
          {items.length} {items.length === 1 ? "item" : "items"}
          <br />
          {range}
        </div>
      </header>
      {body}
    </section>
  );
}

/** The small sides (chips, gravy, fried rice) share one "classifieds" box. */
export function ClassifiedsSection({ categories }: { categories: MenuCategory[] }) {
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section className="cm-section" aria-label="Sides">
      <header className="cm-section__head">
        <span className="cm-section__folio" aria-hidden="true">
          D
        </span>
        <div>
          <div className="cm-kicker">Classifieds</div>
          <h2 className="cm-section__title">On the side</h2>
        </div>
        <div className="cm-section__count">
          Chips · Gravy
          <br />
          Fried rice
        </div>
      </header>
      <div ref={reveal} className="cm-classifieds cm-reveal">
        {categories.map((category, ci) => (
          <div key={category.id} id={category.id} className="cm-classified" style={{ "--i": ci } as CSSProperties}>
            <div className="cm-kicker">
              {category.folio} · {category.kicker}
            </div>
            <h3>{category.title}</h3>
            {category.items.map((item, i) => (
              <LedgerRow key={item.id} item={{ ...item, category }} index={i} showThumb={false} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cursor preview — one floating photo that chases the pointer (lerped)       */
/* -------------------------------------------------------------------------- */

export function CursorPreview({ image }: { image: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    if (image) setShown(image);
  }, [image]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let vx = 0;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX + 28;
      ty = e.clientY - 80;
      // keep inside the viewport
      if (tx + 240 > window.innerWidth) tx = e.clientX - 248;
      if (ty < 8) ty = 8;
      if (!frame) frame = requestAnimationFrame(loop);
    };
    const loop = () => {
      frame = 0;
      const k = reduced ? 1 : 0.18;
      const nx = x + (tx - x) * k;
      vx = nx - x;
      x = nx;
      y += (ty - y) * k;
      const tilt = Math.max(-14, Math.min(14, vx * 0.8));
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg)`;
      if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) frame = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="cm-cursor" data-visible={Boolean(image)} aria-hidden="true">
      {shown && <img src={shown} alt="" />}
    </div>
  );
}
