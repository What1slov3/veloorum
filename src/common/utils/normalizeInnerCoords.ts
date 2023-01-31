export type Coords = {
  x: number;
  y: number;
};

/**
 * @returns Normalized coords inside the browser window
 */
export const normalizeInnerCoords = (
  coords: Coords,
  elemRect: DOMRect,
  hNormalization: boolean = true,
  vNormalization: boolean = true,
): Coords => {
  const x = hNormalization
    ? coords.x < 0
      ? 10
      : coords.x > window.innerWidth
      ? window.innerWidth - elemRect.width - 10
      : coords.x
    : coords.x;
  const y = vNormalization
    ? coords.y < 0
      ? 10
      : coords.y > window.innerHeight
      ? window.innerHeight - elemRect.height - 10
      : coords.y
    : coords.y;

  return { x, y };
};
