---
name: Luminous Health
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
  on-surface-variant: '#3c4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#855300'
  on-tertiary: '#ffffff'
  tertiary-container: '#e29100'
  on-tertiary-container: '#523200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 20px
  gutter: 16px
---

## Brand & Style

The design system is engineered to evoke a sense of clinical precision blended with empathetic warmth. Targeted at health-conscious individuals and medical professionals, the aesthetic prioritizes clarity, speed of cognition, and digital serenity.

The visual direction is a sophisticated hybrid of **Modern Minimalism** and **Refined Glassmorphism**. It leverages the structural logic of Material 3—utilizing its tonal layering and systematic spacing—while softening the interface with translucent surfaces and high-fidelity background blurs. This "Digital Apothecary" approach ensures the UI feels advanced and intelligent (AI-driven) yet remains deeply accessible and trustworthy.

Key principles:
- **Clarity over Decoration:** Every element serves a functional health-tracking or diagnostic purpose.
- **Etherial Depth:** Use of transparency to signify the non-linear, assistive nature of AI.
- **Human-Centric Tech:** Rounded forms and soft transitions to reduce the "coldness" often associated with medical software.

## Colors

The palette is anchored by **Emerald Green**, symbolizing vitality, growth, and medical safety. This is supported by a clean, high-luminance environment of Whites and Slate-Grays to maintain a "sterile" but inviting atmosphere.

- **Primary (Emerald):** Used for primary actions, success states, and key health indicators.
- **Secondary (Blue):** Reserved for information-dense areas, links, and secondary AI insights.
- **Accents (Orange/Red):** Used sparingly for alerts, critical vitals, or medication reminders.
- **Glass Surfaces:** Semi-transparent white (#FFFFFFB3) with a 20px backdrop blur is the standard for elevated containers.

## Typography

This design system utilizes **Inter** as a singular, highly legible typeface across all platforms to ensure maximum compatibility and a systematic feel. 

- **Headlines:** Use Semi-Bold (600) weights with slightly tightened letter-spacing to create a modern, "app-centric" look.
- **Body Text:** Standardizes on a 16px base for accessibility. Use Regular (400) for standard data and Medium (500) for emphasized insights.
- **Labels:** All-caps styling is reserved strictly for small data labels (e.g., timestamps or unit measurements) to maintain a professional, organized hierarchy.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a heavy emphasis on vertical rhythm based on an 8px square baseline. 

- **Mobile:** 4-column grid with 20px outside margins.
- **Desktop/Tablet:** 12-column centered grid with a maximum content width of 1200px.
- **Sectioning:** Content groups should be separated by `xl` (32px) spacing to prevent cognitive overload.
- **Safe Areas:** Elements never touch the screen edges; a minimum 20px "breathability zone" is enforced globally.

## Elevation & Depth

Depth is communicated through **Tonal Layering** and **Glassmorphism**, rather than traditional heavy shadows.

- **Level 0 (Background):** #F8FAFC (Solid).
- **Level 1 (Default Cards):** Pure White (#FFFFFF) with a 1px border (#F1F5F9).
- **Level 2 (Glass Containers):** White with 70% opacity, 20px backdrop blur, and a subtle inner 1px white highlight border on the top and left edges to simulate light hitting glass.
- **Level 3 (Modals/Floating Nav):** High-blur glass with a soft, 15% opacity primary-tinted shadow (Emerald) to suggest active focus.

## Shapes

The design system utilizes **Rounded** (0.5rem base) corner radii.

- **Standard Elements:** 8px (Buttons, Input fields).
- **Large Containers:** 16px (Medicine cards, Health charts).
- **Extra Large:** 24px (Main dashboard glass cards, Bottom sheets).
- **Interactive Pill:** 100px (Search bars, Floating navigation, Status chips).

## Components

### Buttons
Primary buttons use a solid Emerald Green fill with white text. Secondary buttons use a Glassmorphism style (70% white, 20px blur) with Emerald text. All buttons have an 8px radius and a height of 48px for touch accessibility.

### Floating Bottom Navigation
A pill-shaped navigation bar that floats 24px from the screen bottom. It features a high-blur glass background, an Emerald active state icon, and a subtle shadow to separate it from the content scrolling behind it.

### Medicine & Health Cards
These are the primary data containers. They feature a 16px radius, a 1px soft border, and use Glassmorphism when placed over colorful background gradients (e.g., health trend charts).

### Search Bars
Fully rounded (pill-shaped) with a light gray background (#F1F5F9). On focus, the border transitions to Emerald Green, and the background shifts to white.

### Skeleton Loaders
Use a pulsing shimmer effect with a base color of #F1F5F9 and a highlight of #F8FAFC. Match the exact corner radius of the component being loaded to maintain visual continuity.

### Chips & Badges
Small, pill-shaped indicators for status (e.g., "Confirmed", "Pending"). They use low-opacity versions of the status color (e.g., 10% Red for "Urgent") with high-contrast text.