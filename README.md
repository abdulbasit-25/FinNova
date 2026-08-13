# FinOvaa - Personal Finance & Expense Tracker

A modern, responsive web application for managing personal finances with features for tracking expenses, income, budgets, goals, and financial reports.

🌐 **Live Demo**: [https://finovaa.vercel.app/](https://finovaa.vercel.app/)

## Features

### 📊 Dashboard
- Real-time summary cards showing total income, expenses, and balance
- Quick animations with Framer Motion
- Recent transactions overview
- Monthly spending and income charts
- Weekly expense trends

### 💳 Transaction Management
- Add expenses, income, and fund transfers
- Categorize transactions with custom icons and colors
- Multiple payment methods (Cash, Card, Bank Transfer, Online Payment)
- Date and time tracking
- Form state persistence (sessionStorage)
- Transaction history with filtering and sorting

### 📁 Categories
- Create custom spending categories with Lucide React icons
- Color-coded category cards
- Track monthly spending by category
- Expense and income category management
- Default categories included

### 💰 Budget Management
- Set overall monthly budgets
- Category-specific budget limits
- Visual progress tracking
- Budget utilization indicators
- Color-coded warnings (green/yellow/red)

### 💼 Accounts
- Multiple account management (Cash, Bank, Credit Card, Digital Wallet)
- Account balance tracking
- Income and expense monitoring per account
- Transfer between accounts

### 🎯 Goals
- Create and track savings goals
- Progress visualization with progress bars
- Track goal completion status
- Fund goals from available accounts
- Goal achievement analytics

### 📈 Reports
- Monthly spending analysis
- Category-wise breakdown
- Income vs. Expense comparison
- Expense trends and patterns
- Export financial data

### ⚙️ Settings
- Light/Dark theme support
- Accent color customization
- Currency selection with symbol support (PKR, USD, etc.)
- Data export (JSON) for backup
- Full data import from previous exports
- Data reset functionality

### 📱 Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop layout with collapsible sidebar
- Smooth transitions and animations
- Touch-friendly UI components

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React (40+ icons)
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Storage**: LocalStorage & SessionStorage
- **Testing**: Vitest
- **Deployment**: Vercel

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or bun package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/finovaa.git

# Navigate to the project directory
cd finovaa

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

The application will open at `http://localhost:8082` (or next available port)

## Development

```bash
# Start development server with hot module replacement
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

## Project Structure

```
src/
├── components/
│   ├── layout/              # Layout components (Sidebar, AppLayout, etc.)
│   ├── dashboard/           # Dashboard-specific components
│   ├── modals/              # Reusable modal components
│   └── ui/                  # shadcn/ui components
├── pages/                   # Page components (Dashboard, Transactions, etc.)
├── hooks/                   # Custom React hooks
├── contexts/                # React Context (AppContext)
├── lib/                     # Utility functions and helpers
├── types/                   # TypeScript type definitions
├── App.tsx                  # Main app component with routing
└── main.tsx                 # Entry point
```

## Key Features Implementation

### State Management
- Global app state using React Context API
- Automatic persistence to LocalStorage
- Session-based form state recovery

### Data Persistence
- All transactions, categories, and accounts saved to browser storage
- Export/Import functionality for data backup
- Optional cloud sync (future feature)

### Form Validation
- Real-time validation for all forms
- Clear error messages
- Field-level error tracking
- Toast notifications for user feedback

### Responsive Layout
- Mobile sidebar hidden by default
- Bottom navigation for mobile
- Collapsible sidebar for desktop
- Proper breakpoints: sm (640px), md (768px), lg (1024px)

## Deployment

The application is deployed on Vercel and automatically updates with each push to the main branch.

**Deployed Link**: [https://finovaa.vercel.app/](https://finovaa.vercel.app/)

### Deploy Your Own

1. Fork this repository
2. Sign up for [Vercel](https://vercel.com)
3. Connect your GitHub repository to Vercel
4. Vercel will automatically build and deploy on each push

```bash
# Alternatively, deploy with Vercel CLI
npm install -g vercel
vercel
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Available Routes

- `/` - Dashboard
- `/transactions` - Transaction list and management
- `/categories` - Category management
- `/accounts` - Account management
- `/budgets` - Budget planning
- `/goals` - Savings goals
- `/reports` - Financial reports
- `/settings` - App settings
- `/about` - About page

## Keyboard Shortcuts

- `Esc` - Close modals and go back
- `Tab` - Navigate form fields
- `Enter` - Submit forms

## Known Limitations

- Maximum 500KB file size for data export/import
- Single user per browser (no authentication)
- Data persists only on current device

## Future Enhancements

- [ ] User authentication
- [ ] Cloud sync
- [ ] Mobile app (React Native)
- [ ] Bill reminders
- [ ] Recurring transactions automation
- [ ] Advanced analytics and insights
- [ ] Multi-currency support (exchange rates)
- [ ] Budget alerts and notifications
- [ ] Data visualization improvements
- [ ] Dark mode optimization

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please:
- Open an issue on GitHub
- Contact the development team
- Check existing documentation

## Changelog

### Version 1.0.0 (Current)
- Initial release with full feature set
- Mobile-responsive design
- Lucide React icon integration
- Theme customization
- Data import/export

---

**Built with ❤️ for better financial management**

Last Updated: February 2026
