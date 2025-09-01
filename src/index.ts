import {
  type VcsPlugin,
  type VcsUiApp,
  type PluginConfigEditor,
  ButtonLocation,
} from '@vcmap/ui';
import { fromLonLat } from 'ol/proj';
import { name, version, mapVersion } from '../package.json';

type PluginConfig = {
  pathTo2dGeoportal: string;
  tabId: string;
};
type PluginState = Record<never, never>;

type MyPlugin = VcsPlugin<PluginConfig, PluginState>;

/* eslint-disable @typescript-eslint/naming-convention */
const zoomToCesiumAltitude = {
  9: 190000,
  10: 100000,
  11: 70000,
  12: 40000,
  13: 25000,
  14: 10000,
  15: 6000,
  16: 3500,
  17: 1900,
  18: 900,
  19: 600,
};
/* eslint-enable @typescript-eslint/naming-convention */

function getZoomFromAltitude(altitude: number): number {
  let closestZoom = 9;

  for (const [zoom, alt] of Object.entries(zoomToCesiumAltitude)) {
    if (altitude < alt) {
      closestZoom = parseInt(zoom, 10);
    }
  }

  return closestZoom;
}

export default function plugin(
  config: PluginConfig,
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  baseUrl: string,
): MyPlugin {
  return {
    get name(): string {
      return name;
    },
    get version(): string {
      return version;
    },
    get mapVersion(): string {
      return mapVersion;
    },
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    initialize(vcsUiApp: VcsUiApp, pluginState?: PluginState): Promise<void> {
      const action = {
        name: '2D',
        title: 'back2d.title',
        icon: '$vcs2d',
        callback: async (): Promise<void> => {
          const state = await vcsUiApp.getState(true);

          // This redirect is only available in 3D mode
          if (!state.activeViewpoint?.cameraPosition) {
            return;
          }

          const [lon, lat, alt] = state.activeViewpoint
            .cameraPosition as number[];

          const coordinates = fromLonLat([lon, lat]);
          const x = Math.round(coordinates[0]);
          const y = Math.round(coordinates[1]);
          const zoom = getZoomFromAltitude(Math.abs(alt));

          // If we later need to add layers: in the VCS state, we only have the layer name but not the layer ID.
          // The layer ID is required to construct the Luxembourg Geoportal url.
          // Uncomment the following code if you need to implement this evolution.

          // const layers = `layers=${state.layers.map(l => l.name).join(',')}`;
          // const layersOpacity = `opacities=${state.layers.map(() => 1).join('-')}`;
          // const layersTime = `time=${state.layers.map(() => '').join('-')}`;

          const link = document.createElement('a');
          link.href = `${config.pathTo2dGeoportal}?X=${Math.round(x)}&Y=${Math.round(y)}&zoom=${zoom}&version=3`; // &${layers}&${layersOpacity}&${layersTime}
          link.target = config.tabId;

          link.click();
        },
      };

      vcsUiApp.navbarManager.add(
        { id: 'back-2D', action },
        name,
        ButtonLocation.MAP,
        { desktop: true, tablet: true, mobile: true },
      );

      return Promise.resolve();
    },
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    onVcsAppMounted(vcsUiApp: VcsUiApp): void {},
    /**
     * should return all default values of the configuration
     */
    getDefaultOptions(): PluginConfig {
      return {
        pathTo2dGeoportal: config.pathTo2dGeoportal,
        tabId: config.tabId,
      };
    },
    /**
     * should return the plugin's serialization excluding all default values
     */
    toJSON(): PluginConfig {
      return {
        pathTo2dGeoportal: config.pathTo2dGeoportal,
        tabId: config.tabId,
      };
    },
    /**
     * should return the plugins state
     * @returns {PluginState}
     */
    getState(): PluginState {
      return {
        prop: '*',
      };
    },
    /**
     * components for configuring the plugin and/ or custom items defined by the plugin
     */
    getConfigEditors(): PluginConfigEditor<object>[] {
      return [];
    },
    destroy(): void {},
    i18n: {
      de: {
        back2d: {
          title: 'Zurück zum Luxemburger Geoportal',
        },
      },
      en: {
        back2d: {
          title: 'Back to the Luxembourg geoportal',
        },
      },
      fr: {
        back2d: {
          title: 'Retour au géoportail du Luxembourg',
        },
      },
      lb: {
        back2d: {
          title: 'Zeréck op de Lëtzebuerger Geoportal',
        },
      },
    },
  };
}
