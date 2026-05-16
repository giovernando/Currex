# 📟 vrnan Calculator (Currex)

A state-of-the-art, high-performance Progressive Web App (PWA) that blends **Retro Industrial Aesthetics** with modern engineering. Designed for precision, speed, and a premium tactile experience.

## Overview

**vrnan Calculator** is more than just a math tool—it's a digital hardware recreation. Every interaction is designed to feel physical, from the beveled button shadows to the CRT-style scanlines on the LCD display. It features a robust scientific engine and a live currency converter powered by real-time market data.

## Key Features

### 1. Dual-Mode Calculator
- **Standard Mode**: Efficient, large-button interface for daily math.
- **Scientific Mode**: Advanced trigonometry (sin, cos, tan), logarithms, square roots, and constants (π, x²).
- **Persistence**: Automatically saves calculation history to local storage.
- **Smart Formatting**: Uses `id-ID` locale conventions (dots for thousands, commas for decimals) for maximum clarity.

### 2. Live Currency Converter
- **Real-time Rates**: Fetches data from the **Frankfurter API**.
- **Caching Engine**: Built-in 30-minute cache to save data and ensure performance.
- **Huge-Digit Display**: Oversized input fields (`7xl/8xl`) for the main amount, optimized for visibility.
- **Swap & Refresh**: Instant currency swapping and manual rate refreshing with loading states.

### 3. Progressive Web App (PWA)
- **Offline Mode**: Works without an internet connection using Service Workers.
- **Installable**: Full-screen "standalone" mode on iOS, Android, and Desktop.
- **Manifest**: Custom iconography and theme color integration for a native app feel.

### 4. Tactile Experience
- **Haptic Feedback**: Custom vibration patterns for "AC", "Equals", and standard keys.
- **Mechanical UI**: Simulated beveled borders (`shadow-key`) and active-state translations (`active:translate-y-0.5`).
- **LCD Scanlines**: CSS-powered CRT overlays on the greenish-olive display area.

## Technical Architecture

### Core Components
- `Calculator.tsx`: The primary UI container for math logic.
- `CurrencyConverter.tsx`: Dedicated module for financial conversions.
- `CalcKey`: High-performance motion-based button component.

### Logic & Hooks
- `useCalculator`: Manages the state machine for inputs, operations, and history.
- `useCurrencyConverter`: Handles async API calls, error states, and numerical parsing.
- `useHaptics`: Interface for the `window.navigator.vibrate` API.
- `formatNumber`: Utility for regex-based expression formatting and locale-aware number strings.

### Styling & Design
- **Tailwind CSS**: Custom configuration in `tailwind.config.ts` for retro fonts (`VT323`, `Space Grotesk`).
- **Framer Motion**: Handles all transitions, height animations, and mode-switching effects.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or bun

### Setup
1. Clone the repo:
   ```bash
   git clone https://github.com/giovernando/Currex.git
   ```
2. Install:
   ```bash
   npm install
   ```
3. Run:
   ```bash
   npm run dev
   ```

## Project Structure
```text
src/
├── components/      # UI Components (Calculator, Converter, Nav)
├── hooks/           # Business Logic & API Hooks
├── lib/             # Utilities (formatting, cn)
├── pages/           # Page layouts
├── index.css        # Core Design System (HSL tokens)
└── main.tsx         # App Entry
```

## 📄 License
MIT © [vrnan](https://github.com/giovernando)