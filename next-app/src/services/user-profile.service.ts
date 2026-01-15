export interface UserProfile {
    id: string;
    name: string;
    bio: string;
    avatar: string;
    level: number;
    xp: number;
    streak: number;
    joinedDate: string; // ISO string
}

const STORAGE_KEY = 'snabbalexin_user_profile';

export const UserProfileService = {
    // Default Profile
    defaultProfile: {
        id: 'user_1',
        name: 'Inlärare', // Learner
        bio: 'Jag lär mig svenska!',
        avatar: '🎓',
        level: 1,
        xp: 0,
        streak: 0,
        joinedDate: new Date().toISOString()
    } as UserProfile,

    // CREATE / READ
    getProfile(): UserProfile {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                // Merge with default to ensure all fields exist (schema migration)
                return { ...this.defaultProfile, ...JSON.parse(stored) };
            }
            
            // If checking existing stats from legacy keys
            const legacyXP = localStorage.getItem('learn_xp');
            if (legacyXP) {
                const legacyProfile = {
                    ...this.defaultProfile,
                    xp: parseInt(legacyXP) || 0,
                    level: parseInt(localStorage.getItem('learn_level') || '1'),
                    streak: parseInt(localStorage.getItem('learn_streak') || '0'),
                };
                this.saveProfile(legacyProfile);
                return legacyProfile;
            }

            // Save default if nothing exists
            this.saveProfile(this.defaultProfile);
            return this.defaultProfile;
        } catch (e) {
            console.error('Error loading profile', e);
            return this.defaultProfile;
        }
    },

    // UPDATE
    saveProfile(profile: UserProfile): boolean {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
            // Sync with legacy keys for backward compatibility if needed
            localStorage.setItem('learn_xp', profile.xp.toString());
            localStorage.setItem('learn_level', profile.level.toString());
            localStorage.setItem('learn_streak', profile.streak.toString());
            return true;
        } catch (e) {
            console.error('Error saving profile', e);
            return false;
        }
    },

    updateProfile(updates: Partial<UserProfile>): UserProfile {
        const current = this.getProfile();
        const updated = { ...current, ...updates };
        this.saveProfile(updated);
        return updated;
    },

    // DELETE
    deleteProfile(): void {
        localStorage.removeItem(STORAGE_KEY);
        // Optional: Clear legacy keys? 
        // localStorage.removeItem('learn_xp');
        // ... keeping them might be safer for now unless explicit "Full Reset" requested
        this.saveProfile(this.defaultProfile); // Reset to default
    }
};
