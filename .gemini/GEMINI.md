---
name: lakshya-qa-rules
description: Strict guidelines for editing LakshyaQALab to avoid regressions, preserve UI styles, and protect data-testids
---

# Gemini Master Instructions & Guidelines

These rules serve as the source of truth for **Gemini** models working on the **LakshyaQALab** repository. They cover repository-specific safeguards as well as master AI coding rules to prevent regressions and bad edits.

---

## 🎯 Part 1: LakshyaQALab Specific Rules (Strict Safeguards)

### 1. Scope Containment & Precision

- **Surgical Changes Only**: Modify only the specific files and line numbers directly related to the user request. Do not rewrite, restructure, or refactor unrelated components.
- **Visual Stability**: Do not modify layouts, sidebars, header wraps, or overlay wrappers unless explicitly asked to.
- **No Refactoring Unrelated Code**: Do not change old code to match personal styling preferences unless asked.

### 2. Design System and Styling

- **Tailwind CSS v4 & PostCSS**: Only use styling variables and classes defined in `src/index.css`.
- **Teal / Blue / Green Accents**: Use `--color-primary-*` (teal), `--color-secondary-*` (blue), and `--color-accent-*` (green) scales. Avoid introducing generic raw colors.
- **Theme Components**: Always reuse existing style classes like:
  - Buttons: `.btn-primary`, `.btn-secondary`
  - Cards: `.glass-panel`, `.glass-card`, `.dark-elegant-card`, `.bg-gradient-elegant`
- **Typography & Motion**: Standard font config must be preserved (Headers: `Poppins`, Body: `Inter`). Do not replace Framer Motion components with CSS transitions.

### 3. QA Sandbox Safeguards

- **Protect Automated Test Selectors**: **Never modify `data-testid` attributes.** Playwright/Cypress automation suites rely on these exact selectors.
- **Chaos Modes Protection**: Maintain all simulated chaos modes (Label Swap, Ghost Field, Field Shuffle, Infinite Spinner). Do not "fix" these simulated errors as if they are bugs.
- **QA Overlay**: Ensure the floating Unified QA Toolbox (`QAToolsOverlay`) remains visible on all screens.

---

## 🛠️ Part 2: Master AI Coding Guidelines (To Avoid Common AI Pitfalls)

### 1. File Modification Safeguards

- **No Overwriting**: Prefer surgical edits using replacement chunks over overwriting entire files.
- **No Placeholders**: Never insert placeholders, comments like `// TODO: Implement later`, or stub functions. Write the full working code.
- **Preserve Comments/Docstrings**: Keep existing documentation, code comments, and docstrings intact. Do not delete them during code adjustments.

### 2. Semantic Analysis & Execution Checklist

- **First read, then write**: Always view the complete code of a file before attempting to write or replace content. Do not make assumptions about lines or imports.
- **Environment Checks**:
  - Ensure any new imports are correctly resolved and added to dependency configs if necessary.
  - Verify that local files build cleanly (`npm run build`) and pass styling rules (`npm run lint`).
  - Run the test suite (`npm run test`) to prevent code regressions.

### 3. Error Handling and Diagnostics

- If a compilation or linting error occurs, do not guess the solution. Read the specific compiler/linter stdout and target that exact line.
- Provide descriptive, user-facing explanations for any non-obvious code changes or architectural deviations.
