const GRADIENTS = [
  ['#ff885e', '#ff516a'], // red
  ['#ffcd6a', '#ffa85c'], // orange
  ['#82b1ff', '#665fff'], // violet
  ['#a0de7e', '#54cb68'], // green
  ['#53edd6', '#28c9b7'], // cyan
  ['#72d5fd', '#2a9ef1'], // blue
  ['#e0a2f3', '#d669ed'] // pink
];

const hash = (value: string) => [...value].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);

export const avatarGradient = (seed: string) => {
  const [from, to] = GRADIENTS[hash(seed) % GRADIENTS.length];
  return `linear-gradient(${from}, ${to})`;
};

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
