/**
 * The single source of truth for Costa's menu.
 *
 * Prices are stored as integer cents so totals never suffer from floating-point
 * rounding (nobody wants to be charged $17.000000000000004 for a seafood basket).
 */

/*
 * Photos are pre-optimised WebP files: a ~900px "photo" for cards and dialogs, and a
 * 144px square "thumb" for the little round images. Vite resolves these at build time.
 */
const PHOTOS = import.meta.glob<string>("/src/assets/photos/*.webp", { eager: true, import: "default" });
const THUMBS = import.meta.glob<string>("/src/assets/thumbs/*.webp", { eager: true, import: "default" });

function pic(name: string): { image: string; thumb: string } {
  const image = PHOTOS[`/src/assets/photos/${name}.webp`];
  const thumb = THUMBS[`/src/assets/thumbs/${name}.webp`];
  if (!image || !thumb) throw new Error(`Missing menu photo: ${name}`);
  return { image, thumb };
}

export const HERO_PHOTO = PHOTOS["/src/assets/photos/hero-fish-chips.webp"];

export interface MenuOption {
  id: string;
  label: string;
  /** Extra cost in cents on top of the item price. */
  extraCents: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  popular?: boolean;
  image?: string;
  thumb?: string;
  /** Mutually exclusive preparation choices (e.g. battered / crumbed / grilled). */
  options?: MenuOption[];
}

export type CategoryLayout = "feature" | "gallery" | "ledger" | "compact";

export interface MenuCategory {
  id: string;
  title: string;
  /** Tiny newspaper-style "section kicker" shown above the headline. */
  kicker: string;
  /** Section number, broadsheet style. */
  folio: string;
  layout: CategoryLayout;
  items: MenuItem[];
}

const FISH_OPTIONS: MenuOption[] = [
  { id: "battered", label: "Battered", extraCents: 0 },
  { id: "crumbed", label: "Crumbed", extraCents: 0 },
  { id: "grilled", label: "Grilled", extraCents: 100 },
];

