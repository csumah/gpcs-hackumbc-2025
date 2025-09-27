This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Game Docs & Assets

Project-specific documents live in `doc/`:
- `game-design.md` – High level & mechanics (exportable to PDF for sharing)
- `asset-guidelines.md` – How to add & name assets
- (Add) `asset-attribution.md` – Third‑party license & credit list (create when needed)

Static game/media files live in `public/assets/` and are served at `/assets/...`.
Subfolders:
```
public/assets/
  sprites/
  ui/
  audio/
  misc/
```
Add new files there and reference them with paths like `/assets/sprites/player_idle_0@1x.png`.

### Exporting the Game Design PDF

Option 1 (VS Code):
1. Open `doc/game-design.md`
2. Ctrl+Shift+P → "Markdown: Print to HTML" → open HTML in browser → Print → Save as PDF

Option 2 (CLI tool):
Install once:
```bash
npm install --save-dev md-to-pdf
```
Run:
```bash
npx md-to-pdf doc/game-design.md --config-file=none --dest doc/game-design.pdf
```
(Add the command as an npm script if used often.)

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
