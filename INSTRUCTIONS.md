# LakshyaQALab — AI Agent & Developer Guidelines

This document contains mandatory guidelines, design standards, and execution constraints for all human developers and Agentic AIs working on the **LakshyaQALab** codebase.

> [!IMPORTANT]
> Any automated agent modifying this project must read, comprehend, and strictly adhere to these instructions. Failure to do so will result in broken automation suites, degraded user interfaces, or lost features.

---

## 🎯 1. Precise Scope Isolation (No Collateral Damage)

The most common issue with Agentic AI is over-editing or performing "simplifying refactors" that remove existing features or alter unintended UI areas.

- **Surgical Edits Only**: When solving a bug or adding a feature, only modify the specific lines of code directly responsible. Do not rewrite whole components or functions unless absolutely necessary.
- **Maintain Existing UI/UX**: Do not change, move, style, or remove existing layout components (like sidebars, floating widgets, buttons, headers) unless specifically asked.
- **Zero Loss of Functionality**: Under no circumstances should existing modes, tabs, tools, or chaos widgets be deleted or disabled. If a component feels "complex" due to simulation modes, it must remain complex to preserve QA test cases.

---

## 🎨 2. Styling and Aesthetic Adherence

The project is built with **React 19**, **Vite 8**, and **Tailwind CSS v4** + **PostCSS**, utilizing a premium, modern, dark-themed design language.

- **Use Existing Theme Tokens**: Do not write raw custom HEX codes or basic Tailwind colors (e.g., `bg-blue-500`, `text-red-500`) unless they already exist in the surrounding code. Instead, use the custom theme variables defined in [index.css](file:///c:/Users/LakshyaSharma/Downloads/LakshyaQALab/src/index.css):
  - **Primary (Teal)**: `primary-50` to `primary-900`
  - **Secondary (Blue)**: `secondary-50` to `secondary-900`
  - **Accent (Green)**: `accent-50` to `accent-900`
- **Use Defined CSS Component Classes**: Whenever possible, reuse the pre-defined utility classes in [index.css](file:///c:/Users/LakshyaSharma/Downloads/LakshyaQALab/src/index.css):
  - **Buttons**: `.btn-primary` and `.btn-secondary`
  - **Cards & Panels**: `.glass-panel`, `.glass-card`, and `.dark-elegant-card`
  - **Backgrounds**: `.bg-gradient-elegant` and `.bg-gradient-accent-soft`
  - **Text**: `.text-gradient`
- **Fonts & Typography**:
  - **Body text**: Use `font-inter` (`'Inter', sans-serif`)
  - **Headings**: Use `font-poppins` (`'Poppins', sans-serif`)
- **Animations**: Prefer using **Framer Motion** for interactive micro-animations to maintain a premium feel. Avoid removing existing motion containers (`motion.div`, etc.).

---

## 🤖 3. QA Playground Constraints (Critical)

This project serves as a testing ground for automation script developers (SDETs).

> [!WARNING]
> **Do NOT alter existing `data-testid` attributes.** Modifying `data-testid` values will break external Cypress and Playwright tests.

- **`data-testid` Rule**:
  - When modifying or fixing existing elements, leave their `data-testid` attributes completely untouched.
  - When creating _new_ interactive elements, always assign a clear, lowercase, hyphenated `data-testid` attribute (e.g., `data-testid="login-submit-button"`).
- **Chaos Modes Preservation**:
  - The Chaos Form Builder features modes such as **Label Swap**, **Ghost Field**, **Field Shuffle**, and **Infinite Spinner**. These are designed to be erratic to simulate testing scenarios. **Do not attempt to fix or disable these dynamic behaviors** unless the user explicitly requests changes to the chaos logic.
- **God Mode / Control Center**:
  - Keep the mock network capabilities (Offline Mode, 500 Server Errors, Slow 3G network delay) fully functional.
- **Unified QA Toolbox**:
  - The floating overlay in the bottom-right corner must remain persistent across all pages. Do not remove or overlay other elements in a way that blocks this toolbox.

---

## 🛠️ 4. AI-Specific Coding & Execution Guidelines

- **File Editing Tools**: Prefer targeted file replacement tools (`replace_file_content` or `multi_replace_file_content`) over whole-file overwriting (`write_to_file` with `Overwrite: true`) to avoid accidental deletions of unrelated helper functions.
- **Linting & Formatting**:
  - Run linting checks using `npm run lint` or `npm run lint:fix` to ensure code style compliance.
  - Run Prettier checks using `npm run format` or `npm run format:check` to keep code clean.
- **Testing**:
  - Verify changes by running `npm run test` (Vitest) after modifying logic. Ensure all unit and integration tests continue to pass.
  - Start the local dev server using `npm run dev` to verify visual changes before declaring the task complete.

---

## 📝 Summary Checklist for New Tasks

Before starting any task, check off these items:

- [ ] Have I identified the exact component/line that needs modification?
- [ ] Is my modification restricted to the requested change only, leaving the rest of the file untouched?
- [ ] Have I ensured that no existing features, visual styles, or pages are broken/deleted?
- [ ] Are all `data-testid` attributes preserved?
- [ ] Does my implementation match the existing UI/UX aesthetic (fonts, teals/blues/greens, glassmorphic card designs)?
- [ ] Did I run `npm run test`, `npm run lint`, and `npm run dev` to verify the build?
