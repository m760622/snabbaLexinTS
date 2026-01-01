/**
 * TypeColorSystem Tests
 * 
 * These tests ensure color consistency between:
 * 1. Word type detection (detect() function)
 * 2. CSS class generation (getGlowClass(), getGrammarClass())
 * 3. Expected color values
 * 
 * Run with: npm test
 */

import { describe, it, expect } from 'vitest';
import { TypeColorSystem, TypeColors } from '../type-color-system';

describe('TypeColorSystem', () => {

    // ============================================
    // WORD DETECTION TESTS
    // ============================================
    describe('detect() - Word Type Detection', () => {

        it('should detect En-words with explicit gender', () => {
            const result = TypeColorSystem.detect('subst.', 'bil', '', 'en');
            expect(result.type).toBe('en');
            expect(result.gender).toBe('en');
            expect(result.color.primary).toBe('#0d9488'); // Turquoise
        });

        it('should detect Ett-words with explicit gender', () => {
            const result = TypeColorSystem.detect('subst.', 'hus', '', 'ett');
            expect(result.type).toBe('ett');
            expect(result.gender).toBe('ett');
            expect(result.color.primary).toBe('#16a34a'); // Green
        });

        it('should detect verbs from forms', () => {
            const result = TypeColorSystem.detect('verb', 'arbeta', 'arbetar, arbetade, arbetat', '');
            expect(result.type).toBe('verb');
            expect(result.color.primary).toMatch(/^#(dc2626|f87171|ef4444|b91c1c)$/); // Red variants
        });

        it('should detect adjectives', () => {
            const result = TypeColorSystem.detect('adj.', 'stor', '', '');
            expect(result.type).toBe('adjective');
            expect(result.color.primary).toBe('#3b82f6'); // Blue
        });

        // === MORPHOLOGY TESTS (Suffix Detection) ===

        it('should infer En from -kassett suffix (Pengakassett)', () => {
            const result = TypeColorSystem.detect('JuridikR.', 'Pengakassett', '', '');
            expect(result.type).toBe('en');
            expect(result.color.primary).toBe('#0d9488'); // Turquoise
        });

        it('should infer Ett from -vitamin suffix (B12 - vitamin)', () => {
            const result = TypeColorSystem.detect('Med.', 'B12 - vitamin', '', '');
            expect(result.type).toBe('ett');
            expect(result.color.primary).toBe('#16a34a'); // Green
        });

        it('should infer Ett from -trakasserier suffix', () => {
            const result = TypeColorSystem.detect('HBTQ.', 'Sexuella trakasserier', '', '');
            expect(result.type).toBe('ett');
            expect(result.color.primary).toBe('#16a34a'); // Green
        });

        it('should infer En from -fond suffix (Allmänna arvsfonden)', () => {
            const result = TypeColorSystem.detect('Jur.', 'Allmänna arvsfonden', '', '');
            expect(result.type).toBe('en');
            expect(result.color.primary).toBe('#0d9488'); // Turquoise
        });

        it('should handle trailing spaces in word (Pengakassett )', () => {
            const result = TypeColorSystem.detect('JuridikR.', 'Pengakassett ', '', '');
            expect(result.type).toBe('en');
            expect(result.color.primary).toBe('#0d9488'); // Turquoise
        });

        // === ADJECTIVE SUFFIX TESTS ===

        it('should detect adjectives from -lig suffix', () => {
            const result = TypeColorSystem.detect('', 'trevlig', '', '');
            expect(result.type).toBe('adjective');
            expect(result.color.primary).toBe('#3b82f6'); // Blue
        });

        it('should detect adjectives from -isk suffix', () => {
            const result = TypeColorSystem.detect('', 'typisk', '', '');
            expect(result.type).toBe('adjective');
            expect(result.color.primary).toBe('#3b82f6'); // Blue
        });

        // === CLOSED CLASS TESTS ===

        it('should detect pronouns', () => {
            const result = TypeColorSystem.detect('', 'jag', '', '');
            expect(result.type).toBe('pronoun');
        });

        it('should detect prepositions', () => {
            const result = TypeColorSystem.detect('', 'på', '', '');
            expect(result.type).toBe('preposition');
        });

        it('should detect conjunctions', () => {
            const result = TypeColorSystem.detect('', 'och', '', '');
            expect(result.type).toBe('conjunction');
        });
    });

    // ============================================
    // GLOW CLASS GENERATION TESTS
    // ============================================
    describe('getGlowClass()', () => {

        it('should return glow-en for En-words', () => {
            const glowClass = TypeColorSystem.getGlowClass('subst.', 'bil', '', 'en');
            expect(glowClass).toBe('glow-en');
        });

        it('should return glow-ett for Ett-words', () => {
            const glowClass = TypeColorSystem.getGlowClass('subst.', 'hus', '', 'ett');
            expect(glowClass).toBe('glow-ett');
        });

        it('should return glow-verb for verbs', () => {
            const glowClass = TypeColorSystem.getGlowClass('verb', 'arbeta', 'arbetar, arbetade, arbetat', '');
            expect(glowClass).toBe('glow-verb');
        });

        it('should return glow-adjective for adjectives', () => {
            const glowClass = TypeColorSystem.getGlowClass('adj.', 'stor', '', '');
            expect(glowClass).toBe('glow-adjective');
        });

        // Suffix-based inference
        it('should return glow-en for -kassett words', () => {
            const glowClass = TypeColorSystem.getGlowClass('JuridikR.', 'Pengakassett', '', '');
            expect(glowClass).toBe('glow-en');
        });

        it('should return glow-ett for -vitamin words', () => {
            const glowClass = TypeColorSystem.getGlowClass('Med.', 'B12 - vitamin', '', '');
            expect(glowClass).toBe('glow-ett');
        });
    });

    // ============================================
    // GRAMMAR CLASS GENERATION TESTS
    // ============================================
    describe('getGrammarClass()', () => {

        it('should return grammar-en for En-words', () => {
            const grammarClass = TypeColorSystem.getGrammarClass('subst.', 'bil', '', 'en');
            expect(grammarClass).toBe('grammar-en');
        });

        it('should return grammar-ett for Ett-words', () => {
            const grammarClass = TypeColorSystem.getGrammarClass('subst.', 'hus', '', 'ett');
            expect(grammarClass).toBe('grammar-ett');
        });

        it('should return grammar-verb for verbs', () => {
            const grammarClass = TypeColorSystem.getGrammarClass('verb', 'arbeta', 'arbetar, arbetade, arbetat', '');
            expect(grammarClass).toMatch(/^grammar-verb/);
        });
    });

    // ============================================
    // COLOR CONSISTENCY TESTS
    // ============================================
    describe('TypeColors', () => {

        it('should have correct color for en', () => {
            expect(TypeColors.en.primary).toBe('#0d9488');
            expect(TypeColors.en.classToken).toBe('en');
        });

        it('should have correct color for ett', () => {
            expect(TypeColors.ett.primary).toBe('#16a34a');
            expect(TypeColors.ett.classToken).toBe('ett');
        });

        it('should have correct color for verb', () => {
            expect(TypeColors.verb.primary).toBe('#dc2626');
            expect(TypeColors.verb.classToken).toBe('verb');
        });

        it('should have correct color for adjective', () => {
            expect(TypeColors.adjective.primary).toBe('#3b82f6');
            expect(TypeColors.adjective.classToken).toBe('adjective');
        });
    });

    // ============================================
    // EDGE CASES
    // ============================================
    describe('Edge Cases', () => {

        it('should handle empty inputs gracefully', () => {
            const result = TypeColorSystem.detect('', '', '', '');
            expect(result).toBeDefined();
            expect(result.color).toBeDefined();
        });

        it('should handle null-like inputs', () => {
            // TypeScript prevents actual nulls, but test undefined behavior
            const result = TypeColorSystem.detect('subst.', '', '', '');
            expect(result).toBeDefined();
        });

        it('should prioritize explicit gender over morphology', () => {
            // Even if word ends in -hus (Ett suffix), explicit 'en' should win
            const result = TypeColorSystem.detect('subst.', 'gästhus', '', 'en');
            expect(result.type).toBe('en');
            expect(result.gender).toBe('en');
        });
    });
});
