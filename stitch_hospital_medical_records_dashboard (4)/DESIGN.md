---
name: MediTrack Clinical EHR
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#004e48'
  on-tertiary: '#ffffff'
  tertiary-container: '#006861'
  on-tertiary-container: '#8fe4da'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#9cf2e8'
  tertiary-fixed-dim: '#80d5cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#00504a'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.25rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system serves acute and ambulatory healthcare practitioners operating in fast-paced, high-stakes medical environments. Its aesthetic is grounded in clinical precision, rapid legibility, and quiet digital ergonomics. It avoids decorative distraction in favor of clear data hierarchy, immediate cognitive scanning, and high-trust authority.

The system adheres to an upgraded **Corporate Modern / Clinical Utility** style: crisp borders, disciplined white and slate canvas layers, deliberate typography scale, and focused application of color purely for interaction, status, and verification. The interface reduces cognitive fatigue during long shifts and guarantees WCAG AAA compliance across primary clinical paths.

## Colors

The palette transitions away from consumer-adjacent teals into authoritative, high-clarity clinical blues:

- **Primary (`#1d4ed8`)**: Royal Medical Blue. Anchors core interactive states, global navigation headers, dominant buttons, and active tabs. Delivers an authoritative 7:1+ contrast ratio against light backdrops.
- **Secondary (`#0284c7`)**: Sky Medical Blue. Reserved for informational banners, secondary data metrics, interactive links, and non-blocking notifications.
- **Tertiary (`#0f766e`)**: Clinical Deep Pine. Applied selectively for verified patient status, stable vital indicators, and finalized charting records.
- **Neutral (`#64748b`)**: Balanced Slate. Controls structural boundaries, subtle divider lines, inactive icons, and metadata readouts without harsh optical glare.

### Surface Architecture
- **Base Canvas**: `#f8fafc` (Slate 50) establishes a glare-free, clinical desktop workspace.
- **Surface Elevation 1**: `#ffffff` for patient chart panels, medication order cards, and modal dialogs.
- **Surface Elevation 2**: `#f1f5f9` (Slate 100) for nested data grids, table header rows, and toolbars.
- **Borders & Dividers**: `#e2e8f0` (Slate 200) for hair-thin, structural field demarcation.

### Clinical Semantics
- **Critical / Alert**: `#b91c1c` (Crimson, high-alert labs and allergies).
- **Caution / Pending**: `#b45309` (Amber, pending orders and incomplete notes).
- **Normal / Confirmed**: `#15803d` (Emerald, normal range lab results).

## Typography

The typography relies entirely on **Plus Jakarta Sans** for its balanced blend of clean geometry, humanist curves, and high open counters that preserve legibility under rapid clinical skimming.

- **Numerics & Vitals**: Numerical vitals and dosage information render with tabular figure adjustments (`font-variant-numeric: tabular-nums`) to ensure vertical alignment across data lists and lab history panels.
- **Hierarchy Rules**: 
  - `headline-xl` and `headline-lg` are reserved for primary views (e.g., Patient Summary header, Encounter Overview).
  - `headline-md` and `headline-sm` designate EHR card containers, vitals blocks, and drawer titles.
  - `body-md` is the workhorse for progress notes, history narratives, and diagnosis descriptions.
  - `label-md` and `label-sm` are deployed for metadata, vital unit signatures (e.g., `mmHg`, `mg/dL`), and status badges.

## Layout & Spacing

The layout is built upon an 8-point spatial system optimized for high information density without visual crowding. A dense 4-point sub-grid (`space-xs`) handles compact table cells and tightly paired clinical metadata.

### Grid & Breakpoints
- **Desktop (>= 1280px)**: 12-column fluid grid. Includes a fixed persistent 260px clinician navigation rail, a 340px modular contextual drawer (e.g., encounter summary or order basket), and a responsive central clinical record canvas (`gutter-lg: 1.5rem`, `margin-lg: 2rem`).
- **Tablet (768px - 1279px)**: 8-column layout. The left navigation collapses to an icon bar; side panels shift to floating or slide-out sheets (`gutter-md: 1.25rem`, `margin-md: 1.5rem`).
- **Mobile (< 768px)**: 4-column layout for bedside alerts, rapid signature capture, and schedule tracking (`gutter: 1rem`, `margin: 1rem`).

