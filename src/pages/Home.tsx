import type { CSSProperties } from "react";
import { frontPageItems, usePriceVersion } from "@/data/prices";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Phone, Star } from "lucide-react";
import { HERO_PHOTO, SHOP, displayName, formatPrice, type IndexedItem } from "@/data/menu";
import { Masthead, PriceNotice, Ticker, useDocumentTitle } from "@/components/site/Broadsheet";
import { useReveal, useTilt } from "@/components/site/hooks";

function FavouriteCard({ item, index }: { item: IndexedItem; index: number }) {
  const ref = useTilt<HTMLAnchorElement>(7);
  return (
    <Link
      ref={ref}
      to={`/menu#${item.category.id}`}
      className="cm-card cm-tilt"
      style={{ "--i": index } as CSSProperties}
    >
      <span className="cm-tilt__glare" />
      <div className="cm-card__media cm-halftone">
        <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
        <span className="cm-chip">
          <Star size={10} fill="currentColor" strokeWidth={0} /> Favourite
        </span>
      </div>
      <div className="cm-card__body">
        <div>
          <div className="cm-kicker" style={{ marginBottom: 4 }}>
            {item.category.title}
          </div>
          <h3 className="cm-card__name">{displayName(item)}</h3>
          <span className="cm-price cm-card__price">
            {formatPrice(item.priceCents)} <small className="cm-guide">guide</small>
          </span>
        </div>
        <span className="cm-add" aria-hidden="true">
          <ArrowRight size={18} strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}

const Home = () => {
  useDocumentTitle("");
  usePriceVersion(); // re-render when live prices / favourites arrive
  const favourites = frontPageItems();
  const lead = useReveal<HTMLDivElement>();
  const favs = useReveal<HTMLDivElement>();
  const boxes = useReveal<HTMLDivElement>();

  return (
    <>
      <Masthead
        pre="The"
        main="Daily"
        accent="Catch"
        subtitle="Costa's Takeaway: fish, chips & everything golden, cooked to order and wrapped while it's hot."
      />
      <Ticker />

      <div className="cm-wrap">
        {/* ---------------------------------------------------------------- Lead story */}
        <section className="cm-section" aria-labelledby="lead-title">
          <div ref={lead} className="cm-lead cm-reveal">
            <figure className="cm-lead__figure">
              <div className="cm-lead__photo cm-halftone">
                <img src={HERO_PHOTO} alt="Battered fish and golden chips" fetchPriority="high" decoding="async" />
              </div>
              <figcaption className="cm-kicker">Pictured: the house special, battered fish &amp; chips. Photo: our kitchen.</figcaption>
            </figure>

            <article className="cm-lead__story">
              <div className="cm-kicker cm-notice__kicker">Lead story · Woodridge</div>
              <h2 id="lead-title" className="cm-lead__title">
                Fish &amp; chips, cooked to order, <em>wrapped while it's hot.</em>
              </h2>
              <div className="cm-lead__body">
                <p>
                  Every order at Costa's goes into the fryer when you ask for it, not before. Cod, hoki, snapper and
                  barramundi, battered, crumbed or grilled. Then scallops, calamari, prawn cutlets, burgers, hot rolls and
                  all the classics alongside.
                </p>
                <p>
                  Ring ahead and tell us what you're after. We'll have it hot and wrapped at the counter when you walk in.
                  Pickup only, from Shop 3 on Smith Road.
                </p>
              </div>
              <div className="cm-lead__actions">
                <Link to="/menu" className="cm-btn cm-btn--primary">
                  Read the menu <ArrowRight size={18} />
                </Link>
                <a href={SHOP.phoneHref} className="cm-btn">
                  <Phone size={16} /> {SHOP.phoneDisplay}
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* ---------------------------------------------------------------- Favourites */}
        {favourites.length > 0 && (
          <section className="cm-section" aria-labelledby="favs-title">
            <header className="cm-section__head">
              <span className="cm-section__folio" aria-hidden="true">
                A2
              </span>
              <div>
                <div className="cm-kicker">As voted by the queue</div>
                <h2 id="favs-title" className="cm-section__title">
                  Readers' favourites
                </h2>
              </div>
              <Link to="/menu" className="cm-section__count cm-inline-link">
                Full menu →
              </Link>
            </header>
            <div ref={favs} className="cm-gallery cm-gallery--3 cm-reveal">
              {favourites.map((item, i) => (
                <FavouriteCard key={item.id} item={item} index={i} />
              ))}
            </div>
            <PriceNotice compact />
          </section>
        )}

        {/* ---------------------------------------------------------------- Info boxes */}
        <section className="cm-section" aria-label="Opening hours and contact">
          <div ref={boxes} className="cm-classifieds cm-reveal">
            <div className="cm-classified" style={{ "--i": 0 } as CSSProperties}>
              <div className="cm-kicker">A3 · Service</div>
              <h3>Pickup only</h3>
              <p className="cm-fineprint">
                No delivery and no online ordering. Open six days, closed Sundays. Full hours are at the bottom of every
                page.
              </p>
            </div>
            <div className="cm-classified" style={{ "--i": 1 } as CSSProperties}>
              <div className="cm-kicker">A4 · Orders</div>
              <h3>Call ahead</h3>
              <a href={SHOP.phoneHref} className="cm-bigphone">
                {SHOP.phoneDisplay}
              </a>
              <p className="cm-fineprint">Tell us your order and pick it up hot. We don't do delivery.</p>
            </div>
            <div className="cm-classified" style={{ "--i": 2 } as CSSProperties}>
              <div className="cm-kicker">A5 · Directions</div>
              <h3>Find us</h3>
              <p className="cm-fineprint" style={{ fontStyle: "normal" }}>
                <MapPin size={15} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
                {SHOP.address}
              </p>
              <Link to="/contact" className="cm-btn" style={{ marginTop: 12 }}>
                Map &amp; directions <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
