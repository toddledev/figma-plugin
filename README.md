# Toddle Figma Plugin

<!-- <p align="center"> -->
<!-- <a href="https://www.figma.com/community/plugin/842128343887142055"><img src="assets/badge.png" height="60"/></a> -->
<!-- </p> -->

Export your Figma designs as Tailwind-flavoured HTML and paste it into [Toddle](https://toddle.dev) to get your project started.

## How it works

This plugin takes an unconventional approach to improve code quality: it optimizes the layout before the conversion to code even begins. The standard Figma [Nodes](https://www.figma.com/plugin-docs/api/nodes/) (what represents each layer) is a joy to work with, but it can't modify a layer without modifying the user project. For this reason, I decided to virtualize it, remaking the official implementation and naming them `AltNodes`. During the process of converting a `Node` into an `AltNode`, the plugin does the following:

![Conversion Workflow](assets/workflow.png)

That process can also be seen as an [Intermediate Representation](https://en.wikipedia.org/wiki/Intermediate_representation) and might allow this plugin to, one day, live outside Figma.

## Hard cases

When finding the unknown (a `Group` or `Frame` with more than one child and no vertical or horizontal alignment), Tailwind mode uses [insets](https://tailwindcss.com/docs/top-right-bottom-left/#app) for best cases and `left`, `top` from standard CSS for the worst cases. Flutter mode uses `Stack` and `Positioned.fill`. Both are usually not recommended and can easily defeat the responsiveness. In many scenarios, just wrapping some elements in a `Group` or `Frame` can solve:

![Conversion Workflow](assets/examples.png)

**Tip**: Instead of selecting the whole page, you can also select individual items. This can be useful for both debugging and componentization. For example: you can use the plugin to generate the code of a single element and then replicate it using a for-loop.

### Limitations

With the limitless variety and combinations of features in Figma designs, it's currently not possible to replicate every case. Here are some known unsupported features:

- Vector illustrations / paths
- Images
- Line/Star/Polygon shapes

#### Tailwind limitations

- **Width:** Tailwind has a maximum width of 384px. If an item passes this, the width will be set to `w-full` (unless it is already relative like `w-1/2`, `w-1/3`, etc). This is usually a feature, but be careful: if most layers in your project are larger than 384px, the plugin's result might be less than optimal.

## How to build the project

### Package Manager

The project is configured for [pnpm](https://pnpm.io/). To install, see the [installation notes for pnpm](https://pnpm.io/installation).

### Monorepo

The plugin is organized as a monorepo. There are several packages:

- `packages/backend` - Contains the business logic that reads the Figma API and converts nodes
- `packages/plugin-ui` - Contains the common UI for the plugin
- `packages/eslint-config-custom` - Config file for ESLint
- `packages/tsconfig` - Collection of TSConfig files used throughout the project

- `apps/plugin` - This is the actual plugin assembled from the parts in `backend` & `plugin-ui`. Within this folder it's divided between:
  - `plugin-src` - loads from `backend` and compiles to `code.js`
  - `ui-src` - loads the common `plugin-ui` and compiles to `index.html`
- `apps/debug` - This is a debug mode plugin that is a more convenient way to see all the UI elements.

The plugin is built using Turbo which in turn builds the internal packages.

#### Commands

`pnpm run ...`

- `dev` - runs the app in dev mode. This can be run in the Figma editor.
- `build`
- `build:watch`
- `lint`
- `format` - formats with prettier (warning: may edit files!)

#### Debug mode

When running the `dev` task, you can open `http://localhost:3000` to see the debug version of the UI.

<img width="600" alt="Screenshot 2024-12-13 at 16 26 43" src="https://github.com/user-attachments/assets/427fb066-70e1-47bd-8718-51f7f4d83e35" />
