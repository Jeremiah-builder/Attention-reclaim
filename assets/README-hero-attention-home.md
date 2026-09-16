# Homepage hero — Attention coming home (Concept 1)

**Status: Founder approved 2026-09-16 — live on homepage (stills + CSS crossfade).**

## Preview (review this first)

Open locally (or via Worker static path):

`/workspace/attention-reclaim/site/assets/hero-attention-home-preview.html`

Title is marked **PREVIEW — not live**. Cream full-page mock at homepage hero size with the 7s crossfade.

## Production path (storyboard fidelity)

Illustrated stills + CSS opacity crossfade — **not** the thin geometric SVG.

| File | Role |
|------|------|
| `hero-attention-home/frame-1.png` … `frame-4.png` | Keyframes (~1120×720): feed+sparks → fly to mind → gather → **F1 mind+clay heart + soft glow** |
| `hero-attention-home.css` | 7s infinite crossfade; `border-radius: 16px`; `prefers-reduced-motion` → **frame-4 only**, animations off |
| `hero-attention-home.partial.html` | Drop-in `<figure class="hero-media">` with stacked imgs |
| `hero-attention-home-preview.html` | Founder review page |

### Beats (~7s)

1. Muted feed; clay sparks leave  
2. Sparks fly toward leaf mind outline  
3. Sparks gather inside mind  
4. Heart home — exact F1 crop composited, soft glow, cream `#F7F0E6`

Palette: `#F7F0E6` `#C45C26` `#2F6B4F` `#1A1614` `#F3DCC8`  
No MP4. No Lottie.

## How to swap (after Founder OK)

1. Link `assets/hero-attention-home.css` from the homepage `<head>`.  
2. Replace the hero `<figure class="hero-media">…</figure>` with the contents of `hero-attention-home.partial.html` (paths assume site root → `assets/hero-attention-home/frame-N.png`).  
3. Confirm reduced-motion: only frame 4 visible.  
4. Do **not** re-introduce the schematic SVG as the live hero.

## Deprecated

`hero-attention-home.svg` — thin geometric/schematic loop rejected for wireframe mismatch. Kept only as archive reference. **Production path = stills + CSS** for storyboard fidelity.

Updated 2026-09-16T14:36Z — clearer phone/feed in frames 1–2; Founder review before live.
