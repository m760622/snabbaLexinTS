"use client";

import ProfileView from '@/views/Profile/ProfileView';

export default function ProfilePage() {
    return (
        <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '120px', WebkitOverflowScrolling: 'touch' }}>
            <ProfileView />
        </div>
    );
}
