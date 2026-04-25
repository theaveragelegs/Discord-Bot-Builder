# Discord-Bot-Builder
A visual, node-based Discord bot builder



  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" alt="Version" />
    <img src="https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen.svg" alt="Node version" />
    <img src="https://img.shields.io/badge/React-18-61dafb.svg?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Discord.js-v14-5865F2.svg?logo=discord" alt="Discord.js" />
  </p>
</div>

---

## Project Status: Work In Progress

**Note: This project is currently in active development and is not ready for production use.** 

The base of the application (the visual editor, node system, and code generation framework) is complete and functional. However, there are known bugs and incomplete features:
- **Bugs:** You may encounter crashes or unexpected behavior while building bots.
- **Incomplete Blocks:** Some of the 80+ blocks in the visual editor are not fully implemented or may not work as expected when exported.

If you are a developer looking to contribute or experiment, the foundation is solid, but please be aware of these limitations.

## Features

- **Visual Node Editor** — Intuitive drag-and-drop interface powered by React Flow. Choose from over 80+ custom nodes to build out commands, events, and complex logic.
- **Local SQLite Database** — Keep your data yours. Save unlimited projects, versions, and settings locally using a blazing fast SQLite database.
- **Real-time Code Preview** — See your generated discord.js code update in real-time as you connect blocks on the canvas.
- **Music Bot Ready** — Built-in support for advanced music features using robust extractors (YouTube, Spotify, SoundCloud) and @distube/ytdl-core.
- **1-Click Export** — Get a complete, ready-to-run Discord bot project exported as a ZIP file.
- **Integrated Test Runner** — Test your generated bot directly from the builder's interface without needing to manually run scripts.
- **Discord-style UI** — A beautiful, dark-themed user interface that matches the native Discord aesthetic, built with TailwindCSS and shadcn/ui.

## Quick Start

Getting started is easy. Since this is a monorepo containing both the frontend and backend, you can start everything with a single command.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/discord-bot-builder.git
   cd discord-bot-builder
   ```

2. Install all dependencies across the workspace:
   ```bash
   npm install
   ```

3. Configure your environment variables:
   ```bash
   cp .env.example .env
   ```
   *(Make sure to open .env and set any required keys, such as your encryption key)*

4. Start the development servers:
   ```bash
   npm run dev
   ```

The application will start concurrently:
- **Frontend (Visual Editor):** http://localhost:5173
- **Backend (API):** http://localhost:3001

## Project Structure

This project is organized as a monorepo using npm workspaces:

```text
discord-bot-builder/
├── backend/          # Express API + SQLite Database
│   └── src/
│       ├── index.js          # Server entry point
│       ├── db.js             # SQLite database schema setup
│       ├── routes/           # API endpoints
│       ├── controllers/      # Export & generation business logic
│       └── utils/            # Code generation helpers
├── frontend/         # React + Vite + React Flow UI
│   └── src/
│       ├── App.jsx           # Main application layout
│       ├── components/       # shadcn/ui components & Editor
│       ├── nodes/            # 80+ custom React Flow nodes
│       └── store/            # Zustand state management
├── package.json      # Root workspace configuration
└── .env.example      # Environment variable template
```

## Tech Stack

| Layer | Technologies Used |
|-------|------------------|
| **Backend** | Node.js, Express, better-sqlite3, archiver |
| **Frontend** | React 18, Vite, @xyflow/react, Zustand, TailwindCSS, shadcn/ui |
| **Database** | SQLite (Local File Storage) |
| **Generated Bots** | Node.js, discord.js (v14), discord-player |

## Building for Production

If you want to build the frontend and run the application in a more production-like state locally:

```bash
npm run prod
```
This will build the Vite frontend and serve it alongside the backend API.

## Contributing

Contributions are always welcome! Whether it's adding new node types, improving the code generator, or fixing bugs:
just text me on discord about it theaveragelego
