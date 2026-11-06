import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { applyCachedPrices, loadLivePrices } from "./data/prices";
import "./index.css";

// Last-known live prices first (instant), then fetch fresh ones in the background.
applyCachedPrices();
createRoot(document.getElementById("root")!).render(<App />);
void loadLivePrices();
