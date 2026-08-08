<div align="right">
  <strong>English</strong> | <a href="./README_zh-CN.md">简体中文</a> | <a href="./README_de.md">Deutsch</a>
</div>

# ZinsRechner

![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows-blue)
![Tauri](https://img.shields.io/badge/Tauri-v2-orange)
![React](https://img.shields.io/badge/React-v19-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

A native, lightweight desktop application designed for tracking and managing Tagesgeld (interest-bearing) accounts. It is especially useful for bank accounts that **do not provide real-time accrued interest displays**, allowing you to easily track your earnings and accurately plan your tax exemption orders (Freistellungsauftrag). Built with **Tauri v2** and **React 19**, ZinsRechner provides a dependency-free calculation engine to precisely compute daily accrued interest based on historical rates.

## Features

- **Pure Calculation Engine**: Replicates banking standards (`ACT/360` & `ACT/365`) using a stateless functional approach to calculate compound/daily interest.
- **Dynamic Data Aggregation**: Automatically deduces active years from transaction history, enabling context-aware filtering of KPIs, balances, and historical rates.
- **Privacy First (100% Offline)**: All data is securely persisted to your local file system (`appLocalDataDir`) via `@tauri-apps/plugin-store`. No network requests are made.
- **Modern UI Architecture**: Implements a Glassmorphism design system with Tailwind CSS v4 and physical-based spring animations via Framer Motion.
- **I18n Out-of-the-Box**: Hot-swappable localization supporting English, German, and Simplified Chinese.

## Tech Stack

- **Core**: Tauri v2, Rust
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **State & IO**: `@tauri-apps/plugin-store`, custom hooks

## Installation

Pre-built binaries for macOS (aarch64/x86_64) and Windows are available on the [Releases](../../releases) page.

## Local Development

Ensure you have [Node.js](https://nodejs.org/), [pnpm](https://pnpm.io/), and the [Rust Toolchain](https://rustup.rs/) installed on your machine.

```bash
# Clone the repository
git clone https://github.com/your-username/ZinsRechner.git
cd ZinsRechner

# Install dependencies
pnpm install

# Start the dev server with hot-reload
pnpm tauri dev

# Build for production
pnpm tauri build
```

---

<p align="center">
  <img width="7550" height="2250" alt="Image" src="https://github.com/user-attachments/assets/7c00e107-1b17-4d58-bf13-ab2b5b6e2ff4" />
</p>

<p align="center">
  <em>Viel Spaß damit!</em><br />
  <em>Entwickelt mit ❤️ von Tun&PaMa Familie</em><br />
  <em>Copyright © 2026 Tun & PaMa AG</em>
</p>
