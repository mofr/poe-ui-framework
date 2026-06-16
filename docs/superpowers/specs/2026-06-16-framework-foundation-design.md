# Framework Foundation Design

## Purpose

Build a reusable Path-of-Exile-inspired React component framework with visual fidelity as the primary success criterion. The framework should not become a fixed application shell. Demo screens exist to pressure-test the library under realistic dense-data conditions.

The first real application target is the POE2 modifier browser at `/home/mofr/poe-brain/poe2/dist/mod-browser/index.html`. Craft of Exile remains a secondary reference for dense crafting-tool interaction patterns, not a layout source of truth.

## Goals

- Create a cohesive fantasy UI component library that feels crafted, readable, and pleasant before a full app exists.
- Treat typography as first-class design infrastructure, not later polish.
- Start with a small cohesive foundation slice: frame/panel, typography roles, controls, tags/badges, dense modifier surfaces, and compact action affordances.
- Use the mod browser as the primary verification playground for prefix/suffix groups, category selectors, dense rows, numeric metadata, state markers, and responsive columns.
- Keep README documentation current with durable visual-language and component-boundary decisions.

## Non-Goals

- Do not clone Craft of Exile visually or structurally.
- Do not optimize for a final application layout in the first milestone.
- Do not prioritize a standalone input component unless search/filter styling blocks the showcase.
- Do not introduce a test framework unless implementation becomes logic-heavy.
- Do not use proprietary game fonts or game assets unless licensing is clear.

## Recommended Approach

Build a cohesive foundation slice rather than a single isolated hero component or a full documentation shell.

This slice should include enough components to prove visual consistency across chrome, typography, controls, dense data, and semantic states. If quality starts slipping, narrow scope to `PoeFrame`, typography, and one or two supporting controls instead of shipping a broad but mediocre set.

## Visual Language

The component library should use a disciplined hybrid material language:

- Stone and aged metal define durable UI chrome: panel shells, borders, headers, buttons, action slots, and structural affordances.
- Parchment is reserved for readability-heavy content: dense tables, long descriptions, modifier detail bodies, tooltips, docs-like content, and item/mod explanations.
- Arcane atlas styling is semantic emphasis: active, selected, magical, linked, rare, warning, corrupted, or inspectable states.
- Glow is a state signal, not generic decoration.

Each material must have a clear role so the result feels rich rather than noisy.

## Typography System

Typography is part of the component API. Components should rely on shared font tokens and text-role classes rather than arbitrary inline font choices.

Required roles:

- Display/title: high-identity fantasy text for app titles, hero labels, and rare ceremonial moments.
- Panel heading: compact uppercase or small-caps plaque text for frame headers and section titles.
- UI/body: readable dense text for controls, rows, descriptions, and normal content.
- Label/meta: smaller subordinate text for captions, categories, timestamps, and counts.
- Numeric: tabular treatment for tiers, weights, item levels, hotkeys, progress values, and aligned counts.
- Rune/accent: compact symbolic treatment for badges, hotkeys, sockets, and magical metadata.

Typography fidelity should be reviewed explicitly. The UI should avoid both failure modes: a generic dashboard with themed colors, and fantasy fonts applied everywhere at the expense of readability.

## Font Source Strategy

Research Path-of-Exile-like font options before finalizing the stack.

- Community references often identify classic PoE-like typography with Fontin / Fontin SmallCaps, but licensing and availability must be verified before use.
- If legally usable, test Fontin or a close equivalent for display, header, and small-caps roles.
- If not suitable, continue with free alternatives that capture similar traits: old-style serif identity, small-caps plaque text, readable dense UI text, and strong numeric treatment.
- Current candidates include `Cinzel`, `IM Fell English SC`, `Inter`, and `JetBrains Mono`.
- Keep font selection swappable through tokens such as `--poe-font-display`, `--poe-font-title`, `--poe-font-ui`, and `--poe-font-number`.

## Design Tokens

Design tokens are named CSS variables that hold reusable visual decisions. They live in `src/styles/poe-tokens.css` and should be the source for shared color, type, spacing, shadow, border, and state values.

Tokens should cover:

- Material colors: stone, metal, parchment, inset, corruption, magic, rarity.
- Typography roles: display, title, UI/body, label, number, rune/meta.
- Borders and shadows: raised frame, inset panel, selected glow, active glow.
- Spacing and density: compact table rows, panel padding, control height.
- State colors: hover, focus, selected, disabled, warning, danger, success.

## Component Boundaries

Keep the current structure:

