# Signup stack (locked) — Builder summary

**Volunteers:** Tally form → Google Sheet “Attention Reclaim — Volunteers” + email notify + Discord webhook to private `#registrations`.

**Newsletter:** Brevo list with double opt-in embed; tags `site-newsletter` / `invite`. DNS for `attentionreclaim.org` later.

**Community:** Discord — roles `interested` + `volunteer`; invite URL for interested.

## Site placeholders (no real IDs in repo)

| Location | Marker |
|----------|--------|
| `volunteer.html` | `<!-- TALLY_EMBED: paste iframe here -->` |
| `volunteer.html` | `<!-- DISCORD_INVITE -->` |
| `index.html` `#newsletter` | `<!-- BREVO_EMBED -->` |

Temporary fallbacks: mailto `hello@attentionreclaim.org` on volunteer / invite until embeds are pasted.

## Founder ops

- Checklist: `docs/signup-setup.html` (INTERNAL)
- Steps: `docs/signup-setup.md`

## Privacy

Adults / parents only. No children’s personal data in Sheets, Brevo, or Discord.
