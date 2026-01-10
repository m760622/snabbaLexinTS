import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserProfileService } from '../../services/user-profile.service';

describe('UserProfileService', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should return default profile if no storage exists', () => {
        const profile = UserProfileService.getProfile();
        expect(profile.name).toBe('Inlärare');
        expect(profile.xp).toBe(0);
    });

    it('should load profile from localStorage', () => {
        const mockProfile = {
            id: 'u1',
            name: 'TestUser',
            bio: 'Bio',
            avatar: '🚀',
            level: 5,
            xp: 500,
            streak: 10,
            joinedDate: '2023-01-01'
        };
        localStorage.setItem('snabbalexin_user_profile', JSON.stringify(mockProfile));

        const profile = UserProfileService.getProfile();
        expect(profile).toEqual(mockProfile);
    });

    it('should integrate legacy stats if profile missing but legacy keys exist', () => {
        localStorage.setItem('learn_xp', '100');
        localStorage.setItem('learn_level', '2');
        localStorage.setItem('learn_streak', '5');

        const profile = UserProfileService.getProfile();
        expect(profile.xp).toBe(100);
        expect(profile.level).toBe(2);
        expect(profile.streak).toBe(5);
        expect(profile.name).toBe('Inlärare'); // Default name
    });

    it('should update profile correctly', () => {
        const updated = UserProfileService.updateProfile({ name: 'NewName', xp: 50 });
        expect(updated.name).toBe('NewName');
        expect(updated.xp).toBe(50);
        
        const stored = JSON.parse(localStorage.getItem('snabbalexin_user_profile') || '{}');
        expect(stored.name).toBe('NewName');
    });

    it('should delete profile (reset to default)', () => {
        UserProfileService.updateProfile({ name: 'Changed' });
        UserProfileService.deleteProfile();
        
        const profile = UserProfileService.getProfile();
        expect(profile.name).toBe('Inlärare');
    });
});
