# 3dviewer-back2D

> Part of the [VC Map Project](https://github.com/virtualcitySYSTEMS/map-ui)

This plugin adds a button to the top toolbar, enabling users to open the legacy 2D Geoportal in a new browser tab. If the 2D Geoportal is already open, the plugin will refresh the existing tab instead of creating a duplicate.

Additionally, the plugin automatically synchronizes the current map coordinates (X, Y) and zoom level, ensuring the 2D Geoportal centers on the same location as the 3D viewer.

## Optional parameters

- `pathTo2dGeoportal` - The 2D Geoportal url, default to `"http://localhost:5173/theme/main"` to point the local instance, but could be `"https://map.geoportail.lu/theme/main"` for prod.
- `tabId` - The tab id where to open the 2D Geoportal, default to `"lux2d"`.