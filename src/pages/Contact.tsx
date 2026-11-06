import { useState, type CSSProperties } from "react";
import { ExternalLink, MapPin, Navigation, Phone } from "lucide-react";
import { SHOP } from "@/data/menu";
import { PageHead, useDocumentTitle } from "@/components/site/Broadsheet";
import { useReveal } from "@/components/site/hooks";

const MAP_QUERY = encodeURIComponent("153 Smith Rd, Woodridge QLD 4114");
const MAP_EMBED = `https://maps.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`;
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;

const Contact = () => {
  useDocumentTitle("Find us");
  const reveal = useReveal<HTMLDivElement>();
  // The map iframe is heavy (≈1MB of Google scripts), so it only loads when asked for.
  const [mapOn, setMapOn] = useState(false);

  return (
    <>
      <PageHead title={<>Find <em>us</em></>}>Shop 3, 153 Smith Rd, Woodridge. Pickup only.</PageHead>

      <div className="cm-wrap">
        <section className="cm-section" aria-label="Location and contact details">
          <div ref={reveal} className="cm-findus cm-reveal">
            <div className="cm-map" style={{ "--i": 0 } as CSSProperties}>
              {mapOn ? (
                <iframe
                  title="Map showing Costa's Takeaway, 153 Smith Rd, Woodridge"
                  src={MAP_EMBED}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <button type="button" className="cm-map__placeholder" onClick={() => setMapOn(true)}>
                  <span className="cm-map__pin" aria-hidden="true">
                    <MapPin size={30} />
                  </span>
                  <span className="cm-map__label">
                    <b>153 Smith Rd, Woodridge</b>
                    <span className="cm-kicker">Tap to load the map</span>
                  </span>
                </button>
              )}
            </div>

            <div className="cm-findus__details">
              <div className="cm-classified cm-box" style={{ "--i": 1 } as CSSProperties}>
                <h3>Shop 3, 153 Smith Rd</h3>
                <p className="cm-fineprint" style={{ fontStyle: "normal" }}>
                  Woodridge, QLD 4114
                </p>
                <div className="cm-lead__actions">
                  <a href={DIRECTIONS} target="_blank" rel="noreferrer" className="cm-btn cm-btn--primary">
                    <Navigation size={16} /> Directions
                  </a>
                  <a href={`https://maps.google.com/?q=${MAP_QUERY}`} target="_blank" rel="noreferrer" className="cm-btn">
                    Open in Maps <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="cm-classified cm-box" style={{ "--i": 2 } as CSSProperties}>
                <h3>Call to order</h3>
                <a href={SHOP.phoneHref} className="cm-bigphone">
                  <Phone size={22} /> {SHOP.phoneDisplay}
                </a>
                <p className="cm-fineprint">We'll have it ready when you arrive. No delivery.</p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Contact;
