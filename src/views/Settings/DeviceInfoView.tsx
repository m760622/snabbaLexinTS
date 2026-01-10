import React, { useState, useEffect } from 'react';
import '../../../assets/css/device.css';

interface DeviceInfoViewProps {
    onBack: () => void;
}

const DeviceInfoView: React.FC<DeviceInfoViewProps> = ({ onBack }) => {
    const [info, setInfo] = useState<any>({});
    const [battery, setBattery] = useState<any>(null);

    const loadInfo = () => {
        const ua = navigator.userAgent;
        
        // Basic Info
        const browser = getBrowser(ua);
        const os = getOS(ua);
        const screen = `${window.screen.width} × ${window.screen.height} px`;
        const ratio = window.devicePixelRatio || 1;
        
        setInfo({
            browser,
            os,
            screen,
            ratio: `${ratio}x (${ratio > 1 ? 'Retina' : 'Standard'})`,
            lang: navigator.language,
            cores: navigator.hardwareConcurrency || 'Unknown',
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
            online: navigator.onLine ? 'Online' : 'Offline',
            platform: navigator.platform,
            touch: ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? '✅ Stöds' : '❌ Stöds ej'
        });

        // Battery
        if ('getBattery' in (navigator as any)) {
            (navigator as any).getBattery().then((b: any) => {
                setBattery({
                    level: Math.round(b.level * 100),
                    charging: b.charging
                });
            });
        }
    };

    useEffect(() => {
        loadInfo();
        window.addEventListener('online', loadInfo);
        window.addEventListener('offline', loadInfo);
        return () => {
            window.removeEventListener('online', loadInfo);
            window.removeEventListener('offline', loadInfo);
        };
    }, []);

    return (
        <div className="device-info-container" style={{ padding: '20px', paddingBottom: '100px', color: 'white', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <button onClick={onBack} className="back-btn" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
                    ⬅️
                </button>
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Enhetsinformation</h1>
            </header>

            <div className="device-visual" style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div className="device-icon" style={{ fontSize: '5rem', marginBottom: '10px' }}>💻</div>
                <div className="device-name" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#06b6d4' }}>{info.browser}</div>
                <div className="device-type" style={{ color: '#aaa' }}>{info.os}</div>
            </div>

            <div className="stats-grid" style={{ display: 'grid', gap: '15px' }}>
                <StatCard icon="🌐" label="Webbläsare" value={info.browser} />
                <StatCard icon="⚙️" label="Operativsystem" value={info.os} />
                <StatCard icon="📐" label="Skärmstorlek" value={info.screen} />
                <StatCard icon="🔍" label="Pixeltäthet" value={info.ratio} />
                {battery && (
                    <div className="stat-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '20px', borderLeft: '4px solid #22c55e' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa', fontSize: '0.9rem', marginBottom: '10px' }}>
                            <span>🔋</span> <span>Batteri</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ width: `${battery.level}%`, height: '100%', background: '#22c55e' }}></div>
                            </div>
                            <span style={{ fontWeight: 'bold' }}>{battery.level}% {battery.charging && '⚡'}</span>
                        </div>
                    </div>
                )}
                <StatCard icon="📶" label="Nätverk" value={info.online} />
                <StatCard icon="🌍" label="Språk" value={info.lang} />
                <StatCard icon="🧠" label="CPU-kärnor" value={info.cores} />
                <StatCard icon="🕐" label="Tidszon" value={info.tz} />
            </div>

            <button className="refresh-btn" onClick={loadInfo} style={{ marginTop: '30px', width: '100%', padding: '15px', borderRadius: '15px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                🔄 Uppdatera
            </button>
        </div>
    );
};

const StatCard = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
    <div className="stat-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '20px', borderLeft: '4px solid #3b82f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa', fontSize: '0.9rem', marginBottom: '5px' }}>
            <span>{icon}</span> <span>{label}</span>
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{value}</div>
    </div>
);

function getBrowser(ua: string) {
    if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return 'Google Chrome';
    if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
    if (/Firefox/i.test(ua)) return 'Firefox';
    if (/Edg/i.test(ua)) return 'Microsoft Edge';
    return 'Webbläsare';
}

function getOS(ua: string) {
    if (/Windows/i.test(ua)) return 'Windows';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    if (/Android/i.test(ua)) return 'Android';
    if (/Macintosh/i.test(ua)) return 'macOS';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Operativsystem';
}

export default DeviceInfoView;
