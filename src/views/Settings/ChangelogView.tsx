import React from 'react';
import { CHANGELOG_DATA } from './changelogData';
import '../../../assets/css/changelog.css';

interface ChangelogViewProps {
    onBack: () => void;
}

const ChangelogView: React.FC<ChangelogViewProps> = ({ onBack }) => {
    return (
        <div className="changelog-container" style={{ padding: '20px', paddingBottom: '100px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <button onClick={onBack} className="back-btn" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
                    ⬅️
                </button>
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Changelog</h1>
            </header>

            <div className="hero" style={{ textAlign: 'center', marginBottom: '40px', background: 'rgba(59, 130, 246, 0.1)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>📋 Nyheter</h2>
                <p style={{ color: '#aaa' }}>Alla uppdateringar och förbättringar</p>
                <div className="version-badge" style={{ marginTop: '15px', display: 'inline-block', padding: '5px 15px', background: '#3b82f6', borderRadius: '20px', fontWeight: 'bold' }}>v3.0.1</div>
            </div>

            <div className="timeline">
                {CHANGELOG_DATA.map((entry, index) => (
                    <div key={index} className="timeline-item" style={{ marginBottom: '40px', borderLeft: '2px solid rgba(59, 130, 246, 0.3)', paddingLeft: '25px', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-9px', top: '0', width: '16px', height: '16px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 10px #3b82f6' }}></div>
                        <span className="timeline-date" style={{ color: '#64748b', fontSize: '0.9rem' }}>{entry.date}</span>
                        <div className="timeline-version" style={{ fontWeight: 'bold', color: '#3b82f6', margin: '5px 0' }}>{entry.version}</div>
                        <div className="timeline-title" style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px' }}>
                            {entry.titleSv} <br />
                            <small style={{ color: '#aaa', fontWeight: 'normal' }}>{entry.titleAr}</small>
                        </div>
                        <ul className="change-list" style={{ listStyle: 'none', padding: 0 }}>
                            {entry.changes.map((change, i) => (
                                <li key={i} style={{ marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '1.2rem' }}>{getTypeIcon(change.type)}</span>
                                    <div>
                                        <strong style={{ display: 'block' }}>{change.sv} / {change.ar}</strong>
                                        {change.detailSv && <span style={{ fontSize: '0.9rem', color: '#aaa' }}>{change.detailSv}</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

function getTypeIcon(type: string) {
    switch (type) {
        case 'feature': return '✨';
        case 'improvement': return '🔧';
        case 'bugfix': return '🐛';
        case 'security': return '🔒';
        case 'performance': return '⚡';
        case 'test': return '✅';
        default: return '📌';
    }
}

export default ChangelogView;
