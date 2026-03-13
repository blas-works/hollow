<div align="center">
  <img src="resources/icon.png" alt="Hollow Logo" width="120" height="120">

  <h1>Hollow</h1>

  <p><strong>Un temporizador Pomodoro minimalista para escritorio</strong></p>

  <p>
    <em>Enfócate en lo importante. El tiempo fluye.</em>
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
    <a href="#features">Características</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Arquitectura</a> •
    <a href="#instalación">Instalación</a>
  </p>
</div>

---

## ✨ Características

| ⏱️ **Timer Inteligente**                      | 📊 **Estadísticas Detalladas**          |
| :-------------------------------------------- | :-------------------------------------- |
| Intervalos personalizables de focus y break   | Historial completo de sesiones y rachas |
| **⚙️ Configuración Flexible**                 | **💾 Storage Local**                    |
| Duración, sonidos y comportamiento de ventana | Datos privados, sin conexión a internet |

---

## 🛠️ Tech Stack

### Frontend

| Tecnología          | Propósito       |
| ------------------- | --------------- |
| **React 19**        | Framework UI    |
| **TypeScript**      | Tipado estático |
| **Tailwind CSS v4** | Estilos         |
| **Motion**          | Animaciones     |
| **Lucide React**    | Iconos          |

### Desktop

| Tecnología         | Propósito                     |
| ------------------ | ----------------------------- |
| **Electron 33**    | Framework de escritorio       |
| **Electron Store** | Persistencia de configuración |

### Build

| Herramienta          | Propósito       |
| -------------------- | --------------- |
| **Vite**             | Build tool      |
| **Bun**              | Package manager |
| **Electron Builder** | Empaquetado     |

---

## 🏗️ Arquitectura

Hollow sigue una **arquitectura en capas** con separación clara de responsabilidades:

### System Overview

```mermaid
graph TB
    subgraph Electron
        MAIN[Main Process]
        PRELOAD[Preload]
        IPC[IPC Handlers<br/>app, window<br/>config, session]
    end

    subgraph React App
        APP[App]

        subgraph Views
            TIMER[TimerView]
            MENU[MenuView]
            CONFIG[ConfigSection]
            STATS[StatsSection]
        end

        subgraph Components
            TIMER_COMP[Timer]
            CONTROLS[Controls]
            BUTTON[Button]
            TOGGLE[Toggle]
            SLIDER[ConfigSlider]
            STAT_CARD[StatCard]
            MENU_NAV[MenuNav]
            MENU_FOOTER[MenuFooter]
            SOUND_SELECTOR[SoundSelector]
            BACK[BackButton]
        end

        subgraph State
            HOOKS[Hooks<br/>useTimer, useConfig<br/>useSessions, useStats<br/>usePinned, useSound<br/>useViewTransition]
            SERVICES[Services<br/>config, sessions<br/>electron, window]
        end

        subgraph Data
            SCHEMAS[Schemas<br/>config, session, stats<br/>view, electron]
            STORE[Electron Store]
        end

        subgraph Database
            DB_SCHEMA[Schema<br/>session, streak]
            DB_REPO[Repositories<br/>session, streak]
            DB_SERVICE[Services<br/>stats]
        end
    end

    MAIN --> PRELOAD
    PRELOAD --> APP
    IPC --> MAIN

    APP --> TIMER
    APP --> MENU
    MENU --> CONFIG
    MENU --> STATS

    TIMER --> TIMER_COMP
    TIMER --> CONTROLS
    TIMER --> BUTTON
    TIMER --> TOGGLE

    CONFIG --> SLIDER
    CONFIG --> SOUND_SELECTOR
    STATS --> STAT_CARD
    MENU --> MENU_NAV
    MENU --> MENU_FOOTER

    CONFIG --> BACK
    STATS --> BACK

    HOOKS --> SERVICES
    SERVICES --> SCHEMAS
    SERVICES --> STORE
    SERVICES --> DB_SERVICE
    DB_SERVICE --> DB_REPO
    DB_REPO --> DB_SCHEMA
    STORE --> MAIN
```

### Resumen de Capas

| Capa           | Responsabilidad                    | Tecnologías                 |
| -------------- | ---------------------------------- | --------------------------- |
| **Views**      | UI y presentación                  | React, TypeScript           |
| **Components** | Primitivos UI reutilizables        | React                       |
| **State**      | Lógica de negocio y flujo de datos | Custom Hooks                |
| **Services**   | Integraciones externas             | Electron API                |
| **Data**       | Persistencia y esquemas            | Electron Store, Zod         |
| **Database**   | Almacenamiento estructurado        | Better-SQLite3, Drizzle ORM |

---

## 📸 Screenshots

<div align="center">

> **🖼️ Próximamente:** Capturas de pantalla de la aplicación

|  Timer View   |   Menu View   |
| :-----------: | :-----------: |
| _Placeholder_ | _Placeholder_ |

|  Config View  |  Stats View   |
| :-----------: | :-----------: |
| _Placeholder_ | _Placeholder_ |

</div>

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 18.x
- **Bun** >= 1.0 (recomendado) o npm

### Quick Start

```bash
# Clonar el repositorio
git clone https://github.com/torrescereno/hollow.git
cd hollow

# Instalar dependencias
bun install

# Ejecutar en modo desarrollo
bun run dev
```

### Build para Producción

```bash
# Build para el SO actual
bun run build

# Builds específicos por plataforma
bun run build:win    # Windows (.exe)
bun run build:mac    # macOS (.dmg)
bun run build:linux  # Linux (.AppImage, .deb)
```

<details>
<summary><b>📖 Scripts de Desarrollo</b></summary>

| Comando               | Descripción                             |
| --------------------- | --------------------------------------- |
| `bun run dev`         | Servidor de desarrollo con hot reload   |
| `bun run build`       | Build para producción (auto-detecta OS) |
| `bun run build:win`   | Build para Windows (.exe)               |
| `bun run build:mac`   | Build para macOS (.dmg)                 |
| `bun run build:linux` | Build para Linux (.AppImage, .deb)      |

</details>

---

<div align="center">
  <sub>Hecho con ❤️ por <a href="https://github.com/torrescereno">torrescereno</a></sub>
</div>
