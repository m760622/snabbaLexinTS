import React from 'react';
import { CHANGELOG_DATA } from './changelogData';
import '@/styles/changelog.css';

interface ChangelogViewProps {
    onBack: () => void;
}

const ChangelogView: React.FC<ChangelogViewProps> = ({ onBack }) => {
    return (
        <div className="changelog-page">
            {/* Sticky Header with Blur */}
            <header className="changelog-header">
                <button onClick={onBack} className="changelog-back-btn" aria-label="Go back">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>عودة</span>
                </button>
                <h1 className="changelog-header-title">Nyheter</h1>
                <div className="changelog-header-spacer"></div>
            </header>

            {/* Scrollable Content Area */}
            <div className="changelog-content">
                {/* Hero Section */}
                <div className="changelog-hero">
                    <div className="changelog-hero-icon">📋</div>
                    <h2 className="changelog-hero-title">Nyheter</h2>
                    <p className="changelog-hero-subtitle">Alla uppdateringar och förbättringar</p>
                    <p className="changelog-hero-subtitle-ar">جميع التحديثات والتحسينات</p>
                    <div className="changelog-version-badge">
                        {CHANGELOG_DATA[0]?.version || 'v3.0.0'}
                    </div>
                </div>

                {/* Timeline */}
                <div className="changelog-timeline">
                    {CHANGELOG_DATA.map((entry, index) => (
                        <div
                            key={index}
                            className="changelog-timeline-item"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="changelog-timeline-dot"></div>
                            <div className="changelog-timeline-card">
                                <span className="changelog-date">{entry.date}</span>
                                <div className="changelog-version">{entry.version}</div>
                                <div className="changelog-title">
                                    <span className="changelog-title-sv">{entry.titleSv}</span>
                                    <span className="changelog-title-ar">{entry.titleAr}</span>
                                </div>
                                <ul className="changelog-changes">
                                    {entry.changes.map((change, i) => (
                                        <li key={i} className="changelog-change-item">
                                            <span className="changelog-change-icon">{getTypeIcon(change.type)}</span>
                                            <div className="changelog-change-content">
                                                <strong className="changelog-change-label">
                                                    {change.sv} / <span className="ar-text">{change.ar}</span>
                                                </strong>
                                                {change.detailSv && (
                                                    <span className="changelog-change-detail">{change.detailSv}</span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Safe Area Spacer */}
                <div className="changelog-safe-area"></div>
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