export const MENU: MenuCategory[] = [
  {
    id: "specials",
    title: "Specials",
    kicker: "Front page",
    folio: "A1",
    layout: "feature",
    items: [
      {
        id: "hamburger-deal",
        name: "Hamburger Deal (w/ Lot + $12.00)",
        description: "4 burgers, minimum chips, 1.25L drink",
        priceCents: 3900,
        popular: true,
        ...pic("hamburger-deal"),
      },
      {
        id: "fish-deal",
        name: "Fish Deal",
        description: "4 fish, minimum chips and 1.25L drink",
        priceCents: 3900,
        popular: true,
        ...pic("fish-chips-plate"),
      },
      {
        id: "seafood-basket",
        name: "Seafood Basket",
        description:
          "Chips, 4 calamaries, 3 fish cocktails, 3 seafood bites, 2 prawn cutlets, 1 seafood stick, tartare sauce and lemon",
        priceCents: 1700,
        popular: true,
        ...pic("prawns"),
      },
      {
        id: "special-for-two",
        name: "Special for Two",
        description: "2 cods, 3 potato scallops, 4 seafood bites, 6 calamari rings, minimum chips",
        priceCents: 3100,
        popular: true,
        ...pic("special-for-two"),
      },
      {
        id: "fisherman-basket",
        name: "Fisherman Basket",
        description:
          "Minimum chips, 2 cods, 10 fish cocktails, 10 calamari rings, 10 seafood bites, 8 prawn cutlets, 2 seafood sticks, 2 tartare sauce",
        priceCents: 6200,
        ...pic("fisherman-basket"),
      },
      {
        id: "special-basket",
        name: "Special Basket",
        description:
          "Minimum chips, 2 cods, 10 fish cocktails, 8 calamari rings, 5 seafood bites, 5 prawn cutlets, 2 seafood sticks, 2 tartare sauce",
        priceCents: 5100,
        ...pic("special-basket"),
      },
      {
        id: "fish-chips-salad",
        name: "Fish & Chips Salad Plate",
        description: "",
        priceCents: 1500,
        ...pic("fish-chips-salad"),
      },
    ],
  },
  {
    id: "fish",
    title: "Fish",
    kicker: "Crumbed / Battered",
    folio: "A2",
    layout: "gallery",
    items: [
      { id: "cod", name: "Cod", description: "Add grilled +$1", priceCents: 800, popular: true, ...pic("cod-fish"), options: FISH_OPTIONS },
      { id: "hoki", name: "Hoki", description: "Add grilled +$1", priceCents: 800, ...pic("hoki-fish"), options: FISH_OPTIONS },
      { id: "snapper", name: "Snapper", description: "Add grilled +$1", priceCents: 1050, ...pic("snapper-fish"), options: FISH_OPTIONS },
      { id: "barramundi", name: "Barramundi", description: "Add grilled +$1", priceCents: 1050, ...pic("barramundi-fish"), options: FISH_OPTIONS },
    ],
  },
  {
    id: "snack-deals",
    title: "Snack Deals",
    kicker: "By the handful",
    folio: "B1",
    layout: "ledger",
    items: [
      { id: "chicken-nuggets", name: "Chicken Nuggets", description: "5 for $3.80", priceCents: 380, ...pic("chicken-nuggets") },
      { id: "chicken-chips", name: "Chicken Chips", description: "5 for $3.50", priceCents: 350, ...pic("chicken-chips") },
      { id: "spicy-chicken-wings", name: "Spicy Chicken Wings", description: "5 for $9.50 and $2.00 each", priceCents: 950, ...pic("spicy-chicken-wings") },
      { id: "chicken-garlic-balls", name: "Chicken Garlic Balls", description: "$1.70 each", priceCents: 170, ...pic("chicken-garlic-balls") },
      { id: "fish-cocktails", name: "Fish Cocktails", description: "5 for $6.80", priceCents: 680, popular: true, ...pic("fish-cocktails") },
      { id: "prawn-cutlets", name: "Prawn Cutlets", description: "5 for $8.00", priceCents: 800, ...pic("prawn-cutlets") },
      { id: "potato-scallops", name: "Potato Scallops", description: "6 for $8.50 and $2.00 each", priceCents: 850, popular: true, ...pic("potato-scallops") },
      { id: "calamari-rings", name: "Calamari Rings", description: "8 for $7.00", priceCents: 700, popular: true, ...pic("calamari-rings") },
      { id: "seafood-bites", name: "Seafood Bites", description: "5 for $4.70", priceCents: 470, ...pic("seafood-bites") },
      { id: "onion-rings", name: "Onion Rings", description: "4 for $2.50", priceCents: 250, ...pic("onion-rings") },
      { id: "battered-mussels", name: "Battered Mussels", description: "4 for $3.50", priceCents: 350, ...pic("battered-mussels") },
    ],
  },
  {
    id: "burgers",
    title: "Burgers & Sandwiches",
    kicker: "Between the buns",
    folio: "B2",
    layout: "gallery",
    items: [
      { id: "hamburger", name: "Hamburger", description: "", priceCents: 800, popular: true, ...pic("hamburger") },
      { id: "hamburger-lot", name: "Hamburger w/ Lot", description: "", priceCents: 1050, popular: true, ...pic("hamburger-lot") },
      { id: "steak-burger", name: "Steak Burger", description: "", priceCents: 850, popular: true, ...pic("steak-burger") },
      { id: "steak-burger-lot", name: "Steak Burger w/ Lot", description: "", priceCents: 1150, popular: true, ...pic("steak-burger-lot") },
      { id: "bacon-egg-burger", name: "Bacon & Egg Burger", description: "", priceCents: 800, ...pic("bacon-egg-burger") },
      { id: "chicken-burger", name: "Chicken Burger", description: "", priceCents: 850, ...pic("chicken-burger") },
      { id: "fish-burger", name: "Fish Burger", description: "", priceCents: 950, ...pic("fish-burger") },
      { id: "chicken-salad-sandwich", name: "Chicken Salad Sandwich", description: "", priceCents: 700, ...pic("chicken-salad-sandwich") },
    ],
  },
  {
    id: "hot-rolls",
    title: "Hot Rolls",
    kicker: "Rolled & loaded",
    folio: "C1",
    layout: "ledger",
    items: [
      { id: "chicken-gravy-roll", name: "Chicken Gravy", description: "", priceCents: 700, ...pic("chicken-gravy-roll") },
      { id: "chicken-mayo-roll", name: "Chicken Mayo", description: "", priceCents: 700, ...pic("chicken-mayo-roll") },
      { id: "steak-gravy-roll", name: "Steak Gravy", description: "", priceCents: 850, ...pic("steak-gravy-roll") },
      { id: "hot-dog", name: "Hot Dog", description: "", priceCents: 500, ...pic("hot-dog") },
      { id: "hot-dog-cheese", name: "Hot Dog & Cheese", description: "", priceCents: 550, ...pic("hot-dog-cheese") },
      { id: "hot-dog-lot", name: "Hot Dog w/ Lot", description: "", priceCents: 700, ...pic("hot-dog-lot") },
      { id: "kabana-dog", name: "Kabana Dog", description: "", priceCents: 700, ...pic("kabana-dog") },
      { id: "kabana-dog-lot", name: "Kabana Dog w/ Lot", description: "", priceCents: 950, ...pic("kabana-dog-lot") },
    ],
  },
  {
    id: "snacks",
    title: "Snacks",
    kicker: "One of everything",
    folio: "C2",
    layout: "ledger",
    items: [
      { id: "kabana", name: "Kabana", description: "", priceCents: 400, ...pic("kabana") },
      { id: "chiko-roll", name: "Chiko Roll", description: "", priceCents: 380, ...pic("chiko-roll") },
      { id: "spring-roll", name: "Spring Roll", description: "", priceCents: 380, ...pic("spring-roll") },
      { id: "crumbed-sausage", name: "Crumbed Sausage", description: "", priceCents: 350, ...pic("crumbed-sausage") },
      { id: "battered-sav", name: "Battered Sav", description: "", priceCents: 400, ...pic("battered-sav") },
      { id: "fish-cake", name: "Fish Cake", description: "", priceCents: 300, ...pic("fish-cake") },
      { id: "chicken-cheese-schnitzel", name: "Chicken & Cheese Schnitzel", description: "", priceCents: 380, ...pic("chicken-cheese-schnitzel") },
      { id: "mini-dim-sim", name: "Mini Dim Sim", description: "", priceCents: 150, ...pic("mini-dim-sim") },
      { id: "chicken-dim-sim", name: "Chicken Dim Sim", description: "", priceCents: 350, ...pic("chicken-dim-sim") },
      { id: "corn-jack", name: "Corn Jack", description: "", priceCents: 400, ...pic("corn-jack") },
      { id: "seafood-stick", name: "Seafood Stick", description: "", priceCents: 150, ...pic("seafood-stick") },
      { id: "pineapple-fritter", name: "Pineapple Fritter", description: "", priceCents: 180, ...pic("pineapple-fritter") },
      { id: "pork-sausage", name: "Pork Sausage", description: "", priceCents: 450, ...pic("pork-sausage") },
      { id: "ham-cheese-scallop", name: "Ham & Cheese Potato Scallop", description: "", priceCents: 450, ...pic("ham-cheese-scallop") },
      { id: "lasagna-topper", name: "Lasagna Topper", description: "", priceCents: 450 },
    ],
  },
  {
    id: "chips",
    title: "Minimum Hot Chips",
    kicker: "The main event",
    folio: "D1",
    layout: "compact",
    items: [{ id: "chips", name: "Chips", description: "", priceCents: 400, popular: true }],
  },
  {
    id: "gravy",
    title: "Gravy",
    kicker: "Pour decisions",
    folio: "D2",
    layout: "compact",
    items: [
      { id: "gravy-small", name: "Small", description: "", priceCents: 150 },
      { id: "gravy-medium", name: "Medium", description: "", priceCents: 250 },
      { id: "gravy-large", name: "Large", description: "", priceCents: 350 },
    ],
  },
  {
    id: "fried-rice",
    title: "Fried Rice",
    kicker: "Wok this way",
    folio: "D3",
    layout: "compact",
    items: [
      { id: "fried-rice-ham", name: "Ham", description: "", priceCents: 900 },
      { id: "fried-rice-chicken", name: "Chicken", description: "", priceCents: 900 },
    ],
  },
];

