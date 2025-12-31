# SnabbaLexinTS

An interactive, gamified language learning application for Swedish and Arabic speakers. This project uses TypeScript, Vite, and modern web technologies to provide a rich educational experience.

## 🚀 Features

* **Dictionary & Translation:** Fast lookup between Swedish and Arabic.
* **Interactive Games:**
  * **Memory Game:** Match pairs of words.
  * **Hangman:** Guess the word.
  * **Word Connect:** Link letters to form words.
  * **Word Search:** Find hidden words in a grid.
  * **Fill in the Blanks:** Complete sentences.
  * **Sentence Builder:** Arrange words to form correct sentences.
* **Quranic Learning:** dedicated sections for Quranic vocabulary and *Asma Ul Husna*.
* **Gamification:** XP system, levels, streaks, and achievements.
* **Premium Design:** Glassmorphism UI, themes (Dark/Light), and smooth animations.

## 🛠️ Tech Stack

* **Language:** TypeScript / HTML5 / CSS3
* **Build Tool:** Vite
* **Styling:** Native CSS with Variables (No frameworks like Tailwind, ensuring custom premium design).
* **Icons:** SVG & Google Fonts

## 🎨 Design & Typography Rules

### 1. Primary Fonts (الخطوط الأساسية)

* **Latin Scripts (English / Swedish):**
  * **Font:** **Inter**
  * **Usage:** Used for all English and Swedish text, including headers, body text, and UI elements.
  * **Weights:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold).

* **Arabic Script (العربية):**
  * **Font:** **Tajawal** (تجوال)
  * **Usage:** Used for all standard Arabic text, UI elements, buttons, and general content.
  * **Weights:** 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold).

### 2. Special Fonts (خطوط خاصة)

* **Quranic Text (النصوص القرآنية):**
  * **Font:** **Amiri** (أمييري)
  * **Usage:** Exclusively for Quranic verses, *Asma Ul Husna*, and religious text to maintain traditional calligraphy aesthetics.
  * **Fallback:** `serif`.
* **Quranic Text (النصوص القرآنية):**
  * **Font:** **Amiri** (أمييري)
  * **Usage:** Exclusively for Quranic verses, *Asma Ul Husna*, and religious text to maintain traditional calligraphy aesthetics.
  * **Fallback:** `serif`.

### 3. Deprecated Fonts (خطوط محظورة)

The following fonts have been removed and should **NOT** be introduced back:

* ❌ `Outfit`, `Poppins`, `Orbitron` (Replaced by **Inter**)
* ❌ `Cairo`, `Noto Sans Arabic`, `IBM Plex Sans Arabic` (Replaced by **Tajawal**)

## 🎨 UI Components & Design System

### Filter Chips (أزرار التصفية)

Located in the **Learn** section, these chips use a semantic color-coded system to categorized words visually:

* **Design:** Pill-shaped buttons with colored borders and transparent backgrounds.
* **Active State:** When selected, the background fills with a faint semantic color, and the border glows.
* **Color Coding:**
  * **Nouns (Substantiv):** <span style="color: #fca5a5">Red/Pink</span> - Representing objects and implementation.
  * **Verbs (Verb):** <span style="color: #86efac">Green</span> - Representing action and movement.
  * **Adjectives (Adjektiv):** <span style="color: #93c5fd">Blue</span> - Describing properties.
  * **Common Phrases:** <span style="color: #fcd34d">Gold/Yellow</span> - Essential daily expressions.

This system helps users quickly identify word types at a glance without reading the labels.

## 📦 Setup & Run

1. **Install Dependencies:**

    ```bash
    npm install
    ```

2. **Start Development Server:**

    ```bash
    npm run dev
    ```

3. **Build for Production:**

    ```bash
    npm run build
    ```

## 📂 Project Structure

```
.
├── assets/             # Static assets (CSS, Images, Audio)
│   ├── css/            # Global styles & Component styles
│   └── images/         # SVGs and icons
├── games/              # HTML entry points for individual games
├── learn/              # Learning modules (Cognates, Lists)
├── src/                # TypeScript Source Code
│   ├── games/          # Game logic implementations
│   ├── utils/          # Helper functions (XP, Sound, Text)
│   ├── data/           # Dictionary and word data
│   └── i18n.ts         # Localization setup
└── dist/               # Production build output
```

## 🌍 Localization (i18n)

The app supports **Swedish** (sv) and **Arabic** (ar).

* **Strings:** Managed in `src/i18n.ts`.
* **Directionality:** Automatically handles LTR/RTL switching based on selected language.
* **Bilingual Mode:** Uses extensive CSS logic (`body.lang-ar`, `body.lang-sv`) to toggle visibility of translated elements.

## 🎮 Game Engine & State

* **State Management:** Uses a custom `GameState` interface to track score, levels, and progress.
* **XP System:** Centralized XP handling (`xpSystem.ts`) that persists progress to `localStorage`.
* **Audio:** Sound manager (`sound-utils.ts`) handles SFX and TTS (Text-to-Speech) for pronuncations.
