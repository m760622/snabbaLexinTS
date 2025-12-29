#!/usr/bin/env python3
"""
Refactor games to use centralized title-styles.css

This script:
1. Adds <link rel="stylesheet" href="../assets/css/title-styles.css"> to each game HTML
2. Updates .game-title classes to use the centralized styles
"""

import os
import re
import glob

games_dir = '/home/mohnada/Documents/Vipe/snabbaLexinTS/games'
css_dir = '/home/mohnada/Documents/Vipe/snabbaLexinTS/assets/css'
title_css_link = '<link rel="stylesheet" href="../assets/css/title-styles.css">'

# Map of which style each game should use
STYLE_MAP = {
    'fill_blank.html': 'title-floating-bounce',
    'word_search.html': 'title-neon-search',
    'vowel_game.html': 'title-simple-dark',
    'listening.html': 'title-simple-dark',
    'memory.html': 'title-simple-dark',
    'fifteen_puzzle.html': 'title-simple-dark',
    'spelling.html': 'title-simple-dark',
    'grammar.html': 'title-simple-dark',
    'hangman.html': 'title-simple-dark',
    'flashcards.html': 'title-simple-dark',
    'wordle.html': 'title-simple-dark',
    'pronunciation.html': 'title-simple-dark',
    'sentence_builder.html': 'title-simple-dark',
    'missing_word.html': 'title-simple-dark',
    'word_rain.html': 'title-simple-dark',
    'word_connect.html': 'title-simple-dark',
    'word_wheel.html': 'title-simple-dark',
    'block_puzzle.html': 'title-neon-search',
    'unblock_me.html': 'title-simple-dark',
    'quran.html': 'title-simple-dark',
}

def add_title_css_link(filepath):
    """Add title-styles.css link to HTML file if not present."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'title-styles.css' in content:
        return False  # Already has the link
    
    # Find the best place to insert (before </head> or after last <link>)
    head_end = content.find('</head>')
    if head_end != -1:
        new_content = content[:head_end] + '    ' + title_css_link + '\n' + content[head_end:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def update_game_title_class(filepath, new_class):
    """Update the game-title element to include the new centralized class."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to find class="game-title" or class="game-title ..."
    # Replace with class="game-title new_class"
    pattern = r'class="game-title"'
    replacement = f'class="game-title {new_class}"'
    
    if pattern in content and new_class not in content:
        new_content = content.replace(pattern, replacement)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

# Process all HTML files
html_files = glob.glob(os.path.join(games_dir, '*.html'))
updated_count = 0

for html_file in html_files:
    filename = os.path.basename(html_file)
    
    # Skip games.html (main menu, different structure)
    if filename == 'games.html':
        continue
    
    # Add CSS link
    if add_title_css_link(html_file):
        print(f"Added title-styles.css link to {filename}")
        updated_count += 1
    
    # Update class if we have a mapping
    if filename in STYLE_MAP:
        if update_game_title_class(html_file, STYLE_MAP[filename]):
            print(f"Updated title class in {filename} to use {STYLE_MAP[filename]}")

print(f"\nDone! Updated {updated_count} files with title-styles.css link.")
