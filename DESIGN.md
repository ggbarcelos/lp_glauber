---
name: Glauber Barcelos
description: Portal de engenharia que conecta contexto de negócio a produtos digitais.
colors:
  ink: "#090c14"
  ink-soft: "#101626"
  surface: "#11182a"
  action-blue: "#4667ff"
  signal-cyan: "#80f5ed"
  brand-lime: "#d4fc68"
  accent-violet: "#b59aff"
  text: "#eff8f8"
  text-soft: "#a9bac1"
typography:
  display:
    fontFamily: "GB Sora, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.09
    letterSpacing: "-0.06em"
  body:
    fontFamily: "GB Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "0.62rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  control: "10px"
  panel: "18px"
  cut-corner: "14px 14px 0 14px"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "15px 22px"
    height: "54px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "12px 17px"
  service-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "25px 26px"
---

# Design System: Glauber Barcelos

## Overview

**Creative North Star: "Portal de engenharia"**

This is a precise, technical identity built from connected planes and deliberate signals. A near-black navy field gives the work depth; electric blue marks actions, while cyan, lime, and violet identify highlights, nodes, and supporting information. Portal frames, fine grids, thin connection paths, and compact mono labels make engineering visible without turning the page into a generic dashboard.

The homepage carries the most dimensional expression through its portal sculpture, blue-violet calls to action, and luminous interface layers. Service pages share the dark palette, Sora and Manrope typography, blue actions, and selectively chamfered shapes, while keeping their own inline layouts. Keep the portal imagery decorative; the words, project scope, and next steps remain readable as HTML.

**Key Characteristics:**
- Near-black navy surfaces with cool, high-contrast text.
- Electric-blue actions with white labels; cyan, lime, and violet as signal colors.
- Sora display type, Manrope body text, and compact mono labels.
- Connected portal planes, fine grids, thin borders, and selective lower-right cuts.
- Deliberate motion that can be paused and respects reduced-motion preferences.

## Colors

The palette pairs layered blue-black surfaces with electric actions and small, luminous signal colors.

