# Prisma website design rules

Every page follows these rules. Read this before changing the site.

## Feel
Professional and calm. The app screenshots are the stars, not effects.
No purple gradients, no emoji as icons, no fake testimonials, no generic stat strips or "FEATURES" eyebrow labels, no rows of three identical cards.

## Colour
| Token | Value | Use |
|---|---|---|
| --bg | #0b0b0d | Page background |
| --s1 | #121215 | Raised boxes, secondary buttons |
| --s2 | #18181c | Hover on raised boxes |
| --line | #26262c | Borders and dividers |
| --line2 | #34343b | Stronger borders |
| --text | #ededf0 | Main text |
| --muted | #a0a0aa | Body text under headings |
| --dim | #72727c | Small print |
| --acc | #e11d48 | Crimson: main buttons, selected tab, small marks only |
| --acc2 | #f43f5e | Crimson hover and focus ring |

Crimson is for actions. Never fill big areas with it. The only glow is one soft crimson light behind the top of the home page.

## Type
- Headings and the PRISMA wordmark: Montserrat 700, letter-spacing -0.02em (wordmark +0.14em).
- Text: IBM Plex Sans 400/500/600 (assets/fonts, OFL licence).
- Sizes: h1 36–64px, h2 28–40px, body 16–18px, small 14px. Nothing under 13px.
- Sentence case everywhere. Headlines say something specific (numbers, real features), not slogans.

## Shapes
- Content width 1160px, side padding 24px.
- Radius: buttons 10px (small 8px), screenshot frames 14px, big boxes 18px.
- Screenshot frame: 1px --line border, --s1 background, 8px padding, deep soft shadow.
- Buttons: 46px tall (small 38px). Primary = crimson fill. Secondary = --s1 fill with --line2 border.
- Icons: simple line icons (inline SVG, stroke 1.8–2, round caps).

## Motion
Small and purposeful:
- Home page top text slides up once on load. The big app picture tilts into place and follows the mouse slightly.
- Light shine on crimson buttons on hover, buttons press in on click.
- The menu bar gets slimmer after scrolling.
- Tabs crossfade the screenshot.
No fade-in-on-scroll for sections. Keep it calm with reduced motion turned on.

## Pictures
Only real screens from the app or the demo (assets/features, assets/screenshots). Re-capture them when the app changes. Keep version badges in screenshots current.

## Checking
After every change, take screenshots at 1440px and 390px wide. Check that nothing overflows, nothing overlaps and there are no console errors.
