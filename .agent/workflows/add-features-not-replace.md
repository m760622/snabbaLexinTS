---
description: When adding new features, never replace existing ones - add alongside them
---

# Adding New Features Without Replacing Existing Ones

When the user requests to **add** or **create** a new feature (quiz, mode, view, etc.), you must:

1. **NEVER replace** existing functionality
2. **ADD the new feature alongside** the existing one
3. Ask for clarification if the request is ambiguous

## Examples

### ❌ Wrong

- User: "Create a new quiz"
- Agent: *Replaces the existing quiz with a new one*

### ✅ Correct

- User: "Create a new quiz"
- Agent: *Adds a new quiz mode while keeping the existing quiz intact*
- Both quizzes are accessible from the UI (e.g., different tabs or buttons)

## Implementation Pattern

- Add new mode tabs/buttons for the new feature
- Keep existing functions and add new ones with different names
- Update the HTML to include navigation between both features
