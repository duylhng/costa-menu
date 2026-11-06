import { Link } from "react-router-dom";
import { SHOP } from "@/data/menu";
import { HoursTable } from "./Broadsheet";

const SiteFooter = () => (
  <footer className="cm-colophon">
    <div className="cm-wrap">
      <div className="cm-colophon__grid">
        <div>
          <div className="cm-kicker">Trading hours</div>
          <h4>When the fryers are on</h4>
          <HoursTable />
        </div>
        <div>
          <div className="cm-kicker">Where to find us</div>
          <h4>Shop 3, 153 Smith Rd</h4>
          <p className="cm-fineprint">
            Woodridge, QLD 4114. Pickup only. Call ahead on{" "}
            <a href={SHOP.phoneHref} className="cm-inline-link">
              {SHOP.phoneDisplay}
            </a>{" "}
            and we'll have it wrapped and ready when you arrive. <Link to="/contact" className="cm-inline-link">Directions →</Link>
          </p>
        </div>
        <div>
          <div className="cm-kicker">The fine print</div>
          <h4>Corrections &amp; clarifications</h4>
          <p className="cm-fineprint">
            All prices on this website are a guide only and change often. In-store prices always apply. Please call to
            confirm current pricing. No newspapers were harmed in the making of this website, though several potatoes were.
          </p>
        </div>
      </div>

      <div className="cm-colophon__base">
        <span className="cm-colophon__wordmark" aria-hidden="true">
          Costa's
        </span>
        <div className="cm-colophon__meta cm-kicker">
          <span>© {new Date().getFullYear()} Costa's Takeaway</span>
          <nav aria-label="Footer">
            <Link to="/">Front page</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/contact">Find us</Link>
          </nav>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
