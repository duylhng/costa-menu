import { Link } from "react-router-dom";
import { SHOP } from "@/data/menu";
import { HoursTable } from "./Broadsheet";

const SiteFooter = () => (
  <footer className="cm-colophon">
    <div className="cm-wrap">
      <div className="cm-colophon__grid">
        <div>
          <h4>Opening hours</h4>
          <HoursTable />
        </div>
        <div>
          <h4>Visit</h4>
          <p className="cm-colophon__visit">
            Shop 3, 153 Smith Rd
            <br />
            Woodridge QLD 4114
            <br />
            <a href={SHOP.phoneHref} className="cm-inline-link">
              {SHOP.phoneDisplay}
            </a>
          </p>
          <Link to="/contact" className="cm-inline-link">
            Map &amp; directions →
          </Link>
        </div>
      </div>

      <div className="cm-colophon__meta cm-kicker">
        <span>© {new Date().getFullYear()} Costa's Takeaway · Prices are a guide, in-store prices apply</span>
        <nav aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/contact">Find us</Link>
        </nav>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
