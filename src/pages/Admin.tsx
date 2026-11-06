import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { ArrowDown, ArrowUp, History, LogOut, Minus, Newspaper, Percent, Plus, RotateCcw, Save, Search, Star, Undo2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ALL_ITEMS, DEFAULT_FRONT_PAGE, FRONT_PAGE_MAX, MENU, displayName, formatPrice } from "@/data/menu";
import {
  DEFAULT_POPULAR,
  DEFAULT_PRICES,
  applyPrices,
  applySettings,
  cleanIdList,
  livePricesConfigured,
  parsePriceInput,
  type PriceRow,
  type SettingKey,
  type SettingRow,
} from "@/data/prices";
import { useDocumentTitle } from "@/components/site/Broadsheet";

/* ========================================================================== */
/*  Helpers                                                                    */
/* ========================================================================== */

type Overrides = Map<string, number>;

interface SettingsHistoryRow {
  id: number;
  key: SettingKey;
  old_value: unknown;
  new_value: unknown;
  changed_at: string;
  changed_by_email: string | null;
}

/** One line in "Recent changes", whichever table it came from. */
interface ChangeLine {
  key: string;
  at: string;
  who: string | null;
  title: string;
  detail: string;
}

const sameSet = (a: ReadonlySet<string>, b: ReadonlySet<string>) => a.size === b.size && [...a].every((x) => b.has(x));
const sameList = (a: readonly string[], b: readonly string[]) => a.join() === b.join();
const names = (ids: string[]) => ids.map((id) => NAME_BY_ID.get(id) ?? id).join(", ");

function describeSetting(h: SettingsHistoryRow): ChangeLine {
  const before = cleanIdList(h.old_value);
  const after = cleanIdList(h.new_value);
  let detail: string;
  if (h.key === "popular") {
    const was = new Set(before ?? DEFAULT_POPULAR);
    const now = new Set(after ?? DEFAULT_POPULAR);
    const added = [...now].filter((x) => !was.has(x));
    const removed = [...was].filter((x) => !now.has(x));
    detail =
      [added.length && `★ added ${names(added)}`, removed.length && `removed ${names(removed)}`].filter(Boolean).join("; ") ||
      (after === null ? "reset to default" : "no change");
  } else {
    detail = after === null ? "reset to default" : after.length ? names(after) : "none";
  }
  return {
    key: `s${h.id}`,
    at: h.changed_at,
    who: h.changed_by_email,
    title: h.key === "popular" ? "Popular items" : "Front page favourites",
    detail,
  };
}

interface HistoryRow {
  id: number;
  item_id: string;
  old_price_cents: number | null;
  new_price_cents: number | null;
  changed_at: string;
  changed_by_email: string | null;
}

const NAME_BY_ID = new Map(ALL_ITEMS.map((i) => [i.id, displayName(i)]));

function centsToInput(cents: number) {
  return (cents / 100).toFixed(2);
}

function friendlyError(message: string): string {
  if (/invalid login credentials/i.test(message)) return "That email and password don't match an account.";
  if (/relation .*menu_prices.* does not exist|could not find the table/i.test(message))
    return "The prices table hasn't been set up in Supabase yet. Run the setup SQL first (see README).";
  if (/row-level security|permission denied/i.test(message)) return "This account isn't allowed to change prices.";
  if (/failed to fetch|network/i.test(message)) return "Couldn't reach the database. Check your connection and try again.";
  return message;
}

