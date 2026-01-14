import React, { useState } from 'react';
import FlashcardsGame from './Flashcards/FlashcardsGame';
import HangmanGame from './Hangman/HangmanGame';
import WordSearchGame from './WordSearch/WordSearchGame';
import MemoryGame from './Memory/MemoryGame';
import WordleGame from './Wordle/WordleGame';
import BlockPuzzleGame from './BlockPuzzle/BlockPuzzleGame';
import UnblockMeGame from './UnblockMe/UnblockMeGame';
import FifteenPuzzleGame from './FifteenPuzzle/FifteenPuzzleGame';
import VowelGame from './VowelGame/VowelGame';
import WordConnectGame from './WordConnect/WordConnectGame';
import GrammarGame from './Grammar/GrammarGame';
import ListeningGame from './Listening/ListeningGame';
import SpellingGame from './Spelling/SpellingGame';
import SentenceBuilderGame from './SentenceBuilder/SentenceBuilderGame';
import MissingWordGame from './MissingWord/MissingWordGame';
import WordRainGame from './WordRain/WordRainGame';
import FillBlankGame from './FillBlank/FillBlankGame';
import PronunciationGame from './Pronunciation/PronunciationGame';
import WordWheelGame from './WordWheel/WordWheelGame';
import { HapticManager } from '../../utils/utils';

const GAMES = [
    { id: 'flashcards', name: 'Minneskort', ar: 'بطاقات الذاكرة', icon: '🃏', description: 'Träna ord med repetitionsmetod' },
    { id: 'hangman', name: 'Hänga Gubbe', ar: 'الرجل المشنوق', icon: '👤', description: 'Gissa ordet innan gubben hängs' },
    { id: 'word_search', name: 'Ordsök', ar: 'بحث عن الكلمات', icon: '🔍', description: 'Hitta gömda ord i rutnätet' },
    { id: 'wordle', name: 'Ordpussel', ar: 'ووردل', icon: '🧩', description: 'Gissa ordet på 6 försök' },
    { id: 'grammar', name: 'Grammatik', ar: 'قواعد اللغة', icon: '📖', description: 'Träna på svensk grammatik' },
    { id: 'sentence_builder', name: 'Bygg Meningen', ar: 'بناء الجملة', icon: '🏗️', description: 'Sätt orden i rätt ordning' },
    { id: 'missing_word', name: 'Gissa Ordet', ar: 'خمن الكلمة', icon: '❓', description: 'Hitta det saknade ordet' },
    { id: 'fill_blank', name: 'Fyll i luckan', ar: 'أكمل الفراغ', icon: '✏️', description: 'Välj rätt ord i meningen' },
    { id: 'word_wheel', name: 'Ord Hjulet', ar: 'عجلة الكلمات', icon: '🎡', description: 'Hitta ordet i hjulet' },
    { id: 'spelling', name: 'Skriv Ordet', ar: 'اكتب الكلمة', icon: '✍️', description: 'Öva på att stava ord' },
    { id: 'listening', name: 'Lyssna', ar: 'اختبار السمع', icon: '🎧', description: 'Hör och skriv ordet' },
    { id: 'pronunciation', name: 'Uttal', ar: 'النطق', icon: '🎙️', description: 'Öva på ditt uttal' },
    { id: 'word_rain', name: 'Ordregn', ar: 'مطر الكلمات', icon: '🌧️', description: 'Skriv orden innan de faller' },
    { id: 'word_connect', name: 'Bokstavlänk', ar: 'ربط الحروف', icon: '🔗', description: 'Koppla ihop bokstäver till ord' },
    { id: 'vowel_game', name: 'Vokalspel', ar: 'لعبة الحروف', icon: '🔤', description: 'Träna på svenska vokaler' },
    { id: 'memory', name: 'Memory', ar: 'الذاكرة', icon: '🧠', description: 'Matcha ordpar' },
    { id: 'block_puzzle', name: 'Block Pussel', ar: 'لغز المكعبات', icon: '🧱', description: 'Fyll rutnätet med block' },
    { id: 'unblock_me', name: 'Lås Upp', ar: 'فك القفل', icon: '🔓', description: 'Flytta blocken till utgången' },
    { id: 'fifteen_puzzle', name: '15 Pussel', ar: 'لعبة الأرقام', icon: '🔢', description: 'Ordna siffrorna i rätt ordning' },
];

const GamesView: React.FC = () => {
    const [activeGame, setActiveGame] = useState<string | null>(null);

    const handleGameSelect = (gameId: string) => {
        HapticManager.light();
        setActiveGame(gameId);
    };

    const handleBack = () => {
        setActiveGame(null);
    };

    if (activeGame === 'flashcards') {
        return <FlashcardsGame onBack={handleBack} />;
    }

    if (activeGame === 'hangman') {
        return <HangmanGame onBack={handleBack} />;
    }

    if (activeGame === 'word_search') {
        return <WordSearchGame onBack={handleBack} />;
    }

    if (activeGame === 'wordle') {
        return <WordleGame onBack={handleBack} />;
    }

    if (activeGame === 'grammar') {
        return <GrammarGame onBack={handleBack} />;
    }

    if (activeGame === 'sentence_builder') {
        return <SentenceBuilderGame onBack={handleBack} />;
    }

    if (activeGame === 'missing_word') {
        return <MissingWordGame onBack={handleBack} />;
    }

    if (activeGame === 'fill_blank') {
        return <FillBlankGame onBack={handleBack} />;
    }

    if (activeGame === 'word_wheel') {
        return <WordWheelGame onBack={handleBack} />;
    }

    if (activeGame === 'spelling') {
        return <SpellingGame onBack={handleBack} />;
    }

    if (activeGame === 'listening') {
        return <ListeningGame onBack={handleBack} />;
    }

    if (activeGame === 'pronunciation') {
        return <PronunciationGame onBack={handleBack} />;
    }

    if (activeGame === 'word_rain') {
        return <WordRainGame onBack={handleBack} />;
    }

    if (activeGame === 'word_connect') {
        return <WordConnectGame onBack={handleBack} />;
    }

    if (activeGame === 'vowel_game') {
        return <VowelGame onBack={handleBack} />;
    }

    if (activeGame === 'memory') {
        return <MemoryGame onBack={handleBack} />;
    }

    if (activeGame === 'block_puzzle') {
        return <BlockPuzzleGame onBack={handleBack} />;
    }

    if (activeGame === 'unblock_me') {
        return <UnblockMeGame onBack={handleBack} />;
    }

    if (activeGame === 'fifteen_puzzle') {
        return <FifteenPuzzleGame onBack={handleBack} />;
    }

    if (activeGame) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <button onClick={handleBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'white' }}>⬅️</button>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Kommer snart!</h2>
                    <p style={{ color: '#aaa' }}>Spelet "{activeGame}" är under utveckling.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', paddingBottom: '100px', color: 'white', overflowY: 'auto', maxHeight: '100vh', WebkitOverflowScrolling: 'touch' as any, touchAction: 'pan-y' as any, overscrollBehavior: 'contain', willChange: 'scroll-position' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', textAlign: 'center', color: '#fbbf24' }}>Spelzon</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                {GAMES.map(game => (
                    <div
                        key={game.id}
                        onClick={() => handleGameSelect(game.id)}
                        style={{
                            background: 'rgba(30, 41, 59, 0.6)',
                            borderRadius: '24px',
                            padding: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            transition: 'transform 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            touchAction: 'pan-y' as any
                        }}
                    >
                        <div style={{ fontSize: '3rem' }}>{game.icon}</div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{game.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '4px' }}>{game.ar}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GamesView;