- `src/components/` for focused React components.
- `src/styles/poe-tokens.css` for design tokens.
- `src/styles/poe-core.css` for reusable skins and component classes.
- `src/components/PoeAssets.jsx` and CSS backgrounds for asset references.

First milestone component targets:

- `PoeFrame`: anchor component for stone, metal, parchment, inset, selected, and active panels.
- Typography roles: text-role classes or small primitives for display, panel heading, label, body, numeric, rune/meta, and warning text.
- `PoeButton`: material action control with default, primary/magic, danger/corruption, ghost/inset, and disabled states.
- `PoeTabs` or mode switcher: compact category and mode navigation for item classes and modifier group selectors.
- `PoeTag` and `PoeBadge`: dense semantic markers for modifier tags, sockets, corruption, rarity, selected, required, and blocked states.
- Dense list/table surface: modifier rows with numeric columns, hover, selected, blocked, required, and readable parchment/inset variants.
- Compact action tile: small icon-based crafting/action slot inspired by method buttons and the existing bottom action bar.

`PoeInput` can remain CSS-only or raw in the first pass unless the showcase needs it. It should not consume first-iteration design budget.

## Demo And Verification Playground

The first playground should be a POE2 modifier browser-style page. It verifies whether the components compose into a cohesive dense interface.

Useful playground pieces:

- Spawn/category selector using tabs, pills, or compact segmented controls.
- Prefix/suffix paired panels using `PoeFrame`.
- Modifier group sections with strong headers and compact metadata.
- Dense modifier rows or cards with tiers, item levels, weights, tags, and state markers.
- Optional other/inspector column for selected details.
- Warning or notes panel only if needed to test semantic states.
- Responsive behavior where columns stack gracefully and dense lists remain readable.

The playground must not become the framework architecture. It is a composition surface for validation.

## States And Interaction

Prioritize a small number of high-quality states over many shallow variants.

Core states:

- Default: readable, quiet, dark fantasy baseline.
- Hover/focus: subtle gold edge/glow with clear affordance.
- Active/selected: stronger atlas-blue or gold glow depending on semantic role.
- Required/pinned: deliberate mark for chosen modifier requirements.
- Blocked/excluded: muted, red/corruption-tinted, still readable.
- Warning/danger: red/corruption treatment for caveats, impossible states, or destructive actions.
- Disabled: visibly unavailable without becoming illegible.

Interaction should support dense browsing. Prefer short tactile effects: edge glow, inset shadow change, slight press depth, row highlight, or icon illumination. Avoid large motion, layout shifts, and effects that reduce readability.

## Visual References And Review Criteria

Use the `inspiration/` directory as the first visual benchmark.

- `perfect-fantasy-rpg-font-lists-buttons-icons-progressbars-frames.jpg` is the strongest reference for dense framed UI, glowing meters, compact rows, action slots, icon color, and varied typography.
- `warcraft-related.webp` is useful for heavy carved frames, heroic side panels, and readable dark panels.
- `nice-paper-background.webp` is useful for parchment content surfaces contained inside dark/metal chrome.
- `not-bad-poe-atlas.webp` is useful for atlas/glow motifs, ornate search/action plaques, node relationships, and magical active states.

Before asking for manual review, perform an AI visual review against these references:

- Does the UI have crafted border depth, or does it still look like flat CSS boxes?
- Are typography roles meaningfully different, or do labels, headings, body, and numbers feel too similar?
- Are display/title and panel-header fonts fantasy-like without harming readability?
- Are numeric values tabular and aligned cleanly?
- Are parchment surfaces used only where readability benefits?
- Are glows tied to semantic state instead of decoration?
- Do dense rows remain readable at a glance?
- Do icons and assets feel integrated with frames and type?
- Does the overall result feel cohesive rather than like separate themed components?

If the result is clearly below the bar, iterate before requesting user review. If remaining questions are subjective, summarize the tradeoffs and ask for judgment.

## Technical Verification

- `npm run build` must pass.
- The demo should load in Vite without runtime errors.
- Manual user review remains the final fidelity check, but AI visual review should catch obvious gaps first.
- README updates should document visual language, typography roles, tokens, component boundaries, and review criteria.

## Acceptance Criteria

- The first milestone produces a visually cohesive foundation slice, not merely isolated themed components.
- Typography roles are visible in real UI context and documented.
- The mod-browser playground proves dense prefix/suffix modifier browsing can look good and stay readable.
- Component APIs remain reusable and layout-agnostic.
- Visual review against the inspiration images happens before asking for manual review.
- README reflects durable decisions from the design process.
