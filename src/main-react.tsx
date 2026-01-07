import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SettingsView from './SettingsView';

const rootElement = document.getElementById('settingsMenu');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <SettingsView />
    </StrictMode>
  );
}
