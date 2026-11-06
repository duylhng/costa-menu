import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { HERO_PHOTO, SHOP, displayName, formatPrice, type IndexedItem } from "@/data/menu";
import { frontPageItems, usePriceVersion } from "@/data/prices";
import { Masthead, PriceNotice, Ticker, useDocumentTitle } from "@/components/site/Broadsheet";
import { useReveal, useTilt } from "@/components/site/hooks";

function FavouriteCard({ item, index }: { item: IndexedItem; index: number }) {
  const ref = useTilt<HTMLAnchorElement>(6);
  return (
    <Link ref={ref} to={`/menu#${item.category.id}`} className="cm-card cm-tilt" style={{ "--i": index } as CSSProperties}>
      <span className="cm-tilt__glare" />
      <div className="cm-card__media">
        <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
      </div>
      <div className="cm-card__body">
        <div>
          <h3 className="cm-card__name">{displayName(item)}</h3>
          <span className="cm-price cm-card__price">{formatPrice(item.priceCents)}</span>
        </div>
        <ArrowRight size={18} className="cm-card__arrow" aria-hidden="true" />
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

  return (
    <>
      <Masthead pre="The" main="Daily" accent="Catch" subtitle="Fish & chips, cooked to order in Woodridge.">
        <div className="cm-lead__actions">
          <Link to="/menu" className="cm-btn cm-btn--primary">
            See the menu <ArrowRight size={18} />
          </Link>
          <a href={SHOP.phoneHref} className="cm-btn">
            <Phone size={16} /> {SHOP.phoneDisplay}
          </a>
        </div>
      </Masthead>
      <Ticker />

      <div className="cm-wrap">
        <section className="cm-section" aria-labelledby="lead-title">
          <div ref={lead} className="cm-lead cm-reveal">
            <div className="cm-lead__photo">
              <img src={HERO_PHOTO} alt="Battered fish and golden chips" fetchPriority="high" decoding="async" />
            </div>
            <div className="cm-lead__story">
              <h2 id="lead-title" className="cm-lead__title">
                Hot, fresh, <em>wrapped to go.</em>
              </h2>
              <p className="cm-lead__body">
                Everything is cooked when you order it. Call ahead and it'll be ready when you walk in.
              </p>
              <ul className="cm-facts">
                <li>Pickup only</li>
                <li>Open Mon–Sat</li>
                <li>Shop 3, 153 Smith Rd</li>
              </ul>
            </div>
          </div>
        </section>

        {favourites.length > 0 && (
          <section className="cm-section" aria-labelledby="favs-title">
            <header className="cm-section__head">
              <h2 id="favs-title" className="cm-section__title">
                Favourites
              </h2>
              <Link to="/menu" className="cm-inline-link">
                Full menu →
              </Link>
            </header>
            <div ref={favs} className="cm-gallery cm-gallery--3 cm-reveal">
              {favourites.map((item, i) => (
                <FavouriteCard key={item.id} item={item} index={i} />
              ))}
            </div>
            <PriceNotice />
          </section>
        )}
      </div>
    </>
  );
};

export default Home;
