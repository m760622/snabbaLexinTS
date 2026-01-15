import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HomeView } from './HomeView';

// Mount Home View
const homeRootElement = document.getElementById('react-root');
if (homeRootElement) {
  try {
    const homeRoot = createRoot(homeRootElement);
    homeRoot.render(
      <StrictMode>
        <HomeView />
      </StrictMode>
    );
  } catch (e) {
    console.error("[React] Failed to mount HomeView:", e);
  }
} else {
  console.error("[React] Error: Element #react-root not found!");
}