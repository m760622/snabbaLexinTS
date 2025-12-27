---
description: Apply the premium 2-dot border animation to a specific element
---
1. Ask the user which element (selector or description) they want to apply the animation to.
2. Locate the file containing that element (HTML or TS/JS).
3. Add the class `premium-border-animated` to the element's class list.
   - If it's an HTML file, add it to the `class` attribute.
   - If it's a TS/JS file creating an element, add `element.classList.add('premium-border-animated')`.
4. Verify that the element has `position: relative` (the class adds this, but check if it conflicts with existing styles).
5. Notify the user that the animation has been applied.
