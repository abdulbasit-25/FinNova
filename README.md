# ExpenseTracker

A lightweight personal finance dashboard built with Vite + React + TypeScript and Tailwind CSS.

## Features
- Dashboard with summary cards and charts
- Transactions, Categories, Budgets, Accounts, Reports, Goals, Settings
- Mobile-first responsive UI with an accessible hamburger menu
- Quick add transaction button

## Tech Stack
- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui style primitives
- React Router

## Quickstart
Prerequisites: Node 18+ and npm

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview the production build locally

```bash
npm run preview
```

## Vercel deployment notes
- This repo includes a `vercel.json` configured for a Vite SPA (rewrites all routes to `index.html`).
- In the Vercel Project Settings set:
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
  - **Root Directory**: (the folder that contains `package.json` — usually the repo root)
- If you use Next.js instead, remove or adapt `vercel.json` so Vercel can use the Next.js preset.

## Important files
- Mobile nav component: src/components/layout/MobileNav.tsx
- Layout wrapper: src/components/layout/AppLayout.tsx
- Desktop sidebar: src/components/layout/Sidebar.tsx
- Vercel config: vercel.json

## Mobile nav & "Powered by Archer"
- The mobile hamburger now contains all nav items and an external link: https://abdulbasit-archer.vercel.app/ (opens in new tab with `rel="noopener noreferrer"`).
- To change or move the "Powered by" link, edit `src/components/layout/MobileNav.tsx` (the anchor element is near the bottom of the nav list).

## Contributing
- Fork, create a branch, submit a PR. Keep changes focused and include tests where appropriate.

## License
MIT
## 🚀 Updated Section
This README was updated.