export interface IndexedItem extends MenuItem {
  category: MenuCategory;
}

/** Flat lookup of every item, keyed by id, with a back-reference to its category. */
export const ITEM_INDEX: Map<string, IndexedItem> = new Map(
  MENU.flatMap((category) => category.items.map((item) => [item.id, { ...item, category }] as const)),
);

export const ALL_ITEMS: IndexedItem[] = Array.from(ITEM_INDEX.values());

/**
 * Built-in "Readers' favourites" for the front page, in order (max 6). Can be
 * changed from /admin; this list is used until then, or if Supabase is unreachable.
 */
export const DEFAULT_FRONT_PAGE: readonly string[] = [
  "seafood-basket",
  "cod",
  "calamari-rings",
  "potato-scallops",
  "steak-burger-lot",
  "special-for-two",
];
export const FRONT_PAGE_MAX = 6;

/** Full display name, e.g. "Small" in Gravy becomes "Small Gravy". */
export function displayName(item: IndexedItem): string {
  if (item.category.id === "gravy") return `${item.name} Gravy`;
  if (item.category.id === "fried-rice") return `${item.name} Fried Rice`;
  if (item.category.id === "hot-rolls" && !/dog/i.test(item.name)) return `${item.name} Roll`;
  return item.name;
}

const AUD = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });

export function formatPrice(cents: number): string {
  return AUD.format(cents / 100);
}

export const SHOP = {
  phoneDisplay: "0405 353 467",
  phoneHref: "tel:0405353467",
  address: "Shop 3, 153 Smith Rd, Woodridge QLD 4114",
  timeZone: "Australia/Brisbane",
  /** Opening hours by JS weekday (0 = Sunday), in minutes after midnight. */
  hours: {
    0: null,
    1: [12 * 60, 19 * 60 + 30],
    2: [10 * 60 + 30, 19 * 60 + 30],
    3: [10 * 60 + 30, 19 * 60 + 30],
    4: [10 * 60 + 30, 19 * 60 + 30],
    5: [10 * 60 + 30, 19 * 60 + 30],
    6: [10 * 60 + 30, 19 * 60],
  } as Record<number, [number, number] | null>,
};
