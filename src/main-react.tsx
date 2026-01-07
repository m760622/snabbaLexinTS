import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SettingsView from './SettingsView';
import { HomeView } from './HomeView';

// Mount Settings View (existing functionality)
const settingsRootElement = document.getElementById('settingsMenu');
if (settingsRootElement) {
  const settingsRoot = createRoot(settingsRootElement);
  settingsRoot.render(
    <StrictMode>
      <SettingsView />
    </StrictMode>
  );
}

// Mount Home View (new functionality)
const homeRootElement = document.getElementById('react-root');
if (homeRootElement) {
  const homeRoot = createRoot(homeRootElement);
  homeRoot.render(
    <StrictMode>
      <HomeView />
    </StrictMode>
  );
}