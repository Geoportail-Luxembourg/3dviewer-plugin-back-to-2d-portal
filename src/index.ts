import {
  type VcsPlugin,
  type VcsUiApp,
  type PluginConfigEditor,
  ButtonLocation,
} from '@vcmap/ui';
import { mercatorProjection, Projection, wgs84Projection } from '@vcmap/core';
import { name, version, mapVersion } from '../package.json';
import {
  clickLink,
  getScaleFromResolution,
  getZoomFromAltitude,
} from './utils';

type PluginConfig = {
  pathTo2dGeoportal?: string;
  tabId?: string;
  pathToPrintPortal?: string;
  tabIdPrint?: string;
};
type PluginState = Record<never, never>;

type LuxActionsPlugin = VcsPlugin<PluginConfig, PluginState>;

function initializeBack2DAction(
  config: PluginConfig,
  vcsUiApp: VcsUiApp,
): void {
  if (!config.pathTo2dGeoportal) {
    return;
  }

  const back2DAction = {
    name: '2D',
    title: 'linkTo2d.title',
    icon: '$vcs2d',
    callback: async (): Promise<void> => {
      const state = await vcsUiApp.getState(true);

      const activePosition =
        state.activeViewpoint?.groundPosition ||
        state.activeViewpoint?.cameraPosition;

      // This redirect is only available in 3D mode
      if (!activePosition || !state.activeViewpoint?.cameraPosition) {
        return;
      }

      const [lon, lat] = activePosition as number[];
      const alt = state.activeViewpoint.cameraPosition[2];

      const coordinates = Projection.transform(
        mercatorProjection,
        wgs84Projection,
        [lon, lat],
      );
      const x = Math.round(coordinates[0]);
      const y = Math.round(coordinates[1]);
      const zoom = getZoomFromAltitude(Math.abs(alt));
      const lang = `lang=${vcsUiApp.locale}`;
      const rotation = -((state.activeViewpoint.heading ?? 0) * Math.PI) / 180;

      const layersInState = [...vcsUiApp.layers]
        .filter((l) => l.properties?.luxId && (l.active || l.loading))
        .toReversed();

      const layers = layersInState.filter(
        (l) => !l?.properties.is3DLayer && !l?.properties.luxIsBaselayer,
      );
      const layerIds = `layers=${layers.map((l) => l?.properties.luxId).join('-')}`;
      const layersOpacity = `opacities=${layers.map(() => 1).join('-')}`;

      const bgLayerInState = layersInState.filter(
        (l) => l?.properties.luxIsBaselayer,
      );
      const bgLayer = `bgLayer=${bgLayerInState.map((l) => l?.name).join('') || 'blank'}`;

      const href = `${config.pathTo2dGeoportal}?X=${Math.round(x)}&Y=${Math.round(y)}&zoom=${zoom}&rotation=${rotation}&${lang}&version=3&${layerIds}&${layersOpacity}&${bgLayer}`;
      const target = config.tabId || '_blank';

      clickLink(href, target);
    },
  };

  vcsUiApp.navbarManager.add(
    { id: 'back-2D', action: back2DAction },
    name,
    ButtonLocation.MAP,
    { desktop: true, tablet: true, mobile: true },
  );
}

function initializePrintAction(config: PluginConfig, vcsUiApp: VcsUiApp): void {
  if (!config.pathToPrintPortal) {
    return;
  }

  const luxProj = new Projection({
    epsg: '2169',
    proj4:
      '+proj=tmerc +lat_0=49.83333333333334 +lon_0=6.166666666666667 +k=1 +x_0=80000 +y_0=100000 +ellps=intl +towgs84=-189.681,18.3463,-42.7695,-0.33746,-3.09264,2.53861,0.4598 +units=m +no_defs',
  });

  const action = {
    name: '3DPrint',
    title: 'linkTo3DPrint.title',
    icon: '$vcsUpload',
    callback: async (): Promise<void> => {
      const state = await vcsUiApp.getState(true);

      const activePosition =
        state.activeViewpoint?.groundPosition ||
        state.activeViewpoint?.cameraPosition;

      // This redirect is only available in 3D mode
      if (!activePosition || !state.activeViewpoint?.cameraPosition) {
        return;
      }

      const [lon, lat] = activePosition as number[];
      const coordinates = Projection.transform(luxProj, wgs84Projection, [
        lon,
        lat,
      ]);
      const x = Math.round(coordinates[0]);
      const y = Math.round(coordinates[1]);

      const res = vcsUiApp.maps.activeMap!.getCurrentResolution(
        Projection.transform(mercatorProjection, wgs84Projection, [lon, lat]),
      );
      const scale = getScaleFromResolution(res);

      const href = `${config.pathToPrintPortal}?easting=${x}&northing=${y}&scale=${scale}`;
      const target = config.tabId || '_blank';

      clickLink(href, target);
    },
  };

  vcsUiApp.navbarManager.add(
    { id: 'print-3D', action },
    name,
    ButtonLocation.MAP,
    { desktop: true, tablet: true, mobile: true },
  );
}

export default function plugin(
  config: PluginConfig,
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  baseUrl: string,
): LuxActionsPlugin {
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
      window.name = 'lux3d'; // set window name as tab reference for geoportail
      initializeBack2DAction(config, vcsUiApp);
      initializePrintAction(config, vcsUiApp);

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
        pathToPrintPortal: config.pathToPrintPortal,
        tabIdPrint: config.tabIdPrint,
      };
    },
    /**
     * should return the plugin's serialization excluding all default values
     */
    toJSON(): PluginConfig {
      return {
        pathTo2dGeoportal: config.pathTo2dGeoportal,
        tabId: config.tabId,
        pathToPrintPortal: config.pathToPrintPortal,
        tabIdPrint: config.tabIdPrint,
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
        linkTo2d: {
          title: 'Zurück zum Luxemburger Geoportal',
        },
        linkTo3DPrint: {
          title: '3D-Druck bestellen',
        },
      },
      en: {
        linkTo2d: {
          title: 'Back to the Luxembourg geoportal',
        },
        linkTo3DPrint: {
          title: 'Order a 3D print',
        },
      },
      fr: {
        linkTo2d: {
          title: 'Retour au géoportail du Luxembourg',
        },
        linkTo3DPrint: {
          title: 'Commander une impression 3D',
        },
      },
      lb: {
        linkTo2d: {
          title: 'Zeréck op de Lëtzebuerger Geoportal',
        },
        linkTo3DPrint: {
          title: 'Eng 3D-Dréck bestellen',
        },
      },
    },
  };
}
