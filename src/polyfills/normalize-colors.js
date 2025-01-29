const NAMED_COLORS = {
  transparent: 0x00000000,
  white: 0xffffffff,
  black: 0xff000000,
  red: 0xffff0000,
  green: 0xff00ff00,
  blue: 0xff0000ff,
  gray: 0xff808080,
  // Add more named colors as needed
};

const RGBA_PATTERN = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)$/;
const HEX_PATTERN = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function normalizeColor(color) {
  if (typeof color === 'number') {
    if (color >>> 0 === color && color >= 0 && color <= 0xffffffff) {
      return color;
    }
    return null;
  }

  if (typeof color !== 'string') {
    return null;
  }

  // Named colors
  const namedColor = NAMED_COLORS[color.toLowerCase()];
  if (namedColor !== undefined) {
    return namedColor;
  }

  // rgba/rgb
  let match = color.match(RGBA_PATTERN);
  if (match) {
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const a = match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255) : 255;

    return (
      ((a & 0xff) << 24) |
      ((r & 0xff) << 16) |
      ((g & 0xff) << 8) |
      (b & 0xff)
    );
  }

  // hex
  match = color.match(HEX_PATTERN);
  if (match) {
    const hex = match[1];
    if (hex.length === 3) {
      return (
        0xff000000 |
        parseInt(
          hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2],
          16
        )
      );
    } else if (hex.length === 4) {
      return parseInt(
        hex[3] + hex[3] + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2],
        16
      );
    } else if (hex.length === 6) {
      return 0xff000000 | parseInt(hex, 16);
    } else if (hex.length === 8) {
      return parseInt(hex, 16);
    }
  }

  return null;
}

export default normalizeColor;
