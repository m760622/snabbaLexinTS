"use client";

import LearnView from '@/views/Learn/LearnView';

export default function LearnPage() {
    return (
        <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '120px', WebkitOverflowScrolling: 'touch' }}>
            <LearnView />
        </div>
    );
}
