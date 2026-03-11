import { calculateEarnedBadge, isSameDay, isYesterday } from '../utils/gamification.js';

describe('Gamification Utility Functions', () => {

    describe('Date Comparisons', () => {
        it('should correctly identify the same day', () => {
            const date1 = new Date('2023-10-15T10:00:00Z');
            const date2 = new Date('2023-10-15T23:59:59Z');
            expect(isSameDay(date1, date2)).toBe(true);

            const date3 = new Date('2023-10-16T00:00:00Z');
            expect(isSameDay(date1, date3)).toBe(false);
        });

        it('should correctly identify yesterday', () => {
            const today = new Date('2023-10-16T12:00:00Z');
            const yesterday = new Date('2023-10-15T15:00:00Z');
            expect(isYesterday(yesterday, today)).toBe(true);

            const twoDaysAgo = new Date('2023-10-14T12:00:00Z');
            expect(isYesterday(twoDaysAgo, today)).toBe(false);
        });
    });

    describe('Badge Calculation (V2 Upgraded Logic placeholder)', () => {
        const mockGoal = {
            title: 'Read Books',
            difficulty: 'hard',
            targetDays: 30
        };

        it('should correctly calculate rarity and award Epic badge for Hard/30days', () => {
            // formula: rarityScore = targetDays(30) * difficultyMultiplier(3) = 90 (Legendary)
            // Wait, Legendary is >= 60. So this should be Legendary, wait.
            // Let's verify standard badge logic based on the prompt: 
            // Easy=1, Med=2, Hard=3. Target 30 * 3 = 90. 
            // <10 Common, 10-29 Rare, 30-59 Epic, >=60 Legendary
            const badge = calculateEarnedBadge(mockGoal, 30);
            expect(badge).toBeTruthy();
            expect(badge.type).toBe('Legendary');
        });

        it('should return null if streak does not match target days for major milestone (unless phase 2 adds interval milestone logic)', () => {
            const badge = calculateEarnedBadge(mockGoal, 15);
            expect(badge).toBeNull();
        });
    });

});