### Primary
- **Azul Elétrico** (#4667ff): Main action color with white labels. Homepage and service-page primary actions use a blue-to-violet gradient; navigation contact actions use solid blue.
- **Ciano Sinalizador** (#80f5ed): Highlights selected words, active routes, and technical signals.

### Secondary
- **Lima de Marca** (#d4fc68): Brand mark, square nodes, progress details, and focus emphasis. Keep it out of the primary action surface.
- **Violeta de Contexto** (#b59aff): Secondary emphasis and technical metadata.

### Neutral
- **Grafite Noturno** (#090c14): Main dark canvas.
- **Azul Noite** (#101626): Secondary navigation and section surface.
- **Painel Marinho** (#11182a): Cards and raised content areas.
- **Branco Frio** (#eff8f8): Main text and labels on dark surfaces.
- **Azul Neblina** (#a9bac1): Supporting paragraph text; dimmer text is used for metadata.

### Named Rules
**The Action-Color Rule.** Electric blue carries primary actions with white labels; cyan, lime, and violet mark emphasis and connection points.

## Typography

**Display Font:** GB Sora (with system-ui, sans-serif fallback)  
**Body Font:** GB Manrope (with system-ui, sans-serif fallback)  
**Label/Mono Font:** DM Mono (with ui-monospace fallback)

**Character:** Sora gives headlines a compact, technical silhouette. Manrope keeps longer explanations approachable, while DM Mono turns category labels, coordinates, and section indices into quiet instrumentation.

### Hierarchy
- **Display** (weight 500, clamp(2rem, 4.4vw, 4.5rem), line-height 1.09): Homepage hero headline; on narrow screens it scales to clamp(2rem, 8.5vw, 3.05rem).
- **Headline** (weight 500, clamp(2.25rem, 4.3vw, 4.15rem), line-height 1.04): Section titles and service-page headings.
- **Body** (weight 400, 1rem, line-height 1.6): Core copy; hero leads grow slightly at wide sizes and use a more open 1.8 line-height.
- **Label** (weight 400–500, about 0.62rem, letter-spacing around 0.1em, often uppercase): Eyebrows, project categories, section numbers, and coordinates.

### Named Rules
**The Signal-Type Rule.** Reserve mono and tracked uppercase for short metadata; keep descriptive copy in Manrope.

## Layout

Use a centered shell. The homepage grows to 1320px with 64px desktop gutters; service pages use a 1180px shell with the same desktop gutter. Narrow layouts retain 40px side gutters. Heroes begin in two columns, then stack; home navigation and action groups become compact on mobile. Service grids and process columns collapse to one column at their observed 800–900px breakpoints. Homepage sections use about 104px vertical padding on desktop and 76px on mobile; service sections range from 78px to 138px and settle at 76px on mobile.

The homepage uses asymmetric columns and a large portal scene to balance the text. Service pages pair a clear editorial heading with a technical console or diagram. Cards use a dense, deliberate grid with small indexes, evidence images, and descriptive links.

## Elevation & Depth

Depth comes from tonal shifts, translucent blue-black panels, fine borders, background grids, radial light, and selective blur. Shadows and colored glows support the portal scene, floating labels, and active controls; they do not replace the border system.

### Shadow Vocabulary
- **Portal atmosphere** (drop-shadow 0 32px 35px #0005): Separates the decorative sculpture from the dark field.
- **Hero panel** (0 35px 80px rgba(0, 0, 0, 0.34), 0 0 80px rgba(136, 243, 200, 0.08)): Adds depth to terminal-style panels.
- **Action glow** (0 8px 28px #405de52b, inset 0 1px 0 #fff3): Supports the homepage primary action.

### Named Rules
**The Layered-Depth Rule.** Use tonal contrast, translucent planes, and ambient light to establish depth; reserve stronger shadows for the hero scene and interactive emphasis.

## Shapes

The recurring shape is a framed plane with rounded upper corners and a deliberate lower-right cut. Use the cut selectively on portal frames, buttons, service panels, and identity geometry; ordinary content cards may keep a uniform radius between 14px and 20px. Borders stay thin and cool blue. Square lime nodes punctuate the rounded geometry.

## Components

### Buttons
Directional, high-contrast controls with luminous but restrained hover feedback.
- **Shape:** 10px radius for homepage controls; service buttons and selected panels use a 14px 14px 0 14px cut.
- **Primary:** White label over a blue-violet gradient. Navigation contact actions use solid electric blue. Typical homepage sizing is 54px high with 15px 22px padding.
- **Hover / Focus:** Lift by about 3px and deepen the blue. Keep a visible 2px focus outline with a 5px offset.
- **Secondary / Ghost:** Transparent fill, a thin blue-white border, and cool white text; cyan appears on hover.

### Chips
- **Style:** Compact uppercase mono labels with a dark blue panel, thin blue border, and cool light text.
- **State:** Category and project metadata; cyan marks a current or emphasized state.

### Cards / Containers
- **Corner Style:** 18px on homepage cards; service panels use selected chamfered lower-right corners.
- **Background:** Layered navy or a dark blue gradient, edged by a subtle blue border.
- **Shadow Strategy:** Borders and tonal surfaces define the card at rest; a brighter border, small lift, or soft shadow marks hover.
- **Internal Padding:** About 23–26px for card bodies, with larger 42px padding on the lead case card at desktop.

### Inputs / Fields
- **Style:** Dark inset field, cool border, 9px radius, and at least 48px height.
- **Focus:** 2px cyan outline with a clear offset; maintain the shared visible-focus treatment.

### Navigation
- **Style:** Fixed translucent dark bar with a thin border, 20px backdrop blur, and Sora wordmark asset.
- **States:** Links brighten on hover and active state; a fine cyan line signals selection. The contact action uses a blue surface and white label.
- **Mobile:** The homepage navigation becomes a rounded floating panel with a menu toggle; service-page navigation keeps its own compact, wrapping layout.

### Portal Scene
The signature hero graphic layers translucent blue architectural frames with perspective, thin connection paths, and square lime nodes. Labels remain HTML. The scene uses a slow float that can be paused and stops under reduced-motion preferences.

## Do's and Don'ts

### Do:
- **Do** preserve the near-black navy base and cool, high-contrast text.
- **Do** assign electric blue to primary actions; use cyan, lime, and violet as signals.
- **Do** use Sora headings, Manrope body text, and compact mono labels.
- **Do** keep portal graphics decorative and put meaningful copy in HTML.
- **Do** retain the motion pause control, visible keyboard focus, and reduced-motion support.
- **Do** use the lower-right cut selectively on portal geometry and related controls.

### Don't:
- **Don't** shift the visual language toward a generic dashboard.
- **Don't** make lime the primary button color; the implementation uses blue action surfaces with white labels.
- **Don't** rely on glow, grids, animation, or imagery to carry essential meaning.
