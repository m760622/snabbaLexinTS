"use client";

import GamesView from '@/views/Games/GamesView';

export default function GamesPage() {
    return (
        <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '120px', WebkitOverflowScrolling: 'touch' }}>
            <GamesView />
        </div>
    );
}
