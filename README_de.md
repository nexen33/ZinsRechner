<div align="right">
  <a href="./README.md">English</a> | <a href="./README_zh-CN.md">简体中文</a> | <strong>Deutsch</strong>
</div>

# ZinsRechner

![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows-blue)
![Tauri](https://img.shields.io/badge/Tauri-v2-orange)
![React](https://img.shields.io/badge/React-v19-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

Eine native, leichtgewichtige Desktop-Anwendung zur Verfolgung und Verwaltung von Tagesgeldkonten. Besonders nützlich für Bankkonten, die **keine Echtzeit-Anzeige der aufgelaufenen Zinsen bieten**. Die App ermöglicht es, den Überblick über die erzielten Erträge zu behalten und bietet eine verlässliche Datengrundlage zur optimalen Planung und Einrichtung des Freistellungsauftrags. Basierend auf **Tauri v2** und **React 19** bietet der ZinsRechner eine unabhängige Berechnungs-Engine, um die täglichen Zinsen anhand historischer Zinssätze präzise zu ermitteln.

## Kernfunktionen

- **Präzise Zinsberechnung**: Nachbildung von Bankenstandards (`ACT/360` & `ACT/365`) durch einen zustandslosen funktionalen Ansatz zur Berechnung von Zinseszinsen und täglichen Erträgen.
- **Dynamische Datenaggregation**: Leitet aktive Jahre automatisch aus dem Transaktionsverlauf ab und filtert KPIs, Salden und historische Zinssätze intelligent und kontextbezogen.
- **Privacy First (100% Offline)**: Alle Daten werden über `@tauri-apps/plugin-store` sicher und lokal auf Ihrem Gerät (`appLocalDataDir`) gespeichert. Es finden keinerlei Netzwerkzugriffe statt.
- **Moderne UI-Architektur**: Implementiert ein Glassmorphism-Design-System mit Tailwind CSS v4 sowie physikbasierten Feder-Animationen via Framer Motion.
- **Native Lokalisierung (i18n)**: Nahtlos umschaltbare Sprachen, unterstützt Englisch, Deutsch und vereinfachtes Chinesisch ohne Neustart.

## Technologie-Stack

- **Basis**: Tauri v2, Rust
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **State & IO**: `@tauri-apps/plugin-store`

## Installation

Vorkompilierte Binärdateien für macOS (aarch64/x86_64) und Windows stehen auf der [Releases](../../releases) Seite zur Verfügung.

## Lokale Entwicklung

Stellen Sie sicher, dass [Node.js](https://nodejs.org/), [pnpm](https://pnpm.io/) und die [Rust Toolchain](https://rustup.rs/) auf Ihrem System installiert sind.

```bash
# Repository klonen
git clone https://github.com/your-username/ZinsRechner.git
cd ZinsRechner

# Abhängigkeiten installieren
pnpm install

# Entwicklungsserver mit Hot-Reload starten
pnpm tauri dev

# Für Produktion kompilieren und bauen
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
