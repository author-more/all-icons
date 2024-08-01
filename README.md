![All Icons](logo.svg)

# All Icons

All Icons is a Penpot plugin that allows you to easily access icons from various icon libraries and add them to your project.

## Installation

Penpot plugins are still in development and not yet available in the live Penpot release.

## Development

You need to have an environment with Node.js installed to work on the plugin.

1. Clone the repository.
2. Run `npm ci` to install the dependencies.
3. Run `npm run dev` to start the server.
4. Open Penpot and go to the plugin manager.
5. Add a new plugin with the URL `http://localhost:4173/manifest.json`.
6. Use the plugin manager to open the plugin.

Currently the development setup is using the production build in watch mode. This means hot module replacement is not available and you need to reload the plugin manually after making changes.
