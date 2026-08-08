<div align="right">
  <a href="./README.md">English</a> | <strong>简体中文</strong> | <a href="./README_de.md">Deutsch</a>
</div>

# ZinsRechner

![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows-blue)
![Tauri](https://img.shields.io/badge/Tauri-v2-orange)
![React](https://img.shields.io/badge/React-v19-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

一款跨平台的轻量级本地桌面应用，专为追踪和管理活期存款（Tagesgeld）利息而设计。特别是针对那些**不提供实时利息显示**的银行账户，本应用能帮助你随时掌控已产生的收益，同时也为合理规划和设定免税额度（Freistellungsauftrag）提供精确的数据参考。基于 **Tauri v2** 与 **React 19** 构建，内置纯函数计算引擎，可根据历史利率精准测算每日累计利息。

## 核心特性

- **高精度计息引擎**：采用无状态纯函数实现，严格遵循银行业 `ACT/360` 与 `ACT/365` 标准计算利息。
- **动态数据聚合**：基于交易记录自动推导时间轴，智能过滤并聚合对应年份的 KPI、余额与利率数据。
- **100% 离线与隐私优先**：数据通过 `@tauri-apps/plugin-store` 安全持久化至系统本地沙盒（`appLocalDataDir`），无任何云端网络请求。
- **现代化 UI 架构**：结合 Tailwind CSS v4 打造全局玻璃拟态 (Glassmorphism) 设计系统，并利用 Framer Motion 实现物理级弹簧动画。
- **原生多语言 (i18n)**：内置一套轻量级事件总线，支持英语、德语和简体中文的无缝热重载切换。

## 技术栈

- **底层环境**: Tauri v2, Rust
- **前端架构**: React 19, TypeScript, Vite
- **原子化样式**: Tailwind CSS v4
- **状态与持久化**: `@tauri-apps/plugin-store`

## 安装指南

请访问 [Releases](../../releases) 页面获取适用于 macOS 和 Windows 平台的预编译安装包。

## 本地开发

开发前请确保已安装 [Node.js](https://nodejs.org/)、[pnpm](https://pnpm.io/) 及 [Rust Toolchain](https://rustup.rs/)。

```bash
# 克隆仓库
git clone https://github.com/your-username/ZinsRechner.git
cd ZinsRechner

# 安装依赖
pnpm install

# 启动本地开发服务器（支持热重载）
pnpm tauri dev

# 编译并构建生产环境包
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
