---
name: lakshya-qa-rules
description: Strict rules for modifying LakshyaQALab to prevent unnecessary UI modifications and functional regressions.
---

# LakshyaQALab Modification Skill

This skill enforces strict rules and restrictions when modifying files in the `LakshyaQALab` project to prevent regressions and keep the design system consistent.

## Rules & Constraints

### 1. Scope Containment

- Focus strictly on the files and lines requested.
- Do not refactor code or touch UI elements that are not part of the explicit request.
- Do not change headers, sidebars, layout wrappers, or overlays unless asked.

### 2. Styling System

- Only use existing variables and utility classes defined in `src/index.css`.
- Use `--color-primary-*` (teal), `--color-secondary-*` (blue), and `--color-accent-*` (green).
- Reuse existing component styles like `.btn-primary`, `.btn-secondary`, `.glass-panel`, `.glass-card`, `.dark-elegant-card`, and `.bg-gradient-elegant`.
- Match existing font settings: `Poppins` for headers, `Inter` for body.

### 3. QA Safeguards

- **Never modify existing `data-testid` attributes**, as they are linked to Playwright/Cypress automated tests.
- Maintain all simulator features (Offline, 500 error, Slow 3G network) and Chaos modes (Label Swap, Ghost Field, Field Shuffle, Infinite Spinner). Do not "fix" these simulated errors/behaviors.
- Ensure the floating `QAToolsOverlay` (Unified QA Toolbox) remains visible on all screens.
