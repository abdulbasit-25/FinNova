<div align="center">

# 💸 FinNovaa

**A modern, responsive personal finance & expense tracker**

Track spending, manage budgets, hit savings goals, and see where your money actually goes — all in one clean dashboard.

[**Live Demo →**](https://finovaa.vercel.app/)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## Overview

FinOvaa is a full-featured expense tracker built for people who want clarity on their money without signing up for yet another account. Everything runs client-side — transactions, budgets, accounts, and goals are all stored in the browser, with export/import for backup.

## ✨ Features

### 📊 Dashboard

- Real-time summary cards for income, expenses, and balance
- Smooth entrance animations with Framer Motion
- Recent transactions overview
- Monthly spending/income charts and weekly trends

### 💳 Transactions

- Log expenses, income, and transfers between accounts
- Custom categories with icons and colors
- Multiple payment methods (Cash, Card, Bank Transfer, Online Payment)
- Date/time tracking with form-state recovery (sessionStorage)
- Filterable, sortable transaction history

### 📁 Categories

- Custom spending categories with Lucide icons
- Color-coded cards and monthly spend-by-category tracking
- Separate expense and income category sets, with sensible defaults

### 💰 Budgets

- Overall monthly budget plus per-category limits
- Visual progress tracking with green/yellow/red utilization warnings

### 💼 Accounts

- Multiple accounts — Cash, Bank, Credit Card, Digital Wallet
- Per-account balance, income, and expense tracking
- Transfers between accounts

### 🎯 Goals

- Create and track savings goals with progress bars
- Fund goals directly from an account
- Goal completion analytics

### 📈 Reports

- Monthly spending analysis and category breakdowns
- Income vs. expense comparison and trend patterns
- Exportable financial data

### ⚙️ Settings

- Light/dark theme with accent color customization
- Currency selection with symbol support (PKR, USD, etc.)
- Full JSON export/import for backup and migration
- Data reset

### 📱 Responsive by Default

- Mobile-first layout with a bottom nav on small screens
- Collapsible sidebar on desktop
- Touch-friendly components throughout, breakpoints at `sm` (640px), `md` (768px), `lg` (1024px)

## 🛠 Tech Stack

| Layer         | Choice                        |
| ------------- | ----------------------------- |
| Framework     | React 18                      |
| Build Tool    | Vite                          |
| Language      | TypeScript                    |
| Styling       | Tailwind CSS                  |
| UI Components | shadcn/ui                     |
| Icons         | Lucide React (40+ icons)      |
| Routing       | React Router v7               |
| Animation     | Framer Motion                 |
| State         | React Context API             |
| Storage       | LocalStorage & SessionStorage |
| Testing       | Vitest                        |
| Deployment    | Vercel                        |

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- npm or bun

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/finovaa.git
cd finovaa

# Install dependencies
npm install
# or
bun install

# Start the dev server
npm run dev
# or
bun run dev
```

App runs at `http://localhost:8082` (or the next available port).

### Scripts

```bash
npm run dev       # Dev server with HMR
npm run build     # Production build
npm run preview   # Preview the production build
npm run test      # Run tests with Vitest
```

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/       # Sidebar, AppLayout, etc.
│   ├── dashboard/     # Dashboard-specific components
│   ├── modals/        # Reusable modal components
│   └── ui/            # shadcn/ui components
├── pages/              # Dashboard, Transactions, Budgets, etc.
├── hooks/              # Custom React hooks
├── contexts/           # React Context (AppContext)
├── lib/                # Utilities and helpers
├── types/              # TypeScript type definitions
├── App.tsx             # Root component + routing
└── main.tsx            # Entry point
```

## 🧩 Implementation Notes

**State management** — global app state via React Context, with automatic persistence to LocalStorage and session-based form recovery.

**Data persistence** — transactions, categories, and accounts all live in browser storage; export/import handles backup, with cloud sync planned.

**Form validation** — real-time, field-level error tracking with toast feedback.

**Responsive layout** — sidebar hidden by default on mobile in favor of bottom nav, collapsible on desktop.

## 🗺 Routes

| Path            | Page                          |
| --------------- | ----------------------------- |
| `/`             | Dashboard                     |
| `/transactions` | Transaction list & management |
| `/categories`   | Category management           |
| `/accounts`     | Account management            |
| `/budgets`      | Budget planning               |
| `/goals`        | Savings goals                 |
| `/reports`      | Financial reports             |
| `/settings`     | App settings                  |
| `/about`        | About                         |

## ⌨️ Keyboard Shortcuts

- `Esc` — close modals / go back
- `Tab` — navigate form fields
- `Enter` — submit forms

## ⚠️ Known Limitations

- 500KB max file size for data export/import
- Single user per browser (no auth)
- Data persists only on the current device

## 🔭 Roadmap

- [ ] User authentication
- [ ] Cloud sync
- [ ] Mobile app (React Native)
- [ ] Bill reminders
- [ ] Recurring transaction automation
- [ ] Advanced analytics and insights
- [ ] Multi-currency support (live exchange rates)
- [ ] Budget alerts and notifications
- [ ] Deeper data visualization
- [ ] Dark mode refinements

## 🌍 Browser Support

Chrome/Edge, Firefox, Safari (latest), and mobile browsers (iOS Safari, Chrome Mobile).

## 📄 License

MIT — see the `LICENSE` file for details.

## 💬 Support

Open an issue on GitHub, or reach out to the development team via the links below.

---

<div align="center">

### Powered by <a href="https://abdulbasit-archer.vercel.app/"><strong>ARCHER</strong></a>

[Portfolio](https://abdulbasit-archer.vercel.app/) · [LinkedIn](https://lnkd.in/p/ddQJfr8x)

_Built with ❤️ for better financial management_

Last Updated: August 2026

</div>
