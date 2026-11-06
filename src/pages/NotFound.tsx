import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useDocumentTitle } from "@/components/site/Broadsheet";

const NotFound = () => {
  useDocumentTitle("Page not found");
  const { pathname } = useLocation();

  return (
    <section className="cm-wrap cm-404">
      <hr className="cm-rule cm-rule--double" />
      <div className="cm-kicker cm-notice__kicker" style={{ marginTop: 24 }}>
        Stop the presses
      </div>
      <h1 className="cm-404__num" aria-label="Error 404">
        404
      </h1>
      <h2 className="cm-404__title">
        This page has been <em>recalled.</em>
      </h2>
      <p className="cm-subtitle">
        We couldn't find <code className="cm-mono">{pathname}</code>. It may have been eaten. The chips, however, are exactly
        where you left them.
      </p>
      <div className="cm-lead__actions">
        <Link to="/" className="cm-btn cm-btn--primary">
          Back to the front page <ArrowRight size={18} />
        </Link>
        <Link to="/menu" className="cm-btn">
          Read the menu
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
