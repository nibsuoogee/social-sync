function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate whether to use a black or white font color based on the
 * color of a given background. Uses the luminance of the color.
 * @param bgColor The hex color of the background.
 */
export function getTextColor(bgColor: string): "black" | "white" {
  const [r, g, b] = hexToRgb(bgColor);
  const luminance = getLuminance(r, g, b);
  return luminance > 0.5 ? "black" : "white"; // tweak threshold if needed
}
