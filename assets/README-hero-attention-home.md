Builder: replace homepage hero `<figure class="hero-media">` img with `hero-attention-home.partial.html` (or link `hero-attention-home.css` + inline `hero-attention-home.svg`); keep prefers-reduced-motion.

Files:
- `hero-attention-home.svg` — self-contained 7s CSS/SVG loop (F1 mind+heart paths)
- `hero-attention-home.css` — `.hero-media` sizing + reduced-motion overrides when inlined
- `hero-attention-home.partial.html` — drop-in `<figure class="hero-media">`
- `hero-attention-home-preview.html` — local check (optional)
