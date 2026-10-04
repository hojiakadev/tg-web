/** Number of Telegram avatar palettes — matches the `color*` classes of the Avatar component. */
export const AVATAR_COLORS_COUNT = 7;

const hash = (value: string) => [...value].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);

/** Stable palette index for a chat id / name. */
export const avatarColorIndex = (seed: string) => hash(seed) % AVATAR_COLORS_COUNT;

export const initials = (name = '') => {
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return '?';

  return words
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};
