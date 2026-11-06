import { useEffect, useState } from "react";
import { Check, Copy, Minus, Phone, Plus, Search, Star, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ALL_ITEMS, MENU, SHOP, displayName, formatPrice, type IndexedItem } from "@/data/menu";
import type { Order } from "@/components/site/hooks";

/* ========================================================================== */
/*  Item dialog                                                                */
/* ========================================================================== */

interface ItemDialogProps {
  item: IndexedItem | null;
  onClose: () => void;
  onAdd: (item: IndexedItem, optionId: string | undefined, qty: number, from: HTMLElement) => void;
}

export function ItemDialog({ item, onClose, onAdd }: ItemDialogProps) {
  const [qty, setQty] = useState(1);
  const [optionId, setOptionId] = useState<string | undefined>();

  useEffect(() => {
    setQty(1);
    setOptionId(item?.options?.[0]?.id);
  }, [item]);

  const option = item?.options?.find((o) => o.id === optionId);
  const unit = item ? item.priceCents + (option?.extraCents ?? 0) : 0;

  return (
    <Dialog open={Boolean(item)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="cm-receipt max-w-xl gap-0 overflow-hidden border-2 border-[var(--ink)] p-0 sm:rounded-lg [&>button:last-child]:z-10 [&>button:last-child]:rounded-full [&>button:last-child]:bg-[var(--paper)] [&>button:last-child]:p-2 [&>button:last-child]:opacity-100">
        {item && (
          <>
            {item.image ? (
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-[var(--ink)]">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                {item.popular && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#c9442a] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-widest text-white">
                    <Star size={11} fill="currentColor" strokeWidth={0} /> Local favourite
                  </span>
                )}
              </div>
            ) : (
              <div className="h-3" />
            )}
            <div className="grid gap-4 p-6">
              <div>
                <div className="text-[0.68rem] uppercase tracking-[0.2em] opacity-60">
                  {item.category.title}
                </div>
                <DialogTitle className="cm-receipt__head mt-1 text-3xl font-extrabold leading-tight tracking-tight">
                  {displayName(item)}
                </DialogTitle>
                <DialogDescription className="cm-receipt__head mt-2 text-base italic leading-relaxed text-[var(--ink)] opacity-75">
                  {item.description || "Cooked fresh to order, the way it should be."}
                </DialogDescription>
              </div>

              {item.options && (
                <fieldset>
                  <legend className="mb-2 text-[0.68rem] uppercase tracking-[0.2em] opacity-60">How you like it</legend>
                  <div className="flex flex-wrap gap-2" role="radiogroup">
                    {item.options.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        role="radio"
                        aria-checked={o.id === optionId}
                        onClick={() => setOptionId(o.id)}
                        className={`rounded-full border-2 border-[var(--ink)] px-4 py-1.5 text-sm font-bold transition-colors ${
                          o.id === optionId ? "bg-[var(--ink)] text-[var(--paper)]" : "hover:bg-[var(--ink)]/10"
                        }`}
                      >
                        {o.label}
                        {o.extraCents > 0 && <span className="ml-1 opacity-70">+{formatPrice(o.extraCents)}</span>}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              <p className="rounded-md border-2 border-dashed border-[#c9442a] px-3 py-2 text-xs leading-relaxed">
                <b className="text-[#c9442a]">Guide price.</b> The in-store price applies.
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-[var(--ink)]/30 pt-4">
                <Stepper value={qty} onChange={setQty} min={1} />
                <button
                  type="button"
                  onClick={(e) => {
                    onAdd(item, optionId, qty, e.currentTarget);
                    onClose();
                  }}
                  className="inline-flex flex-1 items-center justify-between gap-6 rounded-full border-2 border-[var(--ink)] bg-[#c9442a] px-5 py-3 font-bold text-white shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none sm:flex-none"
                >
                  <span>Add to parcel</span>
                  <span>≈ {formatPrice(unit * qty)}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Stepper({ value, onChange, min = 0 }: { value: number; onChange: (n: number) => void; min?: number }) {
  return (
    <div className="inline-flex items-center rounded-full border-2 border-[var(--ink)]">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="grid h-9 w-9 place-items-center rounded-full hover:bg-[var(--ink)]/10 disabled:opacity-30"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={15} />
      </button>
      <span className="w-8 text-center font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="grid h-9 w-9 place-items-center rounded-full hover:bg-[var(--ink)]/10 disabled:opacity-30"
        disabled={value >= 99}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

/* ========================================================================== */
/*  Parcel sheet — a receipt you read out over the phone                       */
/* ========================================================================== */

function orderText(order: Order) {
  const lines = order.lines.map((l) => {
    const name = displayName(l.item) + (l.option ? ` (${l.option.label.toLowerCase()})` : "");
    return `${l.qty} × ${name} — ${formatPrice(l.totalCents)}`;
  });
  return [`My order for Costa's Takeaway:`, ...lines, `Guide total: ${formatPrice(order.totalCents)} (guide only, in-store prices apply)`].join("\n");
}

export function ParcelSheet({ order, open, onOpenChange }: { order: Order; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [copied, setCopied] = useState(false);
  const orderNo = useState(() => String(Math.floor(Math.random() * 900) + 100))[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(orderText(order));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="cm-receipt flex w-full flex-col gap-0 border-l-2 border-[var(--ink)] p-0 sm:max-w-md">
        <div className="px-6 pb-4 pt-8 text-center">
          <div className="text-[0.68rem] uppercase tracking-[0.25em] opacity-60">Costa's Takeaway · Woodridge</div>
          <SheetTitle className="cm-receipt__head mt-1 text-4xl font-black italic tracking-tight text-[var(--ink)]">
            Your parcel
          </SheetTitle>
          <SheetDescription className="mt-1 text-xs text-[var(--ink)] opacity-60">
            Ticket #{orderNo} · {order.count} {order.count === 1 ? "item" : "items"}
          </SheetDescription>
        </div>
        <div className="mx-6 border-t-2 border-dashed border-[var(--ink)]/40" />

        <div className="flex-1 overflow-y-auto px-6 py-2">
          {order.lines.length === 0 ? (
            <p className="cm-receipt__head py-16 text-center italic opacity-60">
              Nothing wrapped up yet. Tap the <b>+</b> next to anything that looks good.
            </p>
          ) : (
            <ul>
              {order.lines.map((l) => (
                <li key={l.key} className="flex items-center gap-3 border-b border-dashed border-[var(--ink)]/25 py-3">
                  {l.item.image ? (
                    <img src={l.item.thumb} alt="" className="h-11 w-11 flex-shrink-0 rounded-full border-2 border-[var(--ink)] object-cover" />
                  ) : (
                    <span className="h-11 w-11 flex-shrink-0 rounded-full border-2 border-[var(--ink)] bg-[#e2a12f]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold">{displayName(l.item)}</div>
                    <div className="text-xs opacity-60">
                      {l.option ? `${l.option.label} · ` : ""}
                      {formatPrice(l.unitCents)} ea
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold tabular-nums">{formatPrice(l.totalCents)}</span>
                    <div className="inline-flex items-center rounded-full border border-[var(--ink)]/50 text-xs">
                      <button
                        type="button"
                        className="grid h-6 w-6 place-items-center"
                        aria-label={`Remove one ${l.item.name}`}
                        onClick={() => order.setQty(l.key, l.qty - 1)}
                      >
                        {l.qty === 1 ? <Trash2 size={11} /> : <Minus size={11} />}
                      </button>
                      <span className="w-5 text-center tabular-nums">{l.qty}</span>
                      <button
                        type="button"
                        className="grid h-6 w-6 place-items-center"
                        aria-label={`Add one ${l.item.name}`}
                        onClick={() => order.setQty(l.key, l.qty + 1)}
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t-2 border-[var(--ink)] px-6 pb-6 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.2em] opacity-60">Guide total</span>
            <span className="cm-receipt__head text-4xl font-black tabular-nums">{formatPrice(order.totalCents)}</span>
          </div>
          <p className="mt-3 rounded-md border-2 border-dashed border-[#c9442a] px-3 py-2 text-[0.72rem] leading-relaxed">
            <b className="text-[#c9442a]">This total is a guide.</b> The in-store price applies. This is a planning list,
            not an online order: call us and read it out. Pickup only.
          </p>
          <a
            href={SHOP.phoneHref}
            className="mt-4 flex items-center justify-center gap-3 rounded-full border-2 border-[var(--ink)] bg-[#c9442a] px-5 py-3.5 font-bold text-white shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            <Phone size={18} /> Call {SHOP.phoneDisplay}
          </a>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <button
              type="button"
              onClick={copy}
              disabled={order.lines.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--ink)] py-2 font-bold disabled:opacity-30"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy list"}
            </button>
            <button
              type="button"
              onClick={order.clear}
              disabled={order.lines.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--ink)]/40 py-2 disabled:opacity-30"
            >
              <Trash2 size={15} /> Start over
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ========================================================================== */
/*  Search palette (⌘K or /)                                                   */
/* ========================================================================== */

export function SearchPalette({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onPick: (item: IndexedItem) => void;
}) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Search the menu</DialogTitle>
      <CommandInput placeholder="Search the menu… try “scallop”, “popular” or “$8”" />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>No catch today. Try another word.</CommandEmpty>
        {MENU.map((category) => (
          <CommandGroup key={category.id} heading={category.title}>
            {category.items.map((raw) => {
              const item = ALL_ITEMS.find((i) => i.id === raw.id)!;
              const price = formatPrice(item.priceCents);
              // Extra keywords so "popular", "seafood", "$8" etc. all match.
              const keywords = [category.title, category.kicker, item.description, price, item.popular ? "popular favourite" : ""];
              return (
                <CommandItem
                  key={item.id}
                  value={`${displayName(item)} ${item.id}`}
                  keywords={keywords}
                  onSelect={() => {
                    onOpenChange(false);
                    onPick(item);
                  }}
                  className="gap-3"
                >
                  {item.image ? (
                    <img src={item.thumb} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-muted">
                      <Search size={14} />
                    </span>
                  )}
                  <span className="flex-1">
                    {displayName(item)}
                    {item.popular && <Star size={11} className="ml-1.5 inline fill-primary text-primary" />}
                  </span>
                  <span className="font-mono text-sm font-bold text-primary">{price}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
