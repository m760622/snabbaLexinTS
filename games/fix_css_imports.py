
import os
import glob
import re

games_dir = '/home/mohnada/Documents/Vipe/snabbaLexinTS/games'
style_link = '<link rel="stylesheet" href="../assets/css/style.css?v=global3d">'

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check if style.css is already linked
    if 'assets/css/style.css' in content:
        print(f"Skipping {filepath} (already present)")
        return

    # Find the best insertion point (before other css links or before </head>)
    # We want it to be likely the first CSS
    
    match = re.search(r'<link[^>]*rel=["\']stylesheet["\'][^>]*>', content)
    if match:
        # Insert before the first stylesheet link
        new_content = content[:match.start()] + style_link + '\n    ' + content[match.start():]
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        # Fallback to </head>
        head_end = content.find('</head>')
        if head_end != -1:
            new_content = content[:head_end] + style_link + '\n    ' + content[head_end:]
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filepath} (at head end)")
        else:
            print(f"Could not update {filepath} (no head/link found)")

files = glob.glob(os.path.join(games_dir, '*.html'))
for file in files:
    fix_file(file)
