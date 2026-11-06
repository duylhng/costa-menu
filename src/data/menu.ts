/**
 * The single source of truth for Costa's menu.
 *
 * Prices are stored as integer cents so totals never suffer from floating-point
 * rounding (nobody wants to be charged $17.000000000000004 for a seafood basket).
 */
import fishChipsPlate from "@/assets/fish-chips-plate.jpg";
import prawnsImg from "@/assets/prawns.jpg";
import hamburgerDealImg from "@/assets/hamburger-deal.jpg";
import specialForTwoImg from "@/assets/special-for-two.jpg";
import fishermanBasketImg from "@/assets/fisherman-basket.jpg";
import specialBasketImg from "@/assets/special-basket.jpg";
import fishChipsSaladImg from "@/assets/fish-chips-salad.jpg";
import codFishImg from "@/assets/cod-fish.jpg";
import hokiFishImg from "@/assets/hoki-fish.jpg";
import snapperFishImg from "@/assets/snapper-fish.jpg";
import barramundiFishImg from "@/assets/barramundi-fish.jpg";
import hamburgerImg from "@/assets/hamburger.jpg";
import hamburgerLotImg from "@/assets/hamburger-lot.jpg";
import steakBurgerImg from "@/assets/steak-burger.jpg";
import steakBurgerLotImg from "@/assets/steak-burger-lot.jpg";
import baconEggBurgerImg from "@/assets/bacon-egg-burger.jpg";
import chickenBurgerImg from "@/assets/chicken-burger.jpg";
import fishBurgerImg from "@/assets/fish-burger.jpg";
import chickenSaladSandwichImg from "@/assets/chicken-salad-sandwich.jpg";
import chickenGravyRollImg from "@/assets/chicken-gravy-roll.jpg";
import chickenMayoRollImg from "@/assets/chicken-mayo-roll.jpg";
import steakGravyRollImg from "@/assets/steak-gravy-roll.jpg";
import hotDogImg from "@/assets/hot-dog.jpg";
import hotDogCheeseImg from "@/assets/hot-dog-cheese.jpg";
import hotDogLotImg from "@/assets/hot-dog-lot.jpg";
import kabanaDogImg from "@/assets/kabana-dog.jpg";
import kabanaDogLotImg from "@/assets/kabana-dog-lot.jpg";
import chickenNuggetsImg from "@/assets/chicken-nuggets.jpg";
import chickenChipsImg from "@/assets/chicken-chips.jpg";
import spicyChickenWingsImg from "@/assets/spicy-chicken-wings.jpg";
import chickenGarlicBallsImg from "@/assets/chicken-garlic-balls.jpg";
import fishCocktailsImg from "@/assets/fish-cocktails.jpg";
import prawnCutletsImg from "@/assets/prawn-cutlets.jpg";
import potatoScallopsImg from "@/assets/potato-scallops.jpg";
import calamariRingsImg from "@/assets/calamari-rings.jpg";
import seafoodBitesImg from "@/assets/seafood-bites.jpg";
import onionRingsImg from "@/assets/onion-rings.jpg";
import batteredMusselsImg from "@/assets/battered-mussels.jpg";
import kabanaImg from "@/assets/kabana.jpg";
import chikoRollImg from "@/assets/chiko-roll.jpg";
import springRollImg from "@/assets/spring-roll.jpg";
import crumbedSausageImg from "@/assets/crumbed-sausage.jpg";
import batteredSavImg from "@/assets/battered-sav.jpg";
import fishCakeImg from "@/assets/fish-cake.jpg";
import chickenCheeseSchnitzelImg from "@/assets/chicken-cheese-schnitzel.jpg";
import miniDimSimImg from "@/assets/mini-dim-sim.jpg";
import chickenDimSimImg from "@/assets/chicken-dim-sim.jpg";
import cornJackImg from "@/assets/corn-jack.jpg";
import seafoodStickImg from "@/assets/seafood-stick.jpg";
import pineappleFritterImg from "@/assets/pineapple-fritter.jpg";
import porkSausageImg from "@/assets/pork-sausage.jpg";
import hamCheeseScallopImg from "@/assets/ham-cheese-scallop.jpg";

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
        image: hamburgerDealImg,
      },
      {
        id: "fish-deal",
        name: "Fish Deal",
        description: "4 fish, minimum chips and 1.25L drink",
        priceCents: 3900,
        popular: true,
        image: fishChipsPlate,
      },
      {
        id: "seafood-basket",
        name: "Seafood Basket",
        description:
          "Chips, 4 calamaries, 3 fish cocktails, 3 seafood bites, 2 prawn cutlets, 1 seafood stick, tartare sauce and lemon",
        priceCents: 1700,
        popular: true,
        image: prawnsImg,
      },
      {
        id: "special-for-two",
        name: "Special for Two",
        description: "2 cods, 3 potato scallops, 4 seafood bites, 6 calamari rings, minimum chips",
        priceCents: 3100,
        popular: true,
        image: specialForTwoImg,
      },
      {
        id: "fisherman-basket",
        name: "Fisherman Basket",
        description:
          "Minimum chips, 2 cods, 10 fish cocktails, 10 calamari rings, 10 seafood bites, 8 prawn cutlets, 2 seafood sticks, 2 tartare sauce",
        priceCents: 6200,
        image: fishermanBasketImg,
      },
      {
        id: "special-basket",
        name: "Special Basket",
        description:
          "Minimum chips, 2 cods, 10 fish cocktails, 8 calamari rings, 5 seafood bites, 5 prawn cutlets, 2 seafood sticks, 2 tartare sauce",
        priceCents: 5100,
        image: specialBasketImg,
      },
      {
        id: "fish-chips-salad",
        name: "Fish & Chips Salad Plate",
        description: "",
        priceCents: 1500,
        image: fishChipsSaladImg,
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
      { id: "cod", name: "Cod", description: "Add grilled +$1", priceCents: 800, popular: true, image: codFishImg, options: FISH_OPTIONS },
      { id: "hoki", name: "Hoki", description: "Add grilled +$1", priceCents: 800, image: hokiFishImg, options: FISH_OPTIONS },
      { id: "snapper", name: "Snapper", description: "Add grilled +$1", priceCents: 1050, image: snapperFishImg, options: FISH_OPTIONS },
      { id: "barramundi", name: "Barramundi", description: "Add grilled +$1", priceCents: 1050, image: barramundiFishImg, options: FISH_OPTIONS },
    ],
  },
  {
    id: "snack-deals",
    title: "Snack Deals",
    kicker: "By the handful",
    folio: "B1",
    layout: "ledger",
    items: [
      { id: "chicken-nuggets", name: "Chicken Nuggets", description: "5 for $3.80", priceCents: 380, image: chickenNuggetsImg },
      { id: "chicken-chips", name: "Chicken Chips", description: "5 for $3.50", priceCents: 350, image: chickenChipsImg },
      { id: "spicy-chicken-wings", name: "Spicy Chicken Wings", description: "5 for $9.50 and $2.00 each", priceCents: 950, image: spicyChickenWingsImg },
      { id: "chicken-garlic-balls", name: "Chicken Garlic Balls", description: "$1.70 each", priceCents: 170, image: chickenGarlicBallsImg },
      { id: "fish-cocktails", name: "Fish Cocktails", description: "5 for $6.80", priceCents: 680, popular: true, image: fishCocktailsImg },
      { id: "prawn-cutlets", name: "Prawn Cutlets", description: "5 for $8.00", priceCents: 800, image: prawnCutletsImg },
      { id: "potato-scallops", name: "Potato Scallops", description: "6 for $8.50 and $2.00 each", priceCents: 850, popular: true, image: potatoScallopsImg },
      { id: "calamari-rings", name: "Calamari Rings", description: "8 for $7.00", priceCents: 700, popular: true, image: calamariRingsImg },
      { id: "seafood-bites", name: "Seafood Bites", description: "5 for $4.70", priceCents: 470, image: seafoodBitesImg },
      { id: "onion-rings", name: "Onion Rings", description: "4 for $2.50", priceCents: 250, image: onionRingsImg },
      { id: "battered-mussels", name: "Battered Mussels", description: "4 for $3.50", priceCents: 350, image: batteredMusselsImg },
    ],
  },
  {
    id: "burgers",
    title: "Burgers & Sandwiches",
    kicker: "Between the buns",
    folio: "B2",
    layout: "gallery",
    items: [
      { id: "hamburger", name: "Hamburger", description: "", priceCents: 800, popular: true, image: hamburgerImg },
      { id: "hamburger-lot", name: "Hamburger w/ Lot", description: "", priceCents: 1050, popular: true, image: hamburgerLotImg },
      { id: "steak-burger", name: "Steak Burger", description: "", priceCents: 850, popular: true, image: steakBurgerImg },
      { id: "steak-burger-lot", name: "Steak Burger w/ Lot", description: "", priceCents: 1150, popular: true, image: steakBurgerLotImg },
      { id: "bacon-egg-burger", name: "Bacon & Egg Burger", description: "", priceCents: 800, image: baconEggBurgerImg },
      { id: "chicken-burger", name: "Chicken Burger", description: "", priceCents: 850, image: chickenBurgerImg },
      { id: "fish-burger", name: "Fish Burger", description: "", priceCents: 950, image: fishBurgerImg },
      { id: "chicken-salad-sandwich", name: "Chicken Salad Sandwich", description: "", priceCents: 700, image: chickenSaladSandwichImg },
    ],
  },
  {
    id: "hot-rolls",
    title: "Hot Rolls",
    kicker: "Rolled & loaded",
    folio: "C1",
    layout: "ledger",
    items: [
      { id: "chicken-gravy-roll", name: "Chicken Gravy", description: "", priceCents: 700, image: chickenGravyRollImg },
      { id: "chicken-mayo-roll", name: "Chicken Mayo", description: "", priceCents: 700, image: chickenMayoRollImg },
      { id: "steak-gravy-roll", name: "Steak Gravy", description: "", priceCents: 850, image: steakGravyRollImg },
      { id: "hot-dog", name: "Hot Dog", description: "", priceCents: 500, image: hotDogImg },
      { id: "hot-dog-cheese", name: "Hot Dog & Cheese", description: "", priceCents: 550, image: hotDogCheeseImg },
      { id: "hot-dog-lot", name: "Hot Dog w/ Lot", description: "", priceCents: 700, image: hotDogLotImg },
      { id: "kabana-dog", name: "Kabana Dog", description: "", priceCents: 700, image: kabanaDogImg },
      { id: "kabana-dog-lot", name: "Kabana Dog w/ Lot", description: "", priceCents: 950, image: kabanaDogLotImg },
    ],
  },
  {
    id: "snacks",
    title: "Snacks",
    kicker: "One of everything",
    folio: "C2",
    layout: "ledger",
    items: [
      { id: "kabana", name: "Kabana", description: "", priceCents: 400, image: kabanaImg },
      { id: "chiko-roll", name: "Chiko Roll", description: "", priceCents: 380, image: chikoRollImg },
      { id: "spring-roll", name: "Spring Roll", description: "", priceCents: 380, image: springRollImg },
      { id: "crumbed-sausage", name: "Crumbed Sausage", description: "", priceCents: 350, image: crumbedSausageImg },
      { id: "battered-sav", name: "Battered Sav", description: "", priceCents: 400, image: batteredSavImg },
      { id: "fish-cake", name: "Fish Cake", description: "", priceCents: 300, image: fishCakeImg },
      { id: "chicken-cheese-schnitzel", name: "Chicken & Cheese Schnitzel", description: "", priceCents: 380, image: chickenCheeseSchnitzelImg },
      { id: "mini-dim-sim", name: "Mini Dim Sim", description: "", priceCents: 150, image: miniDimSimImg },
      { id: "chicken-dim-sim", name: "Chicken Dim Sim", description: "", priceCents: 350, image: chickenDimSimImg },
      { id: "corn-jack", name: "Corn Jack", description: "", priceCents: 400, image: cornJackImg },
      { id: "seafood-stick", name: "Seafood Stick", description: "", priceCents: 150, image: seafoodStickImg },
      { id: "pineapple-fritter", name: "Pineapple Fritter", description: "", priceCents: 180, image: pineappleFritterImg },
      { id: "pork-sausage", name: "Pork Sausage", description: "", priceCents: 450, image: porkSausageImg },
      { id: "ham-cheese-scallop", name: "Ham & Cheese Potato Scallop", description: "", priceCents: 450, image: hamCheeseScallopImg },
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
