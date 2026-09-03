# metatell plugins

This repository contains templates and runnable examples for developing plugins
for metatell. The plugin frontends are written in TypeScript and React.

## Repository layout

- [`templates`](./templates) contains copyable starter projects for each
  supported plugin type.
- [`examples`](./examples) contains runnable reference implementations for
  specific use cases.

Each project is self-contained and has its own package manager configuration and
README. This repository intentionally does not define a root package-manager
workspace.

## Plugin templates

- [AdditionalToolbarButton](./templates/AdditionalToolbarButton): Add a toolbar
  button.
- [CustomChatButton](./templates/CustomChatButton): Replace the chat button and
  modal.
- [CustomEntryPanel](./templates/CustomEntryPanel): Replace the room entry
  panel.
- [CustomExitScreen](./templates/CustomExitScreen): Replace the room exit
  screen.
- [CustomLeaveButton](./templates/CustomLeaveButton): Replace the leave button
  and modal.
- [CustomMegaphoneButton](./templates/CustomMegaphoneButton): Replace the
  megaphone button.
- [CustomNearestUserProfile](./templates/CustomNearestUserProfile): Replace the
  nearest-user profile UI.
- [CustomOverlay](./templates/CustomOverlay): Add a custom overlay.
- [CustomProfileModal](./templates/CustomProfileModal): Replace the profile
  modal.
- [CustomTutorial](./templates/CustomTutorial): Add a custom tutorial.
- [CustomWebCameraButton](./templates/CustomWebCameraButton): Replace the web
  camera button and popup.

## Plugin examples

- [password-collection-modal](./examples/password-collection-modal): A
  `CustomOverlay` example for a password collection flow.
- [external-api-auth](./examples/external-api-auth): An end-to-end example that
  calls an external API with a plugin API token and verifies it in a sample
  backend.

## Start from a template

Clone this repository and copy the template that matches the plugin type you
want to implement. For example:

```bash
git clone git@github.com:urth-inc/metatell-plugins.git
cp -R metatell-plugins/templates/AdditionalToolbarButton /path/to/your/plugin
cd /path/to/your/plugin
git init
git add .
git commit -m "Initial commit"
```

Each template README describes its interface and development workflow.

## Develop a template locally

Run commands from the selected template directory:

```bash
cd templates/AdditionalToolbarButton
npm install
npm run dev
```

Template development servers use `http://localhost:3004` by default. Running
`npm run dev` or `npm run build` generates a new plugin version ID in
`.uuid.env`.

Use the template's build command to create the upload artifact:

```bash
npm run build
```

The generated plugin archive is written to `dist/plugin.zip`.
