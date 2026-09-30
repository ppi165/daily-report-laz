---
name: Amanah Operational System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#3f4941'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#6f7a70'
  outline-variant: '#bfc9be'
  surface-tint: '#166c3e'
  primary: '#004a26'
  on-primary: '#ffffff'
  primary-container: '#076437'
  on-primary-container: '#8ddea5'
  inverse-primary: '#87d8a0'
  secondary: '#006d39'
  on-secondary: '#ffffff'
  secondary-container: '#88faac'
  on-secondary-container: '#00743d'
  tertiary: '#633300'
  on-tertiary: '#ffffff'
  tertiary-container: '#854600'
  on-tertiary-container: '#ffbf8c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a2f5ba'
  primary-fixed-dim: '#87d8a0'
  on-primary-fixed: '#00210e'
  on-primary-fixed-variant: '#00522b'
  secondary-fixed: '#88faac'
  secondary-fixed-dim: '#6bdd92'
  on-secondary-fixed: '#00210d'
  on-secondary-fixed-variant: '#00522a'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies the operational rigor, moral transparency, and dignified serenity essential to an Islamic philanthropic institution. It is tailored for internal teams, field officers, and executive leadership managing zakat, infaq, and sadaqah distributions alongside daily programmatic milestones.

The visual tone is defined by modern corporate minimalism infused with an Islamic philanthropic ethos:
- **Quiet Authority:** Confident, structured layouts that elevate credibility without ostentation.
- **Dignity & Clarity:** Ample whitespace, high-contrast typography, and purposeful data density that make complex operational metrics immediately readable.
- **Accountability:** Visual clarity driven by clean outlines, precise data badges, and an uncompromising hierarchy that reflects institutional amanah (trusteeship).

The style merges crisp corporate structure with soft ambient depth: pure white floating surfaces, balanced forestry greens, disciplined borders, and uncluttered typography.

## Colors

The palette grounds modern enterprise workflows in institutional heritage. Deep forest green acts as the bedrock of identity, balanced by a vibrant emerald operational tone and clean neutrals.

### Palette Architecture
- **Primary (`#076437` - Deep Forest Islamic Green):** Used for primary CTAs, active global navigation, top-level brand marks, and key statistical indicators. Conveys institutional trust and stability.
- **Secondary (`#09914F` - Emerald Green):** Used for interactive hover states, programmatic progress bars, positive delta indicators, and secondary accents.
- **Tertiary (`#D97706` - Warm Ochre Gold):** Reserved for urgent pending approvals, distribution audits, and cautionary statuses requiring supervisor review.
- **Neutral Dark (`#1A1A1A`):** Core typography, high-contrast headings, and critical metrics.
- **Neutral Muted (`#6B7280`):** Secondary metadata, labels, captions, and structural divider labels.
- **Surface Canvas (`#F4F4F4`):** Global neutral canvas backing that gives depth to nested card containers.
- **Surface Pure (`#FFFFFF`):** High-level task modules, operational forms, and data cards.
- **Border Subtle (`#E9E9E9`):** Ghost structural lines delivering division without visual noise.

## Typography

Inter serves as the primary typographic engine across the platform. Its tall x-height, neutral letterforms, and optimized tabular figures support dense numeric dashboards, multi-step field reports, and financial tallying.

### Typographic Rhythm
- **Tabular Figures:** Numbers in ledger tables, fund distribution summaries, and daily metric widgets must use font-variant-numeric: `tabular-nums` to guarantee vertical column alignment.
- **Headings:** Headlines are set with deliberate, slight negative tracking (`-0.01em` to `-0.02em`) to deliver modern corporate polish and prevent loose letter spacing in titles.
- **Metadata and Captions:** Small text (`label-sm`, `11px`) uses uppercase treatment with expanded letter spacing (`+0.04em`) to remain sharp when labeling audit badges, program codes, or timestamp stamps.

## Layout & Spacing

The layout utilizes a structured 12-column fluid grid system on desktop, collapsing to 8 columns on tablet, and 4 columns on mobile viewports.

### Breakpoints & Canvas Bounds
- **Desktop (≥ 1280px):** 12-column grid, max-width container `1440px`, `margin` set to `2rem` (32px), `gutter` set to `1.5rem` (24px).
- **Tablet (768px - 1279px):** 8-column layout with `gutter-sm` (16px) and collapsible left-rail navigation.
- **Mobile (< 768px):** 4-column layout, edge margins compressed to `margin-sm` (16px), stacked data tiles.

