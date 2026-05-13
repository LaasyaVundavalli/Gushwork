 # Industrial Landing Page (HTML/CSS/JS)

A complete responsive industrial/manufacturing landing page for a **Premium HDPE Pipes / Industrial Infrastructure / Manufacturing Company** theme.

## Tech

- HTML5
- CSS3 (CSS variables, Flexbox, Grid, transitions)
- Vanilla JavaScript (no frameworks)

## Project structure

```
project-folder/
│
├── index.html
├── styles.css
├── script.js
├── assets/
│   └── images/
└── README.md
```

## Features implemented

- Sticky navbar
  - Initially hidden above the viewport
  - Slides in on scroll down
  - Slides out when scrolled back to the top
  - Desktop links + mobile hamburger dropdown
- Hero section
  - Two-column grid with image + premium content
  - CTA buttons + stat cards
- Stats section (grid)
- Features/services cards
  - Hover lift + image zoom
  - Responsive grid layout
- Product showcase carousel
  - Pure JS: `translateX` sliding with previous/next buttons
  - Responsive visible card counts (desktop/tablet/mobile)
- CTA section
- Modal popup quote form
  - Open via “Request Quote” buttons
  - Close via close button, outside click, or `Escape`

## How to run

1. Open `index.html` in a browser.
2. (Optional) Replace placeholder images in `assets/images/` with your own:
   - `hero.jpg`
   - `card1.jpg`, `card2.jpg`, `card3.jpg`
   - `product1.jpg` ... `product5.jpg`

## Notes

- This is a frontend-only demo; the quote form does not submit to a backend.
- Breakpoints used: 1024px, 768px, 480px.
