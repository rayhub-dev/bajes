# BAJES AGENT UI/UX GUIDELINES

You are tasked with generating frontend code for "Bajes", a personal finance web application targeting Gen-Z.
Bajes embraces a Neo-Brutalism aesthetic: it is bold, slightly rebellious, playful, and high-contrast, functioning as an antithesis to boring, traditional banking apps.

## 1. DESIGN LANGUAGE & STYLING RULES (NEO-BRUTALISM)

Apply these rules strictly when generating CSS or Tailwind classes:

- **Borders:** Use thick, solid black borders on primary containers, cards, and interactive elements.
  - _Tailwind Example:_ `border-2 border-black` or `border-4 border-black` depending on element size.
- **Shadows (Hard Shadows):** DO NOT use soft, blurred drop-shadows. Shadows must be solid, offset blocks of color (usually black).
  - _CSS Rule:_ `box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);`
  - _Tailwind Implementation:_ Define a custom shadow in config (e.g., `shadow-brutal`), or use arbitrary values: `shadow-[4px_4px_0px_rgba(0,0,0,1)]`.
- **Corners:** Use explicit rounded corners combined with thick borders. Do not use sharp corners unless specifically requested.
  - _Tailwind Example:_ `rounded-xl` or `rounded-2xl`.

## 2. COLOR PALETTE DEFINITION

Maintain the 80/20 rule: 80% neutral background, 20% vibrant neo-brutalism accents.

- **Background (80%):** Off-white/cream `#FAF8F5` (Light mode) or Pitch Black `#0A0A0A` (Dark mode).
- **Primary Accent:** Highlighter Yellow `#E5FF00`. Use for main Call-to-Action (CTA) buttons, important highlights, or positive progress.
- **Secondary Accents:**
  - Bubblegum Pink `#FF80DF` (Use for specific tags, secondary actions).
  - Electric Blue `#0044FF` (Use for specific tags, informative alerts).
  - Toxic Green `#00FF66` (Use for success states or "safe" statuses).
- **Danger/Alert:** Bright Red `#FF3333` (Use for overbudget warnings or destructive actions).
- **Text & Borders:** Solid Black `#000000` (Light mode) or Solid White `#FFFFFF` (Dark mode).

## 3. TYPOGRAPHY RULES

- **Display Font (Headings, Balances, CTA Text):** Use a chunky, quirky font.
  - _Target Font:_ "Space Grotesk" (Fallback: "Syne" or "Bricolage Grotesque").
  - _Implementation:_ Map to a Tailwind class like `font-display`. Use bold weights (`font-bold` or `font-extrabold`).
- **Body Font (Paragraphs, Labels, UI Text):** Use a clean, highly legible modern sans-serif.
  - _Target Font:_ "Plus Jakarta Sans" (Fallback: "Inter").
  - _Implementation:_ Map to a Tailwind class like `font-sans`.
- **Text Styling:** Use ALL CAPS BOLD (`uppercase font-bold`) frequently for small labels, tags, and button text to emphasize the brutalist feel.

## 4. INTERACTION & ANIMATION RULES

Interactive elements must feel physical and responsive.

- **Button Hover/Active States:** When hovering/clicking, buttons should visually "press down".
  - _Action:_ Reduce the hard shadow offset and translate the element downwards/rightwards to match.
  - _Tailwind Example:_ `hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all`
- **Micro-interactions:** If using animation libraries (like Framer Motion), favor spring/bouncy physics over linear easing.

## 5. COPYWRITING & MICROCOPY DIRECTIVES

When generating placeholder text, UI labels, or alerts, strictly adhere to Indonesian Gen-Z slang. Avoid formal, corporate Indonesian.

- **Tone:** Casual, relatable, slightly roasting/sarcastic, bestie-vibe.
- **Examples:**
  - _Welcome:_ "Halo Bestie!"
  - _Empty State:_ "Yah kosong... persis kayak dompet lo akhir bulan."
  - _Warning/Danger:_ "Ngerem woy! Bajes ngopi lo udah limit nih!"
  - _Success:_ "Gokil! Nabung lo bulan ini tembus target! 🎉"
  - _Budget:_ Translate the word "Budget" to "Bajes".

## 6. COMPONENT EXAMPLES FOR CONTEXT

When building a standard card, follow this structure:

1. Container with neutral background, thick border, hard shadow.
2. Distinct sections separated by thick borders if necessary.
3. Use primary/secondary accent colors sparingly to highlight specific data points (e.g., a pink badge for "Entertainment" expenses).
4. Ensure typography hierarchy is clear: large chunky display font for currency, smaller clean sans-serif for labels.
