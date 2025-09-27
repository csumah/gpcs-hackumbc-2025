# Assets Directory

Place all static game/media assets here. Served statically by Next.js under `/assets/...`.

Structure:
- `sprites/` – Character, enemy, environment sprite sheets
- `ui/` – Buttons, panels, HUD elements
- `audio/` – Sound effects (SFX) & music (MIDI/MP3/OGG/WAV)
- `misc/` – Temporary or uncategorized assets

Naming convention: `type_subject_variant_state@scale.ext`
Examples:
- `player_idle_0@1x.png`
- `player_idle_0@2x.png`
- `button_primary_hover.png`

Include a matching `.license.txt` or attribution line in `doc/asset-attribution.md` for any third‑party asset.
