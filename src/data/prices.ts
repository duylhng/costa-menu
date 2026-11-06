/**
 * Live prices and menu settings (popular items, front-page favourites).
 *
 * What's written in menu.ts is the built-in default. Anything saved from /admin lives
 * in the Supabase `menu_prices` / `menu_settings` tables and overrides those defaults.
 *
 * How visitors get them, fastest first:
 *   1. The last live prices this browser saw are cached in localStorage and applied
 *      before the first render, so returning visitors never see a stale flash.
 *   2. Fresh prices are fetched straight from Supabase's REST endpoint (one small
 *      request, no Supabase library needed on public pages) and applied when they land.
 *   3. If Supabase is unreachable or not set up, the built-in prices are used.
 */
import { useSyncExternalStore } from "react";
import { ALL_ITEMS, DEFAULT_FRONT_PAGE, FRONT_PAGE_MAX, ITEM_INDEX, MENU, type IndexedItem } from "./menu";

export interface PriceRow {
  item_id: string;
  price_cents: number;
  updated_at?: string;
}

export type SettingKey = "popular" | "front_page";

export interface SettingRow {
  key: SettingKey;
  value: unknown;
}

const CACHE_KEY = "costa:live-menu:v2";
const FETCH_TIMEOUT_MS = 5000;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** The prices written in the code, captured before any overrides are applied. */
export const DEFAULT_PRICES: ReadonlyMap<string, number> = new Map(ALL_ITEMS.map((i) => [i.id, i.priceCents]));

/** The items marked `popular: true` in the code. */
export const DEFAULT_POPULAR: ReadonlySet<string> = new Set(ALL_ITEMS.filter((i) => i.popular).map((i) => i.id));

let frontPage: string[] = [...DEFAULT_FRONT_PAGE];

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

/** Keep only ids that exist on the menu, without duplicates. Returns null if the value isn't a list. */
export function cleanIdList(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  return [...new Set(value.filter((v): v is string => typeof v === "string" && ITEM_INDEX.has(v)))];
}

/** Apply popular / front-page settings. A missing row means "use the built-in default". */
export function applySettings(rows: SettingRow[]): boolean {
  const byKey = new Map(rows.map((r) => [r.key, r.value]));
  const popular = new Set(cleanIdList(byKey.get("popular")) ?? DEFAULT_POPULAR);
  const front = (cleanIdList(byKey.get("front_page")) ?? [...DEFAULT_FRONT_PAGE]).slice(0, FRONT_PAGE_MAX);

  let changed = false;
  for (const indexed of ALL_ITEMS) {
    const next = popular.has(indexed.id);
    if (Boolean(indexed.popular) !== next) {
      indexed.popular = next;
      changed = true;
    }
  }
  for (const category of MENU) for (const item of category.items) item.popular = popular.has(item.id);

  if (front.join() !== frontPage.join()) {
    frontPage = front;
    changed = true;
  }
  if (changed) emit();
  return changed;
}

/** The front page's "Readers' favourites", in order. */
export function frontPageItems(): IndexedItem[] {
  return frontPage.map((id) => ITEM_INDEX.get(id)!).filter(Boolean);
}

interface CachedMenu {
  prices: PriceRow[];
  settings: SettingRow[];
}

/** Apply live data cached from this browser's previous visit (synchronous, before first render). */
export function applyCachedPrices() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const cached = JSON.parse(raw) as CachedMenu;
    applyPrices(cached.prices ?? []);
    applySettings(cached.settings ?? []);
  } catch {
    /* ignore: private mode, corrupted cache, etc. */
  }
}

export function livePricesConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

async function fetchTable<T>(path: string, signal: AbortSignal): Promise<T[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_KEY!, Authorization: `Bearer ${SUPABASE_KEY}` },
      signal,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? (rows as T[]) : null;
  } catch {
    return null;
  }
}

/** Fetch current prices and settings from Supabase and apply them. Never throws. */
export async function loadLivePrices(): Promise<"live" | "unavailable"> {
  if (!livePricesConfigured()) return "unavailable";
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const [prices, settings] = await Promise.all([
    fetchTable<PriceRow>("menu_prices?select=item_id,price_cents,updated_at", controller.signal),
    fetchTable<SettingRow>("menu_settings?select=key,value", controller.signal),
  ]);
  window.clearTimeout(timer);

  // Each table is applied independently, so one failing never blocks the other.
  if (prices) applyPrices(prices);
  if (settings) applySettings(settings);
  if (!prices && !settings) return "unavailable";

  try {
    const previous = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}") as Partial<CachedMenu>;
    const next: CachedMenu = { prices: prices ?? previous.prices ?? [], settings: settings ?? previous.settings ?? [] };
    localStorage.setItem(CACHE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return "live";
}

/** Parse what someone typed into a price box ("8.5", "$8.50", "850c") into cents. */
export function parsePriceInput(text: string): number | null {
  const cleaned = text.trim().replace(/^\$/, "").replace(/,/g, "");
  if (/^\d+c$/i.test(cleaned)) return Number(cleaned.slice(0, -1));
  if (!/^\d{1,4}(\.\d{0,2})?$/.test(cleaned)) return null;
  const cents = Math.round(Number(cleaned) * 100);
  return cents >= 0 && cents <= 100000 ? cents : null;
}
