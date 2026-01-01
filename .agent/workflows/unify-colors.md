---
description: Unify colors after any color change in TypeColorSystem
---

# Unify Word Type Colors

After modifying any color in `src/type-color-system.ts`, run these steps to ensure consistency:

## Steps

1. **Update TypeColorSystem** - Modify the color in `src/type-color-system.ts`

// turbo
2. **Replace old color in all CSS files**:

```bash
cd /home/mohnada/Documents/Vipe/snabbaLexinTS && find . -name "*.css" -exec sed -i 's/OLD_COLOR/NEW_COLOR/g' {} \;
```

// turbo
3. **Build the project**:

```bash
cd /home/mohnada/Documents/Vipe/snabbaLexinTS && npm run build
```

1. **Verify in browser** - Check that the color appears correctly in search results and details page

## Current Color Scheme

| Type | Badge | Color | Hex Code |
|------|-------|-------|----------|
| EN (noun) | EN | Turquoise | `#0d9488` |
| ETT (noun) | ETT | Light Green | `#16a34a` |
| Verb Gr.1 | GR. 1 | Light Red | `#f87171` |
| Verb Gr.2 | GR. 2 | Red | `#ef4444` |
| Verb Gr.3 | GR. 3 | Dark Red | `#dc2626` |
| Verb Gr.4 | GR. 4 | Darkest Red | `#b91c1c` |
| Adjective | ADJ | Blue | `#3b82f6` |
| Adverb | ADV | Orange | `#ea580c` |

## Files to Update

1. `src/type-color-system.ts` - TypeScript color definitions
2. `assets/css/search-cards.css` - Search card styles
3. `assets/css/details-premium.css` - Details page styles
4. `assets/css/style.css` - Main styles
