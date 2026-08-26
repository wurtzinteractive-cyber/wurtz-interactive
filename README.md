# Wurtz' Interactive

A high-motion React/Vite portfolio-style game studio website inspired by the interaction language of the Hazelight website: bold typography, smooth scrolling, playful reveals, interactive cursor glow, and a logo-first opening transition.

## Stack

- React 19
- Vite 7
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- CSS animations / responsive layout

## Run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Structure

- `#home` — hero / landing screen
- `#about` — studio statement
- `#games` — game cards
- `#contact` — contact CTA

## Replace the placeholder content

1. Update the game data in `src/main.jsx`.
2. Replace the CSS-generated game art with real WebP/AVIF images when assets are available.
3. Replace the email/social links in `Contact()`.
4. Customize `--accent`, typography, and spacing in `src/styles.css`.

## Animation note

The intro intentionally uses the logo itself as the first transition: letters rise in, a line draws beneath the logo, the logo exits upward, and the intro panel wipes away to reveal the site. Scroll-triggered text reveals and a mouse-reactive glow continue the interaction language throughout the page.
