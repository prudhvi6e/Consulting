import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;
// Pre-rendered pages (scripts/prerender.mjs) ship real HTML; hydrate on top of it so the
// static content stays painted and no second render is needed. Attribute mismatches
// (animation inline styles) are tolerated by React; a structural mismatch falls back to a
// client render of the affected subtree.
if (document.documentElement.dataset.prerendered && root.hasChildNodes()) {
  hydrateRoot(root, <App />, { onRecoverableError: () => {} });
} else {
  createRoot(root).render(<App />);
}
