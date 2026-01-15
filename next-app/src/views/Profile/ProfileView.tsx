import React, { useState, useEffect } from 'react';
import { UserProfile, UserProfileService } from '../../services/user-profile.service';
import EditProfileView from './EditProfileView';
import '@/styles/profile.css';

interface ProfileViewProps {
    onBack?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onBack }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        const p = UserProfileService.getProfile();
        setProfile(p);
    };

    const handleSave = (updated: UserProfile) => {
        setProfile(updated);
        setIsEditing(false);
    };

    if (!profile) return null;

    if (isEditing) {
        return (
            <EditProfileView
                profile={profile}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <div className="profile-view-container" style={{ padding: '20px', paddingBottom: '100px', color: 'white', overflowY: 'auto', maxHeight: '100vh', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', overscrollBehavior: 'contain', willChange: 'scroll-position' }}>
            {onBack && (
                <button onClick={onBack} className="back-btn" style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', marginBottom: '1rem' }}>
                    ⬅️ Tillbaka
                </button>
            )}

            {/* Profile Hero */}
            <div className="profile-hero" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div className="avatar" style={{ fontSize: '4rem', marginBottom: '1rem' }}>{profile.avatar}</div>
                <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{profile.name}</h2>
                <p style={{ color: '#aaa', margin: '0' }}>{profile.bio}</p>
                <div className="level-badge" style={{ marginTop: '1rem', display: 'inline-block', padding: '5px 15px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', color: '#60a5fa' }}>
                    Nivå {profile.level} • {getLevelTitle(profile.level)}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '2rem' }}>
                <button
                    onClick={() => setIsEditing(true)}
                    style={{ padding: '8px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}
                >
                    ✏️ Redigera
                </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '2rem' }}>
                <div className="stat-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
                    <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{profile.streak}</div>
                    <div className="stat-label" style={{ fontSize: '0.8rem', color: '#aaa' }}>🔥 Streak</div>
                </div>
                <div className="stat-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
                    <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Math.floor(profile.xp / 10)}</div>
                    <div className="stat-label" style={{ fontSize: '0.8rem', color: '#aaa' }}>📖 Ord</div>
                </div>
                <div className="stat-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
                    <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{profile.xp}</div>
                    <div className="stat-label" style={{ fontSize: '0.8rem', color: '#aaa' }}>⭐ XP</div>
                </div>
            </div>

            {/* Achievements - Placeholder for visual completeness */}
            <div className="section-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px', marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0 }}>🏅 Prestationer</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                    {getAchievements(profile).map((ach, i) => (
                        <div key={i} style={{ textAlign: 'center', opacity: ach.unlocked ? 1 : 0.3 }}>
                            <div style={{ fontSize: '2rem' }}>{ach.icon}</div>
                            <div style={{ fontSize: '0.7rem' }}>{ach.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function getLevelTitle(level: number): string {
    if (level < 5) return 'Nybörjare';
    if (level < 10) return 'Lärling';
    if (level < 20) return 'Expert';
    return 'Mästare';
}

function getAchievements(profile: UserProfile) {
    return [
        { icon: '🚀', name: 'Start', unlocked: true },
        { icon: '⚡', name: 'Snabb', unlocked: profile.streak >= 3 },
        { icon: '🧠', name: 'Genius', unlocked: profile.level >= 5 },
        { icon: '🔥', name: 'On Fire', unlocked: profile.streak >= 7 },
        { icon: '🏆', name: 'Champ', unlocked: profile.level >= 10 },
        { icon: '📚', name: 'Bokmask', unlocked: profile.xp >= 500 }
    ];
}

export default ProfileView;
