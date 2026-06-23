# GitHub Copilot System Instructions for LakshyaQALab

You are assisting with development on the **LakshyaQALab** project. Follow these rules at all times to avoid regressions and design mismatches:

## 🎯 1. Precise Scope Isolation (No Collateral Damage)

- **Surgical Edits Only**: Only change the specific lines of code that address the task. Do not rewrite whole files, components, or functions.
- **Maintain Existing UI/UX**: Do not touch, move, style, or remove existing layout components (like sidebars, floating widgets, buttons, headers) unless specifically asked.
- **Zero Loss of Functionality**: Do not delete, disable, or simplify existing modes, tabs, tools, or chaos widgets.

## 🎨 2. Styling & Design Integrity

- **Use Existing Theme Tokens**: Do not use raw HEX codes or basic Tailwind colors. Use custom theme variables in `src/index.css` (primary teal, secondary blue, accent green).
- **Use Defined CSS Classes**: Reuse the pre-defined utility classes in `src/index.css`:
  - Buttons: `.btn-primary` and `.btn-secondary`
  - Panels: `.glass-panel`, `.glass-card`, and `.dark-elegant-card`
  - Gradients: `.bg-gradient-elegant` and `.bg-gradient-accent-soft`
- **Typography & Motion**: Match `Poppins` for headers, `Inter` for body. Keep Framer Motion components intact.

## 🤖 3. QA Safeguards

- **Never modify existing `data-testid` attributes.** Modifying `data-testid` values breaks Playwright/Cypress automated tests.
- **Chaos Modes Preservation**: Do not disable Chaos Form Builder modes (Label Swap, Ghost Field, Field Shuffle, Infinite Spinner). They are intentional simulated features.
- **God Mode**: Keep simulated network errors (Offline, 500 Server, Slow 3G network delay) fully functional.
- **Unified QA Toolbox**: Keep the floating `QAToolsOverlay` (bottom-right) visible on all pages.

## 🛠️ 4. Execution

- Keep code lint-free (`npm run lint`) and formatted (`npm run format`).
- Ensure all tests pass (`npm run test`).
