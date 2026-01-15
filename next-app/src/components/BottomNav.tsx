"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BottomNav() {
    const pathname = usePathname();
    const [accentColor, setAccentColor] = useState('#3b82f6');

    useEffect(() => {
        const saved = localStorage.getItem('accentColor');
        if (saved) setAccentColor(saved);
        // Listen for color changes if we want to be reactive
        const handleStorage = () => {
            const newColor = localStorage.getItem('accentColor');
            if (newColor) setAccentColor(newColor);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const tabs = [
        { id: 'search', icon: '🔍', path: '/' },
        { id: 'games', icon: '🎮', path: '/games' },
        { id: 'learn', icon: '📚', path: '/learn' },
        { id: 'add', icon: '➕', path: '/add' },
        { id: 'profile', icon: '👤', path: '/profile' },
        { id: 'settings', icon: '⚙️', path: '/settings' },
    ];

    // Hide dock on splash screen (handled by parent usually, but just in case)
    // Also hide if we are in a sub-route that should be full screen? 
    // For now, show everywhere except maybe hidden by layout logic.

    return (
        <div style={styles.dockContainer}>
            <div style={styles.dock}>
                {tabs.map(tab => {
                    // Check active state. For Home (/), exact match. For others, startsWith.
                    const isActive = tab.path === '/'
                        ? pathname === '/'
                        : pathname.startsWith(tab.path);

                    return (
                        <Link key={tab.id} href={tab.path} style={{
                            ...styles.dockItem,
                            backgroundColor: isActive ? `${accentColor}33` : 'transparent',
                            color: isActive ? accentColor : '#fff',
                            transform: isActive ? 'scale(1.1) translateY(-5px)' : 'scale(1)'
                        }}>
                            {tab.icon}
                            {isActive && <div style={{ position: 'absolute', bottom: '5px', width: '4px', height: '4px', borderRadius: '50%', background: accentColor }} />}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    dockContainer: { position: 'fixed', bottom: '20px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 300 },
    dock: { display: 'flex', background: 'var(--bg-glass-strong)', backdropFilter: 'blur(20px)', padding: '10px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)', gap: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
    dockItem: { width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', borderRadius: '15px', cursor: 'pointer', border: 'none', color: '#fff', background: 'transparent', position: 'relative', transition: 'all 0.3s' }
};
