#!/usr/bin/env python3
"""
Script to update all game CSS files with the new 3D mobile toggle button styles.
This directly replaces the old .mobile-toggle-btn styles in each file.
"""
import os
import re
import glob

css_dir = '/home/mohnada/Documents/Vipe/snabbaLexinTS/assets/css'

# The new 3D styles to inject
NEW_STYLES = '''/* Mobile Toggle Button - 3D Keycap Style */
.mobile-toggle-btn,
#mobileToggle {
    background: linear-gradient(145deg, #1e1e2f, #151525) !important;
    border: none !important;
    border-radius: 12px !important;
    width: 44px !important;
    height: 44px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    color: rgba(255, 255, 255, 0.7) !important;
    padding: 0 !important;
    font-size: 20px !important;
    
    /* 3D Effect - Raised State */
    box-shadow: 
        5px 5px 10px rgba(0, 0, 0, 0.5),
        -2px -2px 6px rgba(255, 255, 255, 0.05),
        inset 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
        
    transition: all 0.15s ease !important;
    position: relative !important;
    margin-left: 0.5rem !important;
}

.mobile-toggle-btn:hover,
#mobileToggle:hover {
    color: #fff !important;
    transform: translateY(-1px) !important;
    box-shadow: 
        6px 6px 12px rgba(0, 0, 0, 0.6),
        -2px -2px 8px rgba(255, 255, 255, 0.08) !important;
}

.mobile-toggle-btn.active,
#mobileToggle.active {
    background: linear-gradient(145deg, #151525, #1e1e2f) !important;
    color: #4ade80 !important;
    
    /* 3D Effect - Pressed State */
    box-shadow: 
        inset 5px 5px 10px rgba(0, 0, 0, 0.6),
        inset -2px -2px 6px rgba(255, 255, 255, 0.05) !important;
        
    transform: translateY(2px) !important;
}

.mobile-toggle-btn svg,
#mobileToggle svg {
    width: 24px !important;
    height: 24px !important;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    transition: transform 0.3s ease;
}

.mobile-toggle-btn.active svg,
#mobileToggle.active svg {
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
    transform: scale(0.95);
}'''

def find_and_replace_mobile_toggle(content):
    """Find all .mobile-toggle-btn blocks and replace them."""
    
    # Pattern to find .mobile-toggle-btn { ... } blocks
    # This is a simple approach - find the selector and its content up to the closing brace
    pattern = r'/\*[^*]*Mobile[^*]*Toggle[^*]*\*/\s*\.mobile-toggle-btn\s*\{[^}]*\}'
    
    # Also find hover and active states
    patterns_to_remove = [
        r'\.mobile-toggle-btn\s*\{[^}]*\}',
        r'\.mobile-toggle-btn:hover\s*\{[^}]*\}',
        r'\.mobile-toggle-btn\.active\s*\{[^}]*\}',
        r'\.mobile-toggle-btn\s+svg\s*\{[^}]*\}',
        r'\.mobile-toggle-btn\.active\s+svg\s*\{[^}]*\}',
    ]
    
    modified = content
    found_any = False
    
    for pattern in patterns_to_remove:
        matches = list(re.finditer(pattern, modified, re.DOTALL))
        if matches:
            found_any = True
            for match in reversed(matches):  # Reverse to preserve indices
                modified = modified[:match.start()] + modified[match.end():]
    
    return modified, found_any

def process_file(filepath):
    """Process a single CSS file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file has .mobile-toggle-btn
    if '.mobile-toggle-btn' not in content:
        print(f"Skipping {os.path.basename(filepath)} (no .mobile-toggle-btn)")
        return False
    
    # Remove old styles
    modified, found = find_and_replace_mobile_toggle(content)
    
    if found:
        # Add new styles at the end of the file
        modified = modified.rstrip() + '\n\n' + NEW_STYLES + '\n'
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Updated {os.path.basename(filepath)}")
        return True
    else:
        print(f"No changes needed for {os.path.basename(filepath)}")
        return False

# Find all CSS files
css_files = glob.glob(os.path.join(css_dir, '*.css'))

updated_count = 0
for css_file in css_files:
    if process_file(css_file):
        updated_count += 1

print(f"\nDone! Updated {updated_count} files.")
