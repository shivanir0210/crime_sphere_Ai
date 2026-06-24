# CrimeSphere AI - UI Design Guidelines

This document outlines the professional design system and UI guidelines for the **CrimeSphere AI** dashboard interface. All future pages, components, and developers must use only the CSS variables defined in this system to maintain consistent styling.

---

## 1. Color Palette

The project is styled using a **Tactical Cyber Intelligence / Modern Police Dashboard** aesthetic. It uses a high-contrast dark theme with sharp cyber-cyan accents.

| Variable Name | Hex Code | Visual Role / Usage |
| :--- | :--- | :--- |
| `--bg-color` | `#0F172A` | Primary background for pages and main views. |
| `--card-color` | `#1E293B` | Base background for cards, sidebar elements, and popups. |
| `--primary-color` | `#2563EB` | Actions, indicators, and primary functional triggers. |
| `--accent-color` | `#06B6D4` | Tactical cyber highlights, terminal streams, and glows. |
| `--text-color` | `#F8FAFC` | Primary readable typography (high contrast white). |
| `--text-secondary`| `#94A3B8` | Muted descriptions, secondary meta-tags, and labels. |
| `--success-color` | `#22C55E` | Safe state, active status, clear targets, resolved files. |
| `--warning-color` | `#F59E0B` | Critical monitoring, warning indicators, on-hold items. |
| `--danger-color` | `#EF4444` | System alert, critical targets, danger alerts, violations. |

---

## 2. Typography

The default typography is **Poppins** (loaded from Google Fonts).

### Text Rules
- **Titles / Headings**: Bold (`600` or `700`) with tighter line-height (`1.25`) to look structural and commanding.
- **Body Text**: Light/Regular (`400`) at `15px` with a generous line-height (`1.6`) for rapid intelligence reading.
- **Monospace Text**: Code fields and log streams must use a monospace font (`monospace`) for analytical clarity.

### Headings Scale
- `h1`: `2.25rem` (Header Title, page main header)
- `h2`: `1.75rem` (Subsections, main card headers)
- `h3`: `1.35rem` (Inner card partitions)
- `h4`: `1.15rem` (Form group dividers)

---

## 3. Button Rules

Buttons are the core interactions. Always use the specified button utility classes:

### Classes
1. **Primary Action (`.btn-primary`)**:
   - Usage: Submitting forms, saving cases, creating critical queries.
   - Style: Solid blue background with a subtle glow on hover.
2. **Accent Action (`.btn-accent`)**:
   - Usage: Intelligence actions, triggering scans, launching chat queries.
   - Style: High-contrast cyan background with dark text, glowing box shadow.
3. **Secondary Action (`.btn-secondary`)**:
   - Usage: Cancel, reset, back options, secondary actions.
   - Style: Bordered layout with text-secondary color, changing to white text on hover.
4. **Alerts (`.btn-danger` / `.btn-success`)**:
   - Usage: Deleting records, warning resolution, case closing.

### State Transitions
- Hover: Triggers a translation upward (`-1px`) and a box glow shadow.
- Disabled: Opacity set to `0.5`, pointer cursor disabled, transform animations locked.

---

## 4. Card Rules

Cards are the fundamental building block of the police intelligence layout.

### Classes & Hierarchy
- **Standard Card (`.card`)**:
  - Border: Thin, semi-transparent grey (`rgba(148, 163, 184, 0.12)`).
  - Background: Solid slate (`#1E293B`).
  - Corner Radius: Large (`12px` or `var(--radius-lg)`).
- **Interactive Card (`.card-interactive`)**:
  - Used for clickable grid elements (e.g. suspect profile card, hotspot map link).
  - Hover behavior: Subtle cyan glow shadow (`var(--glow-accent)`), border-color shifts to accent, card rises upward (`-2px`) on a slow-cubic transition.

---

## 5. Input Rules

Investigative query fields, case description textareas, and search filters must look technical and secure.

### Rules
- **Base Style**:
  - Background: Slightly darkened transparent blue (`rgba(15, 23, 42, 0.4)`).
  - Border: Muted grey border.
  - Text: High contrast white.
- **Active State (Focus)**:
  - Background shifts to solid `rgba(15, 23, 42, 0.6)`.
  - Border color matches `--accent-color` (cyan).
  - Box-shadow glows with subtle cyan overlay.

---

## 6. Layout & Grid Rules

- **Dashboard Layouts**: Use the `.dashboard-grid` class to build responsive 3-column structures (`grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`).
- **Responsive Flex**: Use flex configurations that default to vertical layout on devices narrower than `768px`.
- **Spacing**: Use standard margins in multiples of `4px` (e.g. `8px`, `12px`, `16px`, `24px`, `32px`) to enforce grid alignment.

---

## 7. Developer Enforcement Rules

> [!WARNING]
> Do NOT use raw hex values (`#ffffff`, `#1a1a1a`), RGB values, or named HTML colors (like `red`, `blue`) in your component styles. All color assignments must point to CSS variables.

### Correct
```css
.suspect-header {
  background-color: var(--card-color);
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
}
```

### Incorrect
```css
.suspect-header {
  background-color: #1E293B;  /* Hardcoded color! */
  color: #fff;               /* Hardcoded color! */
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
```
