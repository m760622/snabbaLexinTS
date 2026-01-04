import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        welcome: './welcome.html',
        learn: './learn/learn.html',
        cognates: './learn/cognates.html',
        'asma-ul-husna': './learn/asma_ul_husna.html',
        ordsprak: './learn/ordsprak.html',
        details: './details.html',
        add: './add.html',
        changelog: './changelog.html',
        device: './device.html',
        profile: './profile.html',
        games: './games/games.html',
        'games-flashcards': './games/flashcards.html',
        'games-missing-word': './games/missing_word.html',
        'games-pronunciation': './games/pronunciation.html',
        'games-spelling': './games/spelling.html',
        'games-word-wheel': './games/word_wheel.html',
        'games-sentence-builder': './games/sentence_builder.html',
        'games-word-rain': './games/word_rain.html',
        'games-wordle': './games/wordle.html',
        'games-grammar': './games/grammar.html',
        // Temporarily removed due to duplicate function definitions in wordConnectGame.js
        // 'games-word-connect': './games/word_connect.html',
        // 'games-word-connect-v2': './games/word_connect_v2.html',
        'games-unblock-me': './games/unblock_me.html',
        'games-vowel-game': './games/vowel_game.html',
        'games-block-puzzle': './games/block_puzzle.html',
        'games-fill-blank': './games/fill_blank.html',
        'games-listening': './games/listening.html',
        'games-memory': './games/memory.html',
        'games-quran': './games/quran.html',
        'games-word-search': './games/word_search.html',
        'games-hangman': './games/hangman.html'
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
