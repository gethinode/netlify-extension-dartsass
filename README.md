# Netlify Extension: Dart Sass Prebuild

This extension installs [Dart Sass][dartsass] during the Netlify build process to enable the latest features of the Sass language for your [Hugo][hugo] deployments. It provides a convenient UI-based configuration and ensures the correct Dart Sass binary is available within all build contexts of [Netlify][netlify].

## Features

- 🎯 **Automated Installation**: Installs Dart Sass before your site builds
- ⚙️ **Configurable Version**: Set your preferred Dart Sass version via team configuration
- 🔄 **All Build Contexts**: Works across production deploys, deploy previews, and branch deploys
- 🎨 **UI Configuration**: Easy enable/disable and version management through Netlify UI
- 🚀 **Hugo Compatible**: Designed for [Hugo][hugo] projects using Dart Sass

## Installation

### 1. Install the Extension

Install the extension from the Netlify Extensions directory:

1. Navigate to your team in Netlify
2. Go to **Extensions** → **Browse Extensions**
3. Search for "Dart Sass Prebuild Extension", or [navigate to the extension directly](https://app.netlify.com/extensions/bv2wdvol-dartsass)
4. Click **Install**

### 2. Enable for Your Project

Once installed, enable the build event handler for each project:

1. Go to your project in Netlify
2. Navigate to **Extensions**
3. Find **Dart Sass Prebuild Extension**
4. Click **Enable** to activate the build event handler

The extension will now install Dart Sass before each build.

## Configuration

### Team Configuration

Configure the Dart Sass version at the team level:

1. Go to **Team Settings** → **Extensions**
2. Find **Dart Sass Prebuild Extension**
3. Set your preferred **Dart Sass Version** (e.g., `1.97.3`)
4. Click **Save**

This version will be used for all sites in your team that have the extension enabled.

### Version Priority

The extension determines which Dart Sass version to install using this priority:

1. **Build environment variable** - highest priority
2. **Team configuration** - set via the extension UI
3. **Default version** (`1.97.3`) - fallback if not configured

To override the team configuration for a specific site, set the following variable in your `netlify.toml`:

```toml
[build.environment]
DART_SASS_VERSION = "1.97.3"
```

### Enable/Disable

You can enable or disable the build event handler at any time:

- **Enable**: Activates Dart Sass installation for all builds
- **Disable**: Removes the build event handler (Dart Sass will not be installed)

The extension creates an environment variable `NETLIFY_EXTENSION_DARTSASS_ENABLED` when enabled, which controls whether the build event handler runs.

## How It Works

This extension uses a Netlify build event handler that runs during the `onPreBuild` phase. It prepends an installation script to your build command, ensuring the Dart Sass binary is available before your site builds.

The installation script downloads and extracts Dart Sass:

```bash
curl -sLJO "https://github.com/sass/dart-sass/releases/download/${version}/dart-sass-${version}-linux-x64.tar.gz" && \
tar -xf dart-sass-${version}-linux-x64.tar.gz && \
rm "dart-sass-${version}-linux-x64.tar.gz" && \
export PATH=/opt/build/repo/dart-sass:$PATH
```

This ensures Dart Sass is available to tools like Hugo for compiling Sass/SCSS files.

## Requirements

- Netlify site with build command
- Team with appropriate permissions for environment variable management
- (Optional) Hugo or another tool that uses Dart Sass

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Netlify CLI (optional, for testing)

### Local Development

To develop the extension locally:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd netlify-extension-dartsass
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   Or to automatically open the UI:
   ```bash
   npm run dev:open
   ```

4. **Configure local development**
   - The dev server runs on `http://localhost:8989`
   - Navigate to `https://app.netlify.com/extension-ui/dev?slug=bv2wdvol-dartsass&url=http://localhost:8989`
   - Your extension must be published first for local dev to work
   - Changes to the code will hot-reload in the browser

5. **Build for production**
   ```bash
   npm run build
   ```

   The built extension will be in the `.ntli` folder.

### Project Structure

```
src/
├── index.ts              # Build event handler (onPreBuild)
├── endpoints/            # tRPC API endpoints
├── server/              # Backend logic and router
├── schema/              # Zod schemas for configuration
├── ui/                  # React frontend
│   ├── App.tsx          # Main app with routing
│   └── surfaces/        # UI surfaces (Team/Site Configuration)
└── types/               # TypeScript type definitions
```

### Available Scripts

- `npm run build` - Build the extension for production
- `npm run dev` - Start development server
- `npm run dev:open` - Start dev server and open UI configuration

## Migration from Build Plugin

If you're migrating from the [netlify-plugin-dartsass][plugin] build plugin:

1. **Install this extension** (see Installation above)
2. **Enable for your sites** (see Enable/Disable above)
3. **Configure version** in Team Configuration (optional)
4. **Remove the plugin** from your `netlify.toml`:
   ```diff
   - [[plugins]]
   -   package = "netlify-plugin-dartsass"
   ```
5. **Remove from package.json**:
   ```bash
   npm uninstall @gethinode/netlify-plugin-dartsass
   ```

The extension provides the same functionality with the added benefit of UI-based configuration.

## Credits

This extension is inspired by:

- [Dart Sass installation instructions for Netlify][hugo_dart_netlify] by Joe Mooring / Hugo team
- [netlify-plugin-dartsass][plugin] - the original build plugin version

Built with the [Netlify SDK](https://sdk.netlify.com/).

## License

See [LICENSE](LICENSE) file for details.

<!-- Links -->
[hugo]: https://gohugo.io
[hugo_dart_netlify]: https://gohugo.io/hugo-pipes/transpile-sass-to-css/#netlify
[plugin_cache]: https://github.com/cdeleeuwe/netlify-plugin-hugo-cache-resources
[plugin]: https://github.com/gethinode/netlify-plugin-dartsass
[dartsass]: https://sass-lang.com/dart-sass/
[netlify]: https://netlify.com
