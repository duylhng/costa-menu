import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ITEM_INDEX, SHOP } from "@/data/menu";
import { usePriceVersion } from "@/data/prices";

/* -------------------------------------------------------------------------- */
/*  Reduced motion                                                             */
/* -------------------------------------------------------------------------- */

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* -------------------------------------------------------------------------- */
/*  Order ("the parcel")                                                       */
/* -------------------------------------------------------------------------- */

export interface OrderLine {
  /** itemId + optional option id, e.g. "cod:grilled". */
  key: string;
  itemId: string;
  optionId?: string;
  qty: number;
}

type OrderAction =
  | { type: "add"; itemId: string; optionId?: string; qty?: number }
  | { type: "set"; key: string; qty: number }
  | { type: "clear" };

const STORAGE_KEY = "costa:parcel:v1";

function lineKey(itemId: string, optionId?: string) {
  return optionId ? `${itemId}:${optionId}` : itemId;
}

function orderReducer(state: OrderLine[], action: OrderAction): OrderLine[] {
  switch (action.type) {
    case "add": {
      const key = lineKey(action.itemId, action.optionId);
      const qty = action.qty ?? 1;
      const existing = state.find((l) => l.key === key);
      if (existing) return state.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      return [...state, { key, itemId: action.itemId, optionId: action.optionId, qty }];
    }
    case "set":
      if (action.qty <= 0) return state.filter((l) => l.key !== action.key);
      return state.map((l) => (l.key === action.key ? { ...l, qty: Math.min(99, action.qty) } : l));
    case "clear":
      return [];
  }
}

function loadOrder(): OrderLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OrderLine[];
    // Drop anything that no longer exists on the menu (e.g. after a menu edit).
    return parsed.filter((l) => ITEM_INDEX.has(l.itemId) && l.qty > 0);
  } catch {
    return [];
  }
}

export function useOrder() {
  const [lines, dispatch] = useReducer(orderReducer, undefined, loadOrder);
  const priceVersion = usePriceVersion();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* private mode etc. – the parcel just won't survive a reload */
    }
  }, [lines]);

  const detailed = useMemo(
    () =>
      lines.map((line) => {
        const item = ITEM_INDEX.get(line.itemId)!;
        const option = item.options?.find((o) => o.id === line.optionId);
        const unitCents = item.priceCents + (option?.extraCents ?? 0);
        return { ...line, item, option, unitCents, totalCents: unitCents * line.qty };
      }),
    // Recalculate when live prices arrive, not just when the order changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lines, priceVersion],
  );

  const totalCents = detailed.reduce((sum, l) => sum + l.totalCents, 0);
  const count = detailed.reduce((sum, l) => sum + l.qty, 0);

  const add = useCallback((itemId: string, optionId?: string) => dispatch({ type: "add", itemId, optionId }), []);
  const setQty = useCallback((key: string, qty: number) => dispatch({ type: "set", key, qty }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const qtyOf = useCallback(
    (itemId: string) => lines.filter((l) => l.itemId === itemId).reduce((s, l) => s + l.qty, 0),
    [lines],
  );

  return { lines: detailed, totalCents, count, add, setQty, clear, qtyOf };
}

export type Order = ReturnType<typeof useOrder>;

/* -------------------------------------------------------------------------- */
/*  Live "are the fryers on?" status, computed in Brisbane time                */
/* -------------------------------------------------------------------------- */

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function brisbaneNow(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SHOP.timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { weekday, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

function clock(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

function duration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export interface OpenStatus {
  open: boolean;
  headline: string;
  detail: string;
  /** 0..1 progress through today's trading hours, or null when closed. */
  progress: number | null;
}

export function computeOpenStatus(date: Date): OpenStatus {
  const { weekday, minutes } = brisbaneNow(date);
  const today = SHOP.hours[weekday];

  if (today && minutes >= today[0] && minutes < today[1]) {
    const left = today[1] - minutes;
    return {
      open: true,
      headline: "Fryers are on",
      detail: left <= 30 ? `Last call! Closing in ${duration(left)}` : `Open until ${clock(today[1])} · ${duration(left)} left`,
      progress: (minutes - today[0]) / (today[1] - today[0]),
    };
  }

  if (today && minutes < today[0]) {
    return {
      open: false,
      headline: "Oil's heating up",
      detail: `Opens today at ${clock(today[0])} · in ${duration(today[0] - minutes)}`,
      progress: null,
    };
  }

  for (let i = 1; i <= 7; i++) {
    const d = (weekday + i) % 7;
    const hours = SHOP.hours[d];
    if (hours) {
      return {
        open: false,
        headline: "Fryers are off",
        detail: `Back ${i === 1 ? "tomorrow" : DAY_NAMES[d]} at ${clock(hours[0])}`,
        progress: null,
      };
    }
  }
  return { open: false, headline: "Fryers are off", detail: "", progress: null };
}

export function useOpenStatus(): OpenStatus {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return useMemo(() => computeOpenStatus(now), [now]);
}

/* -------------------------------------------------------------------------- */
/*  Scroll spy                                                                 */
/* -------------------------------------------------------------------------- */

export function useScrollSpy(ids: string[], offset = 160): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      let current: string | null = ids[0] ?? null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      // At the very bottom of the page, the last section wins.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = ids[ids.length - 1] ?? current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return active;
}

/* -------------------------------------------------------------------------- */
/*  Pointer tilt + glare (writes CSS variables, never re-renders React)        */
/* -------------------------------------------------------------------------- */

export function useTilt<T extends HTMLElement>(maxDeg = 7) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let frame = 0;
    let px = 0.5;
    let py = 0.5;

    const apply = () => {
      frame = 0;
      el.style.setProperty("--rx", `${(0.5 - py) * maxDeg}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * maxDeg}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width;
      py = (e.clientY - r.top) / r.height;
      el.dataset.tilting = "true";
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      px = 0.5;
      py = 0.5;
      delete el.dataset.tilting;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [maxDeg, reduced]);

  return ref;
}

/* -------------------------------------------------------------------------- */
/*  Reveal-on-scroll                                                           */
/* -------------------------------------------------------------------------- */

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.revealed = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