### Spatial Rules
- Component internal padding strictly implements the `space-*` scale. Standard cards leverage `space-lg` (24px) for content breathing room, reducing to `space-md` (16px) on mobile viewports.
- Related form groups use `space-md` gaps; detached logical sections maintain an explicit `space-xl` separation.

## Elevation & Depth

Visual hierarchy uses clean surfaces and soft ambient shadows over the `#F4F4F4` canvas, avoiding heavy artificial layers.

### Elevation Levels
- **Level 0 (Flat / Canvas):** Ground level (`#F4F4F4`). Background for dashboards, shell layouts, and utility sidebars.
- **Level 1 (Card / Resting Surface):** Pure white `#FFFFFF` paired with an ultralight perimeter border (`1px solid #E9E9E9`) and an ambient shadow: `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03), 0 4px 12px rgba(7, 100, 55, 0.03)`. The subtle hint of brand green in the ambient spread grounds the card to the organization.
- **Level 2 (Interactive Hover / Dropdown Menus):** Applied to active rows, expanded filters, and interactive cards: `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 24px -3px rgba(7, 100, 55, 0.06)`.
- **Level 3 (Modals / Overlays):** Used for field submission dialogs, receipt lightboxes, and confirmation drawers: `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`. Backdrops use `rgba(26, 26, 26, 0.45)` with a `backdrop-filter: blur(4px)`.

## Shapes

The design system establishes a cohesive roundedness profile (`roundedness: 2`), anchoring primary cards at an exact 16px radius (`rounded-lg` = 1rem / 16px) to create an approachable, high-trust operational workspace.

### Corner Radius Mapping
- **Buttons, Form Inputs, and Dropdowns:** 8px (`0.5rem`), ensuring crisp alignment with adjacent interactive inputs.
- **Data Cards & Container Modules:** 16px (`1rem`), providing soft structural containment without appearing playful or juvenile.
- **System Badges & Status Chips:** Fully pill-shaped (`9999px`) to immediately distinguish semantic labels from actionable button boxes.
- **Modals & Drawers:** 20px (`1.25rem`) top or outer borders to elevate priority overlays.

## Components

### Buttons
- **Primary:** Solid `#076437` background, white `#FFFFFF` text, 8px radius, `font-weight: 500`. Hover state transitions to `#09914F`. Padding: `10px 18px` for medium; `8px 14px` for compact table-row actions.
- **Secondary / Outline:** `#FFFFFF` background with `1px solid #E9E9E9` and `#1A1A1A` text. Hover state shifts to `#F4F4F4` background with `#076437` text and border.
- **Ghost:** Transparent background, `#076437` text; `#F4F4F4` surface fill on hover.

### Form Inputs & Selectors
- **Text Inputs:** Height `42px`, `#FFFFFF` fill, `1px solid #E9E9E9`, 8px radius, text in `#1A1A1A`. Placeholder text is `#6B7280`.
- **Focus State:** Dynamic outline with `box-shadow: 0 0 0 3px rgba(9, 145, 79, 0.15)` and border `#09914F`.
- **Validation:** Clear semantic borders (`#DC2626` for errors, `#09914F` for verified field inputs) accompanied by `body-sm` helper notes below the field.

### Checkboxes & Radio Buttons
- Custom 18px controls with 4px border radius for checkboxes and 50% circular for radio buttons.
- Default border: `1.5px solid #D1D5DB`. Checked state: `#076437` fill with white checkmark glyph or center dot.

### Badges & Status Chips
- Height `24px`, padding `0 10px`, pill-shaped (`rounded-full`).
- **Approved / Disbursed:** Background `rgba(9, 145, 79, 0.10)`, text `#076437`, font-size `12px`, weight `600`.
- **Under Review:** Background `rgba(217, 119, 6, 0.12)`, text `#B45309`.
- **Draft / Inactive:** Background `#E5E7EB`, text `#4B5563`.

### Cards & Daily Report Modules
- Background `#FFFFFF`, 16px radius, `1px solid #E9E9E9`, Level 1 ambient elevation.
- Standard padding of 24px (`space-lg`). Header bars inside cards separate actions and title with a delicate `border-bottom: 1px solid #F4F4F4` and `16px` margin.

### Metric / KPI Stat Widgets
- Pure white background cards with a subtle top accent highlight: a 3px horizontal band of `#076437` on key target metrics.
- Big figure displays set in `headline-xl` (tabular nums) with a subtle muted descriptor directly below (`label-md` in `#6B7280`).