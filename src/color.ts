export function hexToRgba(hex: string, opacity: number = 1) {
  const hexParts = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hexParts) {
    const [r, g, b] = hexParts.slice(1);
    return `rgba(${parseInt(r, 16)} ${parseInt(g, 16)} ${parseInt(b, 16)} / ${opacity})`;
  }
}
