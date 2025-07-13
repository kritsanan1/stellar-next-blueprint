# Project File Structure Documentation

## Root Directory
```
├── 📄 README.md 🟢 - Main project documentation and setup guide
├── 📄 package.json 🟢 - Project dependencies and scripts configuration
├── 📄 package-lock.json 🟡 - Locked dependency versions for consistent installs
├── 📄 vite.config.ts 🟢 - Vite bundler configuration with React and TypeScript
├── 📄 tailwind.config.ts 🟢 - Tailwind CSS configuration with custom theme tokens
├── 📄 postcss.config.js 🟡 - PostCSS configuration for Tailwind processing
├── 📄 tsconfig.json 🟢 - TypeScript compiler configuration
├── 📄 tsconfig.app.json 🟡 - App-specific TypeScript settings
├── 📄 tsconfig.node.json 🟡 - Node.js TypeScript configuration
├── 📄 eslint.config.js 🟡 - ESLint configuration for code quality
├── 📄 components.json 🟡 - Shadcn/ui components configuration
├── 📄 .gitignore 🟡 - Git ignore patterns
├── 📄 bun.lockb 🟡 - Bun package manager lockfile
└── 📄 index.html 🟢 - Main HTML entry point with Vite integration
```

## Source Directory (`src/`)
```
src/
├── 📄 main.tsx 🟢 - Application entry point, React DOM mounting
├── 📄 index.css 🟢 - Global styles and design system tokens (HSL colors, gradients)
├── 📄 App.tsx 🟢 - Main app component with routing configuration
├── 📄 App.css 🟡 - Additional app-specific styles
├── 📄 vite-env.d.ts 🟡 - Vite environment type definitions
│
├── 📁 pages/ 🟢 - Application pages and route components
│   ├── 📄 Index.tsx 🟢 - Fuel station main page with payment flow
│   └── 📄 NotFound.tsx 🟡 - 404 error page component
│
├── 📁 components/ 🟢 - Reusable React components
│   ├── 📄 FuelStationHeader.tsx 🟢 - Main header with station branding
│   ├── 📄 FuelAmountSelector.tsx 🟢 - Amount selection UI (preset/custom)
│   ├── 📄 QRCodeDisplay.tsx 🟢 - QR code generation and payment status
│   ├── 📄 PaymentSuccess.tsx 🟢 - Success confirmation and fuel dispensing UI
│   │
│   └── 📁 ui/ 🟢 - Shadcn/ui design system components
│       ├── 📄 button.tsx 🟢 - Customizable button component with variants
│       ├── 📄 card.tsx 🟢 - Card container components
│       ├── 📄 input.tsx 🟢 - Form input components
│       ├── 📄 toast.tsx 🟢 - Toast notification system
│       ├── 📄 toaster.tsx 🟢 - Toast provider component
│       ├── 📄 use-toast.ts 🟢 - Toast hook utilities
│       ├── 📄 progress.tsx 🟡 - Progress bar component
│       ├── 📄 badge.tsx 🟡 - Badge/tag component
│       ├── 📄 alert.tsx 🟡 - Alert message components
│       ├── 📄 dialog.tsx 🟡 - Modal dialog components
│       ├── 📄 separator.tsx 🟡 - Visual separator component
│       └── ... (30+ other UI components) 🟡 - Complete design system library
│
├── 📁 hooks/ 🟢 - Custom React hooks
│   ├── 📄 usePaymentSession.ts 🟢 - Payment state management and simulation
│   ├── 📄 use-toast.ts 🟢 - Toast notification hook
│   └── 📄 use-mobile.tsx 🟡 - Mobile device detection
│
├── 📁 types/ 🟢 - TypeScript type definitions
│   └── 📄 fuel.ts 🟢 - Core fuel station types (PaymentSession, FuelAmount, etc.)
│
└── 📁 lib/ 🟢 - Utility libraries and helpers
    └── 📄 utils.ts 🟢 - Common utility functions (cn, clsx integration)
```

## Public Directory (`public/`)
```
public/
├── 📄 favicon.ico 🟡 - Browser tab icon
├── 📄 placeholder.svg 🟡 - Default placeholder image
└── 📄 robots.txt 🟡 - Search engine crawling instructions
```

## Key Dependencies & Relationships

### Core Application Flow
- `Index.tsx` → Orchestrates entire fuel payment flow
- `FuelAmountSelector.tsx` → Amount selection interface
- `QRCodeDisplay.tsx` → Payment QR generation and status checking
- `PaymentSuccess.tsx` → Transaction completion and fuel dispensing
- `usePaymentSession.ts` → Centralized payment state management

### Design System Architecture
- `index.css` → Defines HSL color tokens and design system
- `tailwind.config.ts` → Extends design tokens into Tailwind utilities
- `components/ui/` → Shadcn/ui components using design system tokens
- All components follow semantic token usage (no direct colors)

### Type Safety
- `fuel.ts` → Core domain types (PaymentSession, FuelAmount, FuelTransaction)
- All components properly typed with TypeScript
- Strict type checking enabled in tsconfig.json

### State Management
- `usePaymentSession.ts` → Custom hook managing payment lifecycle
- React state for UI interactions
- Local state with proper TypeScript typing

## Import Frequency Analysis
🟢 **High Priority** - Core functionality, frequently imported
🟡 **Medium Priority** - Supporting functionality, occasionally imported  
🔴 **Low Priority** - Configuration files, rarely modified

## Critical Path Components
1. `main.tsx` → `App.tsx` → `Index.tsx` (Application bootstrap)
2. `Index.tsx` → `usePaymentSession.ts` (State management)
3. `Index.tsx` → `FuelAmountSelector.tsx` → `QRCodeDisplay.tsx` → `PaymentSuccess.tsx` (User flow)
4. `index.css` → `tailwind.config.ts` → All UI components (Design system)