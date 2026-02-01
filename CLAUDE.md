# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Netlify Extension that installs Dart Sass during the build process. Built using the Netlify SDK, it provides a UI for configuration and a build event handler that downloads and installs a specified version of Dart Sass before the site build.

## Development Commands

### Build the extension
```bash
npm run build
```
Builds the extension into the `.ntli` folder, which Netlify uses to run the extension. The build process compiles both backend code and UI components.

### Development server
```bash
npm run dev
```
Starts the development server.

### Development server with UI
```bash
npm run dev:open
```
Starts the development server and automatically opens the UI.

## Architecture

### TypeScript Configuration

The project uses a composite TypeScript setup with three configurations:

- `tsconfig.json`: Root config that references both UI and backend configs
- `tsconfig.backend.json`: Backend code (excludes `src/ui/`)
- `tsconfig.ui.json`: UI code using React and Vite (includes `src/ui/` and `src/types/`)

### Directory Structure

```
src/
├── index.ts              # Main extension entry point with build event handler
├── endpoints/            # Netlify Functions endpoints
│   └── trpc.ts          # tRPC endpoint handler
├── server/              # Backend logic
│   ├── router.ts        # tRPC router with teamSettings and buildEventHandler procedures
│   └── trpc.ts          # tRPC initialization with Netlify SDK context
├── schema/              # Zod schemas for configuration validation
│   ├── team-config.ts   # Team-level configuration schema
│   └── site-config.ts   # Site-level configuration schema
├── ui/                  # React frontend (built with Vite)
│   ├── index.tsx        # UI entry point
│   ├── App.tsx          # Main app with tRPC provider and surface routing
│   ├── trpc.ts          # tRPC React client
│   └── surfaces/        # UI surfaces for different Netlify configuration pages
│       ├── SiteConfiguration.tsx
│       └── TeamConfiguration.tsx
└── types/               # TypeScript type definitions
    ├── images.d.ts
    └── stylesheets.d.ts
```

### Key Components

#### Build Event Handler (src/index.ts)

The `onPreBuild` handler:
1. Checks if enabled via `NETLIFY_EXTENSION_DARTSASS_ENABLED` environment variable
2. Reads `DART_SASS_VERSION` from build environment (defaults to 1.97.3)
3. Downloads and installs Dart Sass from GitHub releases
4. Prepends installation commands to the site's build command

#### tRPC API (src/server/router.ts)

The API provides three main procedure groups:

- `teamSettings`: Query and mutate team-level configuration
- `buildEventHandler.status`: Check if the handler is enabled for a site
- `buildEventHandler.enable`: Enable by setting `NETLIFY_EXTENSION_DARTSASS_ENABLED=true`
- `buildEventHandler.disable`: Disable by deleting the environment variable

All procedures use the Netlify SDK client from the tRPC context to interact with Netlify APIs.

#### UI Architecture (src/ui/)

The UI is a React application using:
- tRPC for type-safe API calls
- React Query for data fetching
- Netlify SDK UI components for surface routing
- Two surfaces: `SiteConfiguration` and `TeamConfiguration` (defined in `extension.yaml`)

The app uses `useNetlifyExtensionUIFetch()` to get an authenticated fetch function for tRPC calls.

### Build Output

The build process outputs to `.ntli/`:
- `index.js`: Compiled extension code
- `build/`: Backend build artifacts
- `site/static/ui/`: Frontend build artifacts (from Vite)

### Configuration Files

- `extension.yaml`: Extension metadata, slug, and enabled UI surfaces
- `netlify.toml`: Build configuration and functions directory
- `vite.config.ts`: Vite configuration with React plugin and TailwindCSS
- `tailwind.config.ts`: TailwindCSS configuration

## Important Notes

- The extension requires both `teamId` and `siteId` for build event handler operations
- Configuration schemas use Zod for validation with a minimum version string length of 5 characters
- The tRPC endpoint is exposed at `/api/trpc{/*}?` via Netlify Functions
- UI surfaces must be enabled in `extension.yaml` to appear in the Netlify UI
