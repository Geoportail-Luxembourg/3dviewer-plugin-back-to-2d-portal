import {
  type VcsPlugin,
  type VcsUiApp,
  type PluginConfigEditor,
  ButtonLocation,
} from '@vcmap/ui';
import { fromLonLat } from 'ol/proj';
import { name, version, mapVersion } from '../package.json';

type PluginConfig = {
  pathTo2dGeoportal: string,
  tabId: string
}
type PluginState = Record<never, never>;

type MyPlugin = VcsPlugin<PluginConfig, PluginState>;

const zoomToCesiumAltitude = {
  9: 350000,
  10: 180000,
  11: 100000,
  12: 40000,
  13: 18000,
  14: 9000,
  15: 6000,
  16: 3500,
  17: 1900,
  18: 900,
  19: 600,
}

function getZoomFromAltitude(altitude: number) {
  let closestZoom = 9;
  let smallestDiff = Infinity;

  for (const [zoom, alt] of Object.entries(zoomToCesiumAltitude)) {
    const diff = Math.abs(altitude - alt);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestZoom = parseInt(zoom);
    }
  }

  return closestZoom;
}

export default function plugin(
  config: PluginConfig,
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
    initialize(vcsUiApp: VcsUiApp, state?: PluginState): Promise<void> {
      const action = {
        name: '2D',
        title: 'back2d.title',
        icon: '$vcs2d',
        callback: async () => {
           const state = await vcsUiApp.getState(true);

          const [lon, lat, alt] = <number[]>state.activeViewpoint?.cameraPosition;

          const coordinates = fromLonLat([lon, lat]);
          const x = Math.round(coordinates[0]);
          const y = Math.round(coordinates[1]);
          const zoom = getZoomFromAltitude(alt);
     
          const link = document.createElement('a');
          link.href = `${config.pathTo2dGeoportal}?X=${Math.round(x)}&Y=${Math.round(y)}&zoom=${zoom}&version=3`;
          link.target = config.tabId;
          link.click();
          
          console.log(link.href)
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
    onVcsAppMounted(vcsUiApp: VcsUiApp): void {
    },
    /**
     * should return all default values of the configuration
     */
    getDefaultOptions(): PluginConfig {
      return {};
    },
    /**
     * should return the plugin's serialization excluding all default values
     */
    toJSON(): PluginConfig {
      // eslint-disable-next-line no-console
      console.log('Called when serializing this plugin instance');
      return {};
    },
    /**
     * should return the plugins state
     * @param {boolean} forUrl
     * @returns {PluginState}
     */
    getState(forUrl?: boolean): PluginState {
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
