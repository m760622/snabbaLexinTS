"use client";

import AddWordView from '@/views/Add/AddWordView';
import { useRouter } from 'next/navigation';

export default function AddPage() {
    const router = useRouter();
    return (
        <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '120px', WebkitOverflowScrolling: 'touch' }}>
            <AddWordView onBack={() => router.push('/')} />
        </div>
    );
}
