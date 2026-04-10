# Design System Document: The Fluid Authority

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Curator."** In a world of chaotic waiting rooms and frantic queues, this system acts as a serene, authoritative guide. It rejects the "app-in-a-box" aesthetic in favor of a high-end editorial experience that feels both tech-forward and unshakably trustworthy.

The design breaks traditional web patterns by employing **intentional asymmetry** and **tonal depth**. Rather than rigid grids with heavy borders, we use breathing room (negative space) and sophisticated layering to guide the user's eye. Every element is a deliberate choice, creating an environment where "waiting" feels like a premium, managed experience.

## 2. Colors: Tonal Architecture
This system utilizes a professional blue and white palette, but moves beyond flat fills by using the Material Design convention to create structural hierarchy through color alone.

### Key Tokens
- **Primary (`#2b4bb9`):** Our "Command Blue." Used for high-priority actions.
- **Surface (`#f7f9fb`):** The base canvas. A cool, crisp off-white that reduces eye strain.
- **Surface-Container-Lowest (`#ffffff`):** Pure white, used exclusively for the highest-priority "active" cards.

### The "No-Line" Rule
Sectioning must never be achieved with 1px solid borders. Boundaries are defined solely through background shifts. For example, a `surface-container-low` section should sit against the `surface` background to create a natural, sophisticated break.

### The "Glass & Gradient" Rule
To elevate the "tech-forward" personality, use Glassmorphism for floating overlays. Apply semi-transparent surface colors with a `backdrop-blur` of 12px–20px. 
*   **Signature Texture:** Main CTAs should utilize a subtle linear gradient from `primary` (`#2b4bb9`) to `primary_container` (`#4865d3`) at a 135-degree angle. This provides a "soul" to the UI that flat color cannot replicate.

## 3. Typography: Editorial Authority
The typography system pairs the technical precision of **Inter** with the bold, architectural personality of **Space Grotesk**.

*   **Display & Headlines (Space Grotesk):** These are the "anchors." Using a bold weight conveys a sense of stability and institutional trust. 
    *   *Display-Lg (3.5rem):* For hero queue numbers.
    *   *Headline-Md (1.75rem):* For establishment names.
*   **Body & Labels (Inter):** Chosen for maximum readability in high-stress environments.
    *   *Body-Lg (1rem):* Standard for form inputs and descriptions.
    *   *Label-Md (0.75rem):* Used for metadata (e.g., "SMS Sent") with increased letter spacing (0.05em).

The contrast between the wide, geometric Space Grotesk and the neutral Inter creates a bespoke, editorial feel.

## 4. Elevation & Depth: Tonal Layering
We achieve hierarchy through **Tonal Layering** rather than traditional structural lines.

*   **The Layering Principle:** Treat the UI as stacked sheets of fine paper. Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` section to create a soft, natural lift.
*   **Ambient Shadows:** Floating elements (like active queue cards) use extra-diffused shadows.
    *   *Shadow Specification:* `0px 12px 32px rgba(25, 28, 30, 0.06)`. Note the low opacity and high blur; the shadow is a tint of the `on-surface` color, mimicking natural ambient light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility in input fields, use the `outline-variant` token at **20% opacity**. Never use 100% opaque borders.

## 5. Components

### Cards for Establishments
Cards are the heart of the "Digital Curator." Use `surface-container-lowest` for the card body. 
*   **Style:** No borders. Large `xl` (0.75rem) corner radius. 
*   **Layout:** Intentional asymmetry. Place the establishment logo in a `surface-container-high` square container in the top-left, and the queue position number in a faded `on-surface-variant` display-sm font in the top-right.

### Action Buttons
*   **Primary:** Gradient fill (Primary to Primary-Container), white text, `md` (0.375rem) radius.
*   **Secondary:** `surface-container-high` background with `on-surface` text. 
*   **Interaction:** On hover, the button should not just change color, but "lift" slightly using an Ambient Shadow.

### SMS Input Fields
*   **Visuals:** Use a `surface-container-low` background. The input should feel like a "well" in the page.
*   **Typography:** The input text uses `title-lg` for high visibility of phone numbers.
*   **States:** On focus, use a "Ghost Border" of `primary` at 30% opacity.

### Queue Status Chips
*   **Action Chips:** Use `secondary_container` with `on_secondary_container` text. These should be pill-shaped (`full` roundedness) to contrast with the architectural squareness of the cards.

## 6. Do's and Don'ts

### Do:
*   **Do** use vertical white space (32px or 48px) to separate list items instead of divider lines.
*   **Do** lean into high-contrast "Display" typography for data that matters (like queue numbers).
*   **Do** use `surface-tint` sparingly to highlight active states.

### Don't:
*   **Don't** use pure black (`#000000`) for text; use `on_surface` (`#191c1e`) for a more premium, deep-grey feel.
*   **Don't** use standard "drop shadows" with 20%+ opacity. They feel dated and "heavy."
*   **Don't** mix more than two sans-serif families. Stick to the Space Grotesk/Inter pairing to maintain the editorial voice.