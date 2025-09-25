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

export function getZoomFromAltitude(altitude: number): number {
  let closestZoom = 9;

  for (const [zoom, alt] of Object.entries(zoomToCesiumAltitude)) {
    if (altitude < alt) {
      closestZoom = parseInt(zoom, 10);
    }
  }

  return closestZoom;
}

export function clickLink(href: string, target = '_blank'): void {
  const link = document.createElement('a');
  link.href = href;
  link.target = target;

  link.click();
}

const scales = [
  100, 250, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500,
  6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 15000, 20000, 25000,
  30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000,
  85000, 90000, 95000, 100000, 125000, 200000, 250000, 300000, 400000, 500000,
  600000, 700000, 800000, 900000, 1000000,
];
/**
 * Get scale from resolution
 * @param resolution
 * @returns
 */
export function getScaleFromResolution(resolution: number): number {
  const dpi = 96; // Cesium dpi
  const meterPerPixelAtScale1 = 0.0254 / dpi;
  const scaleRatio = resolution / meterPerPixelAtScale1;

  const closestScale = scales.reduce((prev, curr) => {
    return Math.abs(curr - scaleRatio) < Math.abs(prev - scaleRatio)
      ? curr
      : prev;
  });

  return Math.round(closestScale); // eg. If needed formatting: 1:${Math.round(closestScale)}
}
