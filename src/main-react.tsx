import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HomeView } from './HomeView';

console.log("[React] Entry point starting...");

// Mount Home View
const homeRootElement = document.getElementById('react-root');
if (homeRootElement) {
  console.log("[React] Found #react-root, mounting HomeView...");
  try {
    const homeRoot = createRoot(homeRootElement);
    homeRoot.render(
      <StrictMode>
        <HomeView />
      </StrictMode>
    );
    console.log("[React] HomeView render initiated.");
  } catch (e) {
    console.error("[React] Failed to mount HomeView:", e);
  }
} else {
  console.error("[React] Error: Element #react-root not found!");
}