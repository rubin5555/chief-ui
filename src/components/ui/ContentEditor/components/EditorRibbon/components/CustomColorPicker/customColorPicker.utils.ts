export type Rgb = [number, number, number];
export type Hsv = [number, number, number];

// main keeps these four conversions as loose module functions above the picker
// (Edit.tsx:560-603). They are pure maths with no React in them, which is exactly
// what a `.utils.ts` is for.
export const rgbToHsv = (r: number, g: number, b: number): Hsv => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === rn) hue = ((gn - bn) / delta) % 6;
    else if (max === gn) hue = (bn - rn) / delta + 2;
    else hue = (rn - gn) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return [hue, max === 0 ? 0 : (delta / max) * 100, max * 100];
};

export const hsvToRgb = (h: number, s: number, v: number): Rgb => {
  const sn = s / 100;
  const vn = v / 100;
  const c = vn * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vn - c;
  const sextant = Math.floor(h / 60) % 6;
  const table: Rgb[] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ];
  const [r, g, b] = table[sextant] ?? table[0];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
};

export const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;

export const hexToRgb = (hex: string): Rgb | null => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? [Number.parseInt(match[1], 16), Number.parseInt(match[2], 16), Number.parseInt(match[3], 16)]
    : null;
};

// Where a pointer landed inside an element, as a 0..1 fraction of each axis.
// Both draggable surfaces need it, and neither should be re-deriving clamps.
export const fractionWithin = (element: Element, clientX: number, clientY: number) => {
  const rect = element.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
    y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
  };
};
