import React, { useState } from 'react';
import { UserProfile, UserProfileService } from '../../services/user-profile.service';

interface EditProfileProps {
    profile: UserProfile;
    onSave: (updated: UserProfile) => void;
    onCancel: () => void;
}

const AVATARS = ['🎓', '🚀', '🌟', '🤖', '🐱', '🐶', '🦄', '🌍', '🧠', '⚡'];

const EditProfileView: React.FC<EditProfileProps> = ({ profile, onSave, onCancel }) => {
    const [name, setName] = useState(profile.name);
    const [bio, setBio] = useState(profile.bio);
    const [avatar, setAvatar] = useState(profile.avatar);

    const handleSave = () => {
        const updated = UserProfileService.updateProfile({
            name,
            bio,
            avatar
        });
        onSave(updated);
    };

    return (
        <div className="profile-edit-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: 'white' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Redigera Profil</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#ccc' }}>Avatar</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {AVATARS.map(emoji => (
                        <button
                            key={emoji}
                            onClick={() => setAvatar(emoji)}
                            style={{
                                fontSize: '2rem',
                                padding: '10px',
                                background: avatar === emoji ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                                border: avatar === emoji ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                width: '60px',
                                height: '60px'
                            }}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Namn</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(0,0,0,0.3)',
                        color: 'white',
                        fontSize: '1rem'
                    }}
                />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Bio</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(0,0,0,0.3)',
                        color: 'white',
                        fontSize: '1rem',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={onCancel}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Avbryt
                </button>
                <button
                    onClick={handleSave}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        background: '#3b82f6',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Spara
                </button>
            </div>
        </div>
    );
};

export default EditProfileView;
