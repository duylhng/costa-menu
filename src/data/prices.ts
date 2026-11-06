/**
 * Live prices.
 *
 * The prices written in menu.ts are the built-in defaults. Prices saved from /admin
 * live in the Supabase `menu_prices` table and override those defaults.
 *
 * How visitors get them, fastest first:
 *   1. The last live prices this browser saw are cached in localStorage and applied
 *      before the first render, so returning visitors never see a stale flash.
 *   2. Fresh prices are fetched straight from Supabase's REST endpoint (one small
 *      request, no Supabase library needed on public pages) and applied when they land.
 *   3. If Supabase is unreachable or not set up, the built-in prices are used.
 */
import { useSyncExternalStore } from "react";
import { ALL_ITEMS, MENU } from "./menu";

export interface PriceRow {
  item_id: string;
  price_cents: number;
  updated_at?: string;
}

const CACHE_KEY = "costa:live-prices:v1";
const FETCH_TIMEOUT_MS = 5000;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** The prices written in the code, captured before any overrides are applied. */
export const DEFAULT_PRICES: ReadonlyMap<string, number> = new Map(ALL_ITEMS.map((i) => [i.id, i.priceCents]));

/* -------------------------------------------------------------------------- */
/*  A tiny external store so React re-renders when prices change               */
/* -------------------------------------------------------------------------- */

let version = 0;
let lastUpdated: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  version++;
  listeners.forEach((l) => l());
}

export function usePriceVersion(): number {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => version,
  );
}

/** When the most recent live price change was made, if known. */
export function pricesLastUpdated(): string | null {
  return lastUpdated;
}

/* -------------------------------------------------------------------------- */
/*  Applying overrides                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Apply a full set of overrides (items without a row go back to their default).
 * The menu objects are updated in place so every component, the order total and the
 * search all see the same price. Returns true if anything changed.
 */
export function applyPrices(rows: PriceRow[]): boolean {
  const overrides = new Map(
    rows
      .filter((r) => DEFAULT_PRICES.has(r.item_id) && Number.isInteger(r.price_cents) && r.price_cents >= 0)
      .map((r) => [r.item_id, r.price_cents]),
  );

  let changed = false;
  for (const indexed of ALL_ITEMS) {
    const next = overrides.get(indexed.id) ?? DEFAULT_PRICES.get(indexed.id)!;
    if (indexed.priceCents !== next) {
      indexed.priceCents = next;
      changed = true;
    }
  }
  // MENU holds the original item objects (ALL_ITEMS holds copies), so keep them in step.
  for (const category of MENU) {
    for (const item of category.items) {
      const next = overrides.get(item.id) ?? DEFAULT_PRICES.get(item.id)!;
      if (item.priceCents !== next) item.priceCents = next;
    }
  }

  lastUpdated = rows.reduce<string | null>((max, r) => (r.updated_at && (!max || r.updated_at > max) ? r.updated_at : max), null);
  if (changed) emit();
  return changed;
}

/** Apply prices cached from this browser's previous visit (synchronous, before first render). */
export function applyCachedPrices() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) applyPrices(JSON.parse(raw) as PriceRow[]);
  } catch {
    /* ignore: private mode, corrupted cache, etc. */
  }
}

export function livePricesConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

/** Fetch the current overrides from Supabase and apply them. Never throws. */
export async function loadLivePrices(): Promise<"live" | "unavailable"> {
  if (!livePricesConfigured()) return "unavailable";
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/menu_prices?select=item_id,price_cents,updated_at`, {
      headers: { apikey: SUPABASE_KEY!, Authorization: `Bearer ${SUPABASE_KEY}` },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) return "unavailable";
    const rows = (await res.json()) as PriceRow[];
    if (!Array.isArray(rows)) return "unavailable";
    applyPrices(rows);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(rows));
    } catch {
      /* ignore */
    }
    return "live";
  } catch {
    return "unavailable";
  } finally {
    window.clearTimeout(timer);
  }
}

/** Parse what someone typed into a price box ("8.5", "$8.50", "850c") into cents. */
export function parsePriceInput(text: string): number | null {
  const cleaned = text.trim().replace(/^\$/, "").replace(/,/g, "");
  if (/^\d+c$/i.test(cleaned)) return Number(cleaned.slice(0, -1));
  if (!/^\d{1,4}(\.\d{0,2})?$/.test(cleaned)) return null;
  const cents = Math.round(Number(cleaned) * 100);
  return cents >= 0 && cents <= 100000 ? cents : null;
}
