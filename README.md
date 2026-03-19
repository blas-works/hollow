<div align="center">
  <img src="resources/icon.png" alt="Hollow Logo" width="120" height="120">

  <h1>Hollow</h1>

  <p><strong>A minimalist Pomodoro timer for desktop</strong></p>

  <p>
    <em>Focus on what matters. Time flows.</em>
  </p>

  <p>
    <a href="https://electronjs.org">
      <img alt="Electron" src="https://img.shields.io/badge/Electron-33-9FEAF9?style=flat-square&logo=electron">
    </a>
    <a href="https://react.dev">
      <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react">
    </a>
    <a href="https://www.typescriptlang.org">
      <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript">
    </a>
    <a href="https://bun.sh">
      <img alt="Bun" src="https://img.shields.io/badge/Bun-1.1-000000?style=flat-square&logo=bun">
    </a>
    <a href="https://codecov.io/gh/torrescereno/hollow">
      <img alt="Coverage" src="https://img.shields.io/codecov/c/github/torrescereno/hollow?style=flat-square&logo=codecov&label=coverage">
    </a>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#installation">Installation</a>
  </p>
</div>

---

## ✨ Features

| ⏱️ **Smart Timer**            | Customizable focus (1-90 min) and rest (1-30 min) intervals  |
| :---------------------------- | :----------------------------------------------------------- |
|                               | Pause, resume, reset, and skip rest                          |
|                               | Health warning for sessions over 30 minutes                  |
| **📊 Detailed Statistics**    | Complete session history with streaks tracking               |
|                               | 24-week activity heatmap and weekly activity view            |
|                               | CSV export and clear data options                            |
| **⚙️ Flexible Configuration** | 4 notification sounds (Bell, Digital, Wood, Tibetan Bowl)    |
|                               | Confetti celebration toggle                                  |
|                               | Always-on-top window pinning                                 |
| **🔄 Automatic Updates**      | Smart updates with critical, security, and normal priority   |
|                               | Countdown with snooze option for critical updates            |
| **💾 Local Storage**          | Private data stored locally, no internet connection required |
|                               | SQLite database with offline-first design                    |

## 📸 Screenshots

<div align="center">

|                       Timer View                        |                       Config View                        |
| :-----------------------------------------------------: | :------------------------------------------------------: |
| <img width="360" src="resources/screenshots/timer.png"> | <img width="360" src="resources/screenshots/config.png"> |

|                       Stats View                        |
| :-----------------------------------------------------: |
| <img width="360" src="resources/screenshots/stats.png"> |

</div>

## 🚀 Installation

### Downloads

Download the latest version from [GitHub Releases](https://github.com/torrescereno/hollow/releases/latest).

| Platform    | Architecture  | Format             |
| ----------- | ------------- | ------------------ |
| **Windows** | x64           | `.msi`             |
| **Linux**   | x64           | `.AppImage` `.deb` |
| **macOS**   | Apple Silicon | `.dmg` `.zip`      |
| **macOS**   | Intel         | `.dmg` `.zip`      |

#### macOS: First Run

The app is not signed with Apple Developer. After installing, run in Terminal:

```bash
xattr -cr /Applications/Hollow.app
```

> **Note:** Automatic updates are not available on macOS (requires Apple Developer signature). Download new versions manually from [Releases](https://github.com/torrescereno/hollow/releases/latest).

### Development

#### Prerequisites

- **Node.js** >= 18.x
- **Bun** >= 1.0 (recommended) or npm

#### Quick Start

```bash
# Clone the repository
git clone https://github.com/torrescereno/hollow.git
cd hollow

# Install dependencies
bun install

# Run in development mode
bun run dev
```

<details>
<summary><b>📖 Development Scripts</b></summary>

| Command               | Description                        |
| --------------------- | ---------------------------------- |
| `bun run dev`         | Development server with hot reload |
| `bun run build`       | Production build (auto-detects OS) |
| `bun run build:win`   | Build for Windows (.exe)           |
| `bun run build:mac`   | Build for macOS (.dmg)             |
| `bun run build:linux` | Build for Linux (.AppImage, .deb)  |

</details>

---

<div align="center">
  <sub>Made with ❤️ by <a href="https://github.com/torrescereno">torrescereno</a></sub>
</div>
