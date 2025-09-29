# 3dviewer-back2D

> Part of the [VC Map Project](https://github.com/virtualcitySYSTEMS/map-ui)

This plugin adds a button to the top toolbar, enabling users to open the 2D Geoportal in a new browser tab. If the 2D Geoportal is already open, the plugin will refresh the existing tab instead of creating a duplicate.

Additionally, the plugin automatically synchronizes the current map coordinates (X, Y) and zoom level, ensuring the 2D Geoportal centers on the same location as the 3D viewer.

## Development

To further develop the plugin run: `npm start`

## Optional parameters

- `pathTo2dGeoportal` - The 2D Geoportal url, default to `"http://localhost:5173/theme/main"` to point the local instance, but could be `"https://map.geoportail.lu/theme/main"` for prod.
- `tabId` - The tab id where to open the 2D Geoportal, default to `"lux2d"`.

## Deploy plugin within map-ui

- Add plugin dependency in desired version to `plugins/package.json`:

```
"dependencies": {
  ...
  "@geoportallux/lux-3dviewer-plugin-back-to-2d-portal": "...",
  ...
```

- Add plugin with desired values to map-ui module configuration:

```js
    {
      "name": "@geoportallux/lux-3dviewer-plugin-back-to-2d-portal",
      "entry": "plugins/@geoportallux/lux-3dviewer-plugin-back-to-2d-portal/index.js",
      "pathTo2dGeoportal": "...",
      "tabId": "lux2d",
      "pathToPrintPortal": "...", // If empty, won't display the button to 3D print portal
      "tabIdPrint": "luxprint"
    },
```

⚠️ WARNING: `LUREF EPSG 2169` must be defined in global viewer config (`lux.config.json`).

## Build the npm package

Use the following commands to increase the version and push a new tag, which builds a new version as npm package:

```shell
npm version 1.0.0 --no-git-tag-version
git add .
git commit -m "1.0.0"
git tag v1.0.0
git push origin main v1.0.0 # replace "origin" with your remote repo name

```
