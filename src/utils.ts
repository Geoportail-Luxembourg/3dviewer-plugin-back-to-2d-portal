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
  100, 250, 500, 1000, 1500, 2500, 5000, 10000, 15000, 20000, 25000, 50000,
  80000, 100000, 125000, 200000, 250000, 400000, 500000, 1000000, 2500000,
  5000000, 10000000, 25000000, 50000000,
];

/**
 * Get scale from resolution
 * @param resolution
 * @param latitude eg. 49.75
 * @returns
 */
export function getScaleFromResolution(
  resolution: number,
  latitude: number,
): number {
  const mercatorFactor = 1 / Math.cos((latitude * Math.PI) / 180);
  const realResolution = resolution * mercatorFactor;

  const scaleRatio = realResolution / 0.00026458;
  const closestScale = scales.reduce((prev, curr) => {
    return Math.abs(curr - scaleRatio) < Math.abs(prev - scaleRatio)
      ? curr
      : prev;
  });

  return Math.round(closestScale); // eg. If needed formatting: 1:${Math.round(closestScale)}
}
