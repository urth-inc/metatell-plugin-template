# metatell plugin template

This repository is to showcase examples of how to create plugins for metatell.

All examples are written in TypeScript and React.

## How to use the plugin template

1. Clone this repository

You can clone this repository by running the command below.

```bash
git clone git@github.com:urth-inc/metatell-plugin-template.git
```

2. Copy the selected plugin template to your desired location

If you select the `AdditionalToolbarButton` plugin template, you can copy it to your desired location by running the command below.

```bash
cp -r metatell-plugin-template/AdditionalToolbarButton /path/to/your/desired/location
```

3. Initialize the git repository

You can initialize the git repository by running the command below.

```bash
cd /path/to/your/desired/location
git init
git add .
git commit -m "Initial commit"
```

Each plugin template has its own README file that explains how to develop the plugin.

## How to load local plugin from local metatell

We assume that local plugin is running on `http://localhost:3004`.

1. update `src/hub.js` in `metatell_client`. VersionId is written in `.uuid.env` in `metatell-plugin-template`.

If you run `npm run dev` or `npm run build`, `versionId` will be changed every time.

```js
  if (plugins) {
    // const remotes = plugins.map(plugin => {
    //   return {
    //     name: plugin.versionId,
    //     alias: plugin.id,
    //     entry: `${process.env.REACT_APP_PUBLIC_R2_BUCKET_URL}/plugins/${plugin.id}/${plugin.versionId}/remoteEntry.js`
    //   }
    // })
    init({
      remotes: [
        {
          name: "app_{versionId (uuid)}",
          alias: "plugin",
          entry: "http://localhost:3004/remoteEntry.js"
        }
      ]
    })
  }
```

2. Overwrite `mfSrc` props like bellow.

```js
  mfSrc = "plugin/{pluginType}",
```

The same type of plugin may not work properly if applied multiple times to the same room.
In that case, you can un-applied the plugin from `metatell-admin`.

## List of plugin templates

- [AdditionalToolbarButton](./AdditionalToolbarButton): This plugin template shows how to create an additional toolbar button.
- [CustomOverlay](./CustomOverlay): This plugin template shows how to create a custom overlay.
- [CustomEntryPanel](./CustomEntryPanel): This plugin template shows how to create a custom entry panel.
- [CustomProfileModal](./CustomProfileModal): This plugin template shows how to create a custom profile modal.
- [CustomLeaveButton](./CustomLeaveButton): This plugin template shows how to create a custom leave button.
- [CustomChatButton](./CustomChatButton): This plugin template shows how to create a custom chat button and modal.
- [CustomMegaphoneButton](./CustomMegaphoneButton): This plugin template shows how to create a custom megaphone button.
- [CustomNearestUserProfile](./CustomNearestUserProfile): This plugin template shows how to create a custom NearestUserProfile.
- [CustomTutorial](./CustomTutorial): This plugin template shows how to create a custom tutorial.

