# Signup setup (founder ops)

**INTERNAL** — setup checklist for the locked stack: **Tally → Google Sheets** (volunteers) + **Brevo** (newsletter) + **Discord** (webhook + invite).

Public checklist page: `docs/signup-setup.html`

Do **not** invent or commit real Tally/Brevo form IDs. Paste live embeds into the site placeholders when ready.

---

## Locked stack

| Path | Tool | Destination |
|------|------|-------------|
| Volunteers | Tally form | Google Sheet + email notify + Discord webhook → private `#registrations` |
| Newsletter | Brevo (double opt-in) | List + tags `site-newsletter` / `invite` |
| Community | Discord | Roles `interested` + `volunteer`; invite URL for interested |

---

## 1) Google Sheet

1. Create a Google Sheet named **Mind Reclaim — Volunteers**.
2. Keep columns aligned with Tally fields (email, first name, locality, how they want to help, 18+/parent attestation, timestamp).
3. Share edit access only with founder / CoS as needed.

---

## 2) Tally (volunteers)

### Form fields

| Field | Required | Notes |
|-------|----------|--------|
| Email | * | Primary contact |
| First name | optional | |
| Locality | optional | City / region |
| How they want to help | yes | Short text or select |
| 18+ / parent attestation | * | Adults or parents only; no children’s data |
| Also-newsletter note | optional | Point to Brevo thank-you / homepage `#newsletter` — do not duplicate kids’ emails |

### Integrations

1. Connect Tally → Google Sheets (the Volunteers sheet).
2. Email notify founder / CoS on each submission.
3. Discord webhook → private channel `#registrations` (server webhook URL; do not commit secrets).

### Thank-you / embed

- Publish form → copy **embed URL / iframe**.
- Paste into `volunteer.html` at `<!-- TALLY_EMBED: paste iframe here -->`.
- Until live: keep mailto fallback to `hello@attentionreclaim.org`.

---

## 3) Brevo (newsletter)

1. Create a contact list for the site newsletter.
2. Enable **double opt-in**.
3. Create an embed / form; tags: `site-newsletter`, `invite` (as appropriate).
4. Paste embed into homepage `#newsletter` at `<!-- BREVO_EMBED -->`.
5. Later: configure DNS for `attentionreclaim.org` (SPF/DKIM/DMARC per Brevo docs).

Microcopy on site: short messages, double opt-in, leave anytime.

---

## 4) Discord

1. Create server for Mind Reclaim community.
2. Roles: **interested**, **volunteer**.
3. Private channel `#registrations` (staff only) + webhook for Tally.
4. Create invite URL for **interested** (not public registrations dump).
5. Paste invite into site at `<!-- DISCORD_INVITE -->` (volunteer page link text).

---

## 5) Paste back to CoS / Builder

When live, hand over (placeholders until then):

- [ ] Tally embed URL / iframe → `volunteer.html`
- [ ] Brevo form embed → `index.html` `#newsletter`
- [ ] Discord invite URL → volunteer (and optionally invite thank-you)

---

## 6) Privacy

- Community is for **adults and parents** only.
- **No children’s personal data** in forms, Sheets, Brevo, or Discord.
- Volunteer guidelines already ban collecting children’s data; attestation reinforces this.

---

## Site placeholders (Builder)

| File | Marker |
|------|--------|
| `volunteer.html` | `<!-- TALLY_EMBED: paste iframe here -->`, `<!-- DISCORD_INVITE -->` |
| `index.html` | `<!-- BREVO_EMBED -->` |
| `invite.html` | mailto fallback until invite/talk form stack decided; thank-you mentions newsletter + Discord |

See also: `README-signup.md` at site root.
