import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// @ts-ignore
import FullSettings from './views/Settings/FullSettings';
import { HomeView } from './HomeView';

console.log("[React] Entry point starting...");

// Mount Settings View
const settingsRootElement = document.getElementById('settingsMenu');
if (settingsRootElement) {
  const settingsRoot = createRoot(settingsRootElement);
  settingsRoot.render(
    <StrictMode>
      <FullSettings onClose={() => {}} accentColor="#3b82f6" onAccentChange={() => {}} />
    </StrictMode>
  );
}

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