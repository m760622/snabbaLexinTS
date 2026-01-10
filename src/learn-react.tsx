import React from 'react';
import { createRoot } from 'react-dom/client';
import LearnView from './views/Learn/LearnView';
import { LanguageManager } from './i18n';

// Initialize Language
LanguageManager.init();

// Find the main container in learn.html. 
// Currently learn.html has <main> with content. We will clear it and render React there.
// But wait, the header and dock are outside main.
// We should probably target the <main> tag.

const container = document.getElementById('root');

if (container) {
    // Container is empty by default in our new HTML
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <LearnView />
        </React.StrictMode>
    );
} else {
    console.error('Root container not found');
}
