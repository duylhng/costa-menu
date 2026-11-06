import { useEffect, useLayoutEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import SiteNav from "./components/site/SiteNav";
import SiteFooter from "./components/site/SiteFooter";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import "./styles/broadsheet.css";

/** New page → start at the top, unless the URL points at a section (e.g. /menu#snacks). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

function Shell() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Publish the sticky nav's height as a CSS variable so things can dock beneath it.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const nav = root?.querySelector<HTMLElement>(".cm-nav");
    if (!root || !nav) return;
    const set = () => root.style.setProperty("--site-nav-h", `${nav.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="cm">
      <a href="#main" className="cm-skip">
        Skip to content
      </a>
      <ScrollManager />
      <SiteNav />
      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <SiteFooter />
    </div>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