function timeAgo(iso: string) {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

/* ========================================================================== */
/*  Login                                                                      */
/* ========================================================================== */

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError(friendlyError(error.message));
  };

  return (
    <form className="cm-box cm-admin-login" onSubmit={submit}>
      <div className="cm-kicker">Staff only</div>
      <h2>Sign in to the price desk</h2>
      <label>
        <span>Email</span>
        <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        <span>Password</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && (
        <p className="cm-admin-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="cm-btn cm-btn--primary" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

/* ========================================================================== */
/*  Price editor                                                               */
/* ========================================================================== */

function PriceEditor({ session }: { session: Session }) {
  const [saved, setSaved] = useState<Overrides>(new Map()); // what's in the database
  const [drafts, setDrafts] = useState<Map<string, string>>(new Map()); // what's typed, by item id
  const [history, setHistory] = useState<ChangeLine[]>([]);
  // Popular (★) and front-page picks: what's saved, and unsaved edits (null = untouched).
  const [savedPopular, setSavedPopular] = useState<Set<string>>(new Set(DEFAULT_POPULAR));
  const [savedFront, setSavedFront] = useState<string[]>([...DEFAULT_FRONT_PAGE]);
  const [savedSettingKeys, setSavedSettingKeys] = useState<Set<SettingKey>>(new Set());
  const [draftPopular, setDraftPopular] = useState<Set<string> | null>(null);
  const [draftFront, setDraftFront] = useState<string[] | null>(null);
  const [settingsReady, setSettingsReady] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [percent, setPercent] = useState("5");

  const load = useCallback(async () => {
    const [prices, hist, settings, settingsHist] = await Promise.all([
      supabase.from("menu_prices").select("item_id, price_cents, updated_at"),
      supabase
        .from("menu_price_history")
        .select("id, item_id, old_price_cents, new_price_cents, changed_at, changed_by_email")
        .order("changed_at", { ascending: false })
        .limit(40),
      supabase.from("menu_settings").select("key, value"),
      supabase
        .from("menu_settings_history")
        .select("id, key, old_value, new_value, changed_at, changed_by_email")
        .order("changed_at", { ascending: false })
        .limit(20),
    ]);
    if (prices.error) {
      setError(friendlyError(prices.error.message));
      setLoading(false);
      return;
    }
    const rows = (prices.data ?? []) as PriceRow[];
    setSaved(new Map(rows.map((r) => [r.item_id, r.price_cents])));
    applyPrices(rows); // keep the rest of the site in this tab in sync

    // Settings are optional: if their table isn't set up yet, prices still work.
    setSettingsReady(!settings.error);
    if (!settings.error) {
      const rows = (settings.data ?? []) as SettingRow[];
      const byKey = new Map(rows.map((r) => [r.key, r.value]));
      setSavedPopular(new Set(cleanIdList(byKey.get("popular")) ?? DEFAULT_POPULAR));
      setSavedFront(cleanIdList(byKey.get("front_page")) ?? [...DEFAULT_FRONT_PAGE]);
      setSavedSettingKeys(new Set(rows.map((r) => r.key)));
      applySettings(rows);
    }

    const lines: ChangeLine[] = [
      ...((hist.error ? [] : hist.data ?? []) as HistoryRow[]).map((h) => ({
        key: `p${h.id}`,
        at: h.changed_at,
        who: h.changed_by_email,
        title: NAME_BY_ID.get(h.item_id) ?? h.item_id,
        detail: `${h.old_price_cents === null ? "default" : formatPrice(h.old_price_cents)} → ${
          h.new_price_cents === null ? "default" : formatPrice(h.new_price_cents)
        }`,
      })),
      ...((settingsHist.error ? [] : settingsHist.data ?? []) as SettingsHistoryRow[]).map(describeSetting),
    ];
    setHistory(lines.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 40));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** The live price for an item right now (database override, or the built-in default). */
  const livePrice = useCallback((id: string) => saved.get(id) ?? DEFAULT_PRICES.get(id)!, [saved]);

  /** What the price will be after saving, or null if the typed text isn't a valid price. */
  const pendingPrice = (id: string): number | null => {
    const draft = drafts.get(id);
    return draft === undefined ? livePrice(id) : parsePriceInput(draft);
  };

  const changes = useMemo(() => {
    const list: { id: string; from: number; to: number }[] = [];
    let invalid = 0;
    for (const [id, text] of drafts) {
      const cents = parsePriceInput(text);
      if (cents === null) invalid++;
      else if (cents !== livePrice(id)) list.push({ id, from: livePrice(id), to: cents });
    }
    return { list, invalid };
  }, [drafts, livePrice]);

  const popular = draftPopular ?? savedPopular;
  const front = draftFront ?? savedFront;
  const popularChanged = !sameSet(popular, savedPopular);
  const frontChanged = !sameList(front, savedFront);
  const totalChanges = changes.list.length + (popularChanged ? 1 : 0) + (frontChanged ? 1 : 0);

  const togglePopular = (id: string) =>
    setDraftPopular(() => {
      const next = new Set(popular);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleFront = (id: string) =>
    setDraftFront(() => {
      if (front.includes(id)) return front.filter((x) => x !== id);
      return front.length >= FRONT_PAGE_MAX ? front : [...front, id];
    });

  const moveFront = (id: string, delta: number) =>
    setDraftFront(() => {
      const list = [...front];
      const i = list.indexOf(id);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= list.length) return list;
      [list[i], list[j]] = [list[j], list[i]];
      return list;
    });

  const discardAll = () => {
    setDrafts(new Map());
    setDraftPopular(null);
    setDraftFront(null);
  };

  const setDraft = (id: string, text: string) =>
    setDrafts((d) => {
      const next = new Map(d);
      next.set(id, text);
      return next;
    });

  const nudge = (id: string, deltaCents: number) => {
    const current = pendingPrice(id) ?? livePrice(id);
    setDraft(id, centsToInput(Math.max(0, current + deltaCents)));
  };

  const adjustAll = (pct: number) => {
    if (!Number.isFinite(pct) || pct === 0) return;
    setDrafts(() => {
      const next = new Map<string, string>();
      for (const item of ALL_ITEMS) {
        // Round to the nearest 10c so prices stay tidy.
        const raised = Math.round((livePrice(item.id) * (1 + pct / 100)) / 10) * 10;
        next.set(item.id, centsToInput(raised));
      }
      return next;
    });
  };

  const save = async () => {
    if (changes.invalid > 0 || totalChanges === 0) return;
    setSaving(true);
    setError(null);
    // A price equal to the built-in default is stored by deleting the override.
    const upserts = changes.list.filter((c) => c.to !== DEFAULT_PRICES.get(c.id)).map((c) => ({ item_id: c.id, price_cents: c.to }));
    const resets = changes.list.filter((c) => c.to === DEFAULT_PRICES.get(c.id) && saved.has(c.id)).map((c) => c.id);

    // Settings work the same way: matching the built-in default means "delete the row".
    const settingWrites: { key: SettingKey; value: string[]; isDefault: boolean }[] = [];
    if (popularChanged)
      settingWrites.push({ key: "popular", value: [...popular], isDefault: sameSet(popular, DEFAULT_POPULAR) });
    if (frontChanged)
      settingWrites.push({ key: "front_page", value: front, isDefault: sameList(front, DEFAULT_FRONT_PAGE) });
    const settingUpserts = settingWrites.filter((w) => !w.isDefault).map(({ key, value }) => ({ key, value }));
    const settingResets = settingWrites.filter((w) => w.isDefault && savedSettingKeys.has(w.key)).map((w) => w.key);

    const results = await Promise.all([
      upserts.length ? supabase.from("menu_prices").upsert(upserts, { onConflict: "item_id" }) : null,
      resets.length ? supabase.from("menu_prices").delete().in("item_id", resets) : null,
      settingUpserts.length ? supabase.from("menu_settings").upsert(settingUpserts, { onConflict: "key" }) : null,
      settingResets.length ? supabase.from("menu_settings").delete().in("key", settingResets) : null,
    ]);
    const failed = results.find((r) => r?.error);
    setSaving(false);
    if (failed?.error) {
      setError(friendlyError(failed.error.message));
      return;
    }
    discardAll();
    setFlash(`Saved ${totalChanges} ${totalChanges === 1 ? "change" : "changes"}. Live on the website now.`);
    window.setTimeout(() => setFlash(null), 4000);
    await load();
  };

  const resetToDefault = (id: string) => setDraft(id, centsToInput(DEFAULT_PRICES.get(id)!));

  const q = query.trim().toLowerCase();

  if (loading) return <p className="cm-fineprint">Loading prices…</p>;

  return (
    <div className="cm-admin">
      <div className="cm-admin__bar">
        <div>
          <div className="cm-kicker">Signed in as {session.user.email}</div>
          <p className="cm-fineprint" style={{ margin: "4px 0 0" }}>
            {saved.size === 0 ? "All prices are the built-in defaults." : `${saved.size} prices changed from the built-in defaults.`}
          </p>
        </div>
        <button type="button" className="cm-btn" onClick={() => supabase.auth.signOut()}>
          <LogOut size={16} /> Sign out
        </button>
      </div>

      {error && (
        <p className="cm-admin-error" role="alert">
          {error}
        </p>
      )}

      <div className="cm-admin__tools">
        <label className="cm-admin__search">
          <Search size={16} aria-hidden="true" />
          <input type="search" placeholder="Find an item…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="cm-admin__bulk">
          <span className="cm-kicker">Adjust every price by</span>
          <label className="cm-admin__pct">
            <input inputMode="decimal" value={percent} onChange={(e) => setPercent(e.target.value)} aria-label="Percentage" />
            <Percent size={14} aria-hidden="true" />
          </label>
          <button type="button" className="cm-btn" onClick={() => adjustAll(Number(percent))}>
            Preview
          </button>
        </div>
      </div>

      {settingsReady ? (
        <section className="cm-admin__group">
          <h3>
            <Newspaper size={18} style={{ display: "inline", verticalAlign: "-3px" }} /> Front page favourites{" "}
            <small>
              {front.length}/{FRONT_PAGE_MAX}
            </small>
          </h3>
          <p className="cm-fineprint" style={{ margin: "6px 0 10px" }}>
            Shown in this order under "Readers' favourites" on the front page. Add items with the{" "}
            <Newspaper size={13} style={{ display: "inline", verticalAlign: "-2px" }} /> button below; ★ marks an item as
            popular on the menu and in the ticker.
          </p>
          {front.length === 0 ? (
            <p className="cm-fineprint">None picked, so the section is hidden on the front page.</p>
          ) : (
            <ol className="cm-admin__front" data-dirty={frontChanged || undefined}>
              {front.map((id, i) => (
                <li key={id}>
                  <span className="cm-admin__rank">{i + 1}</span>
                  <b>{NAME_BY_ID.get(id)}</b>
                  <span className="cm-admin__price">
                    <button type="button" aria-label={`Move ${NAME_BY_ID.get(id)} up`} disabled={i === 0} onClick={() => moveFront(id, -1)}>
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${NAME_BY_ID.get(id)} down`}
                      disabled={i === front.length - 1}
                      onClick={() => moveFront(id, 1)}
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button type="button" aria-label={`Remove ${NAME_BY_ID.get(id)} from the front page`} onClick={() => toggleFront(id)}>
                      <X size={14} />
                    </button>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      ) : (
        <p className="cm-admin-error" style={{ marginTop: 20 }}>
          Favourites can't be edited yet: run the second setup SQL (menu_settings) in Supabase. Prices still work.
        </p>
      )}

      {MENU.map((category) => {
        const items = category.items.filter((i) => !q || `${i.name} ${category.title}`.toLowerCase().includes(q));
        if (items.length === 0) return null;
        return (
          <section key={category.id} className="cm-admin__group">
            <h3>
              <small>{category.folio}</small> {category.title}
            </h3>
            {items.map((item) => {
              const id = item.id;
              const draft = drafts.get(id);
              const live = livePrice(id);
              const pending = pendingPrice(id);
              const def = DEFAULT_PRICES.get(id)!;
              const invalid = draft !== undefined && pending === null;
              const dirty = pending !== null && pending !== live;
              return (
                <div key={id} className="cm-admin__row" data-dirty={dirty || undefined} data-invalid={invalid || undefined}>
                  <div className="cm-admin__name">
                    <b>{NAME_BY_ID.get(id)}</b>
                    <small>
                      {saved.has(id) ? `Default ${formatPrice(def)}` : "Using default"}
                      {dirty && ` · was ${formatPrice(live)}`}
                    </small>
                  </div>
                  <div className="cm-admin__price">
                    {settingsReady && (
                      <>
                        <button
                          type="button"
                          className="cm-admin__toggle"
                          aria-pressed={popular.has(id)}
                          aria-label={`Mark ${NAME_BY_ID.get(id)} as popular`}
                          title="Popular: ★ badge on the menu and in the ticker"
                          onClick={() => togglePopular(id)}
                        >
                          <Star size={14} fill={popular.has(id) ? "currentColor" : "none"} />
                        </button>
                        <button
                          type="button"
                          className="cm-admin__toggle"
                          aria-pressed={front.includes(id)}
                          aria-label={`Show ${NAME_BY_ID.get(id)} on the front page`}
                          title={
                            front.includes(id) || front.length < FRONT_PAGE_MAX
                              ? "Show in Readers' favourites on the front page"
                              : `The front page already has ${FRONT_PAGE_MAX}. Remove one first.`
                          }
                          disabled={!front.includes(id) && front.length >= FRONT_PAGE_MAX}
                          onClick={() => toggleFront(id)}
                        >
                          {front.includes(id) ? <b>{front.indexOf(id) + 1}</b> : <Newspaper size={14} />}
                        </button>
                        <span className="cm-admin__sep" aria-hidden="true" />
                      </>
                    )}
                    <button type="button" aria-label={`${item.name} 10 cents less`} onClick={() => nudge(id, -10)}>
                      <Minus size={14} />
                    </button>
                    <label>
                      <span aria-hidden="true">$</span>
                      <input
                        inputMode="decimal"
                        aria-label={`${NAME_BY_ID.get(id)} price`}
                        aria-invalid={invalid || undefined}
                        value={draft ?? centsToInput(live)}
                        onChange={(e) => setDraft(id, e.target.value)}
                        onFocus={(e) => e.currentTarget.select()}
                      />
                    </label>
                    <button type="button" aria-label={`${item.name} 10 cents more`} onClick={() => nudge(id, 10)}>
                      <Plus size={14} />
                    </button>
                    <button
                      type="button"
                      className="cm-admin__reset"
                      title="Back to the built-in default price"
                      aria-label={`Reset ${item.name} to default`}
                      disabled={(pending ?? live) === def}
                      onClick={() => resetToDefault(id)}
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}

      <section className="cm-admin__group">
        <h3>
          <History size={18} style={{ display: "inline", verticalAlign: "-3px" }} /> Recent changes
        </h3>
        {history.length === 0 ? (
          <p className="cm-fineprint">No changes yet.</p>
        ) : (
          <table className="cm-hours cm-admin__history">
            <tbody>
              {history.map((h) => (
                <tr key={h.key}>
                  <td>
                    <b>{h.title}</b>
                    <br />
                    <small>
                      {timeAgo(h.at)}
                      {h.who && ` · ${h.who}`}
                    </small>
                  </td>
                  <td>{h.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className="cm-admin__savebar" data-visible={totalChanges > 0 || changes.invalid > 0 || Boolean(flash)}>
        <div className="cm-wrap cm-admin__savebar-inner">
          <span>
            {flash ??
              (changes.invalid > 0
                ? `${changes.invalid} price${changes.invalid === 1 ? " isn't" : "s aren't"} valid`
                : `${totalChanges} unsaved ${totalChanges === 1 ? "change" : "changes"}`)}
          </span>
          {!flash && (
            <div>
              <button type="button" className="cm-btn" onClick={discardAll} disabled={saving}>
                <Undo2 size={16} /> Discard
              </button>
              <button
                type="button"
                className="cm-btn cm-btn--primary"
                onClick={save}
                disabled={saving || changes.invalid > 0 || totalChanges === 0}
              >
                <Save size={16} /> {saving ? "Saving…" : "Save & publish"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/*  Page                                                                       */
/* ========================================================================== */

function useAdminSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    // RLS only lets people see their own role rows.
    supabase
      .from("user_roles")
      .select("role")
      .eq("role", "admin")
      .then(({ data, error }) => setIsAdmin(!error && (data?.length ?? 0) > 0));
  }, [session]);

  return { session, isAdmin };
}

const Admin = () => {
  useDocumentTitle("Price desk");
  useNoIndex();
  const { session, isAdmin } = useAdminSession();

  return (
    <>
      <header className="cm-wrap cm-pagehead">
        <hr className="cm-rule cm-rule--double" />
        <div className="cm-pagehead__row">
          <span className="cm-section__folio" aria-hidden="true">
            Z
          </span>
          <div>
            <div className="cm-kicker">Staff only · Not for publication</div>
            <h1 className="cm-pagehead__title">
              Price <em>desk</em>
            </h1>
          </div>
        </div>
        <p className="cm-subtitle cm-pagehead__lede">
          Change prices and favourites, hit Save, and it's live on the website straight away.
        </p>
        <hr className="cm-rule" />
      </header>

      <div className="cm-wrap cm-section" style={{ paddingTop: 32 }}>
        {!livePricesConfigured() ? (
          <p className="cm-admin-error">Supabase isn't configured for this build.</p>
        ) : session === undefined ? (
          <p className="cm-fineprint">Checking sign-in…</p>
        ) : !session ? (
          <LoginForm />
        ) : isAdmin === null ? (
          <p className="cm-fineprint">Checking permissions…</p>
        ) : !isAdmin ? (
          <div className="cm-box cm-admin-login">
            <h2>Not an admin</h2>
            <p className="cm-fineprint">
              {session.user.email} is signed in but doesn't have permission to change prices.
            </p>
            <button type="button" className="cm-btn" onClick={() => supabase.auth.signOut()}>
              <LogOut size={16} /> Sign out
            </button>
          </div>
        ) : (
          <PriceEditor session={session} />
        )}
        <p className="cm-fineprint" style={{ marginTop: 40 }}>
          <Link to="/menu" className="cm-inline-link">
            View the live menu →
          </Link>
        </p>
      </div>
    </>
  );
};

export default Admin;