## Elevation & Depth

To maintain clarity and reduce optical distractions under harsh hospital lighting, depth is defined primarily through crisp 1px borders and soft, daylight-calibrated tonal layering rather than heavy drop shadows:

- **Level 0 (Base Canvas)**: `#f8fafc` background with no elevation.
- **Level 1 (Cards, Modules, Patient Chart Sections)**: Pure `#ffffff` surface, bounded by a 1px solid border (`#e2e8f0`). Shadow is ultra-subtle: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
- **Level 2 (Dropdowns, Popovers, Order Menus)**: `#ffffff` surface, bordered by `#cbd5e1`, with elevated utility shadow: `0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals, Stat Medication Alerts, Critical Overlays)**: `#ffffff` surface floating above a 40% `#0f172a` backdrop veil: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`.

## Shapes

The design system implements a disciplined **Soft (`1`)** shape language.

- **Base Radii (`0.25rem` / 4px)**: Checkboxes, badges, table tag elements, and inline status markers.
- **Container Radii (`0.5rem` / 8px)**: Buttons, text inputs, segmented controllers, cards, vitals modules, and dropdown flyouts.
- **Overlay Radii (`0.75rem` / 12px)**: Floating dialogs, clinical prescription modals, and bottom action sheets.
- **Fully Rounded (`9999px`)**: Reserved exclusively for clinical badge pills (e.g., patient condition indicators) and user avatar discs.

## Components

### Buttons
- **Primary**: Background `#1d4ed8`, text `#ffffff`, border radius `0.5rem`. Hover state transitions to `#1e40af`. Active state `#172554`. Focus ring: 2px offset with 2px width `#0284c7`.
- **Secondary**: Surface `#ffffff`, border 1px solid `#cbd5e1`, text `#1e293b`. Hover: background `#f1f5f9`.
- **Destructive / Stat**: Surface `#dc2626`, text `#ffffff`. Used for "Discontinue Order" or "Report Code" triggers.

### Input Fields & Controls
- **Text & Select Inputs**: Height 38px (compact clinical density), background `#ffffff`, border 1px solid `#cbd5e1`, border radius `0.5rem`. Placeholder in `#94a3b8`. Focus state switches border to `#1d4ed8` with a 2px outer aura in `rgba(29, 78, 216, 0.15)`.
- **Checkboxes & Radios**: 18px size. Unchecked border `#94a3b8` on `#ffffff`. Checked state fills `#1d4ed8` with crisp white SVG check/dot icon.

### Chips & Clinical Badges
- **Status Chips**: Height 24px, radius `9999px`, padding `0 8px`. Font size `label-sm`.
  - Normal/Active: Background `#eff6ff`, text `#1d4ed8`, border 1px solid `#bfdbfe`.
  - Lab Abnormal: Background `#fef2f2`, text `#991b1b`, border 1px solid `#fecaca`.
  - Pending Review: Background `#fffbeb`, text `#92400e`, border 1px solid `#fde68a`.

### Cards & Patient Data Containers
- White `#ffffff` background with 1px border `#e2e8f0` and radius `0.5rem`.
- Header band separated by a 1px border `#f1f5f9` with an integrated 14px uppercase label and action slot.

### EHR Specialized Components
- **Vitals Strip**: Horizontally distributed summary row highlighting Blood Pressure, Heart Rate, SpO2, and Temp. Quantitative values use `headline-sm` with tabular numerics; accompanying measurement units use `label-sm` in `#64748b`.
- **Allergy Banner**: Persistent high-visibility top-strip with light-red tint (`#fef2f2`), bold `#991b1b` text, and quick-add modal launch trigger.
- **Medication Order Row**: Two-line list element detailing drug name, strength, route, and frequency with inline interaction verification stamps.