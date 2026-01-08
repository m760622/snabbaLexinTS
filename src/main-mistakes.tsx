import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MistakesView } from './MistakesView';

const container = document.getElementById('mistakes-react-root');
if (container) {
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <MistakesView />
        </StrictMode>
    );
}
