// The server gives a topic no color, so each card takes one from this
// palette. Same in both themes: the cards are meant to be vivid, with white
// labels.
const TOPIC_COLORS = [
  '#1e8aa8',
  '#d81b78',
  '#857340',
  '#8a7462',
  '#7a7638',
  '#0b9549',
  '#c9a400',
  '#8e6a49',
  '#a5606e',
  '#16862b',
  '#a0613c',
  '#2e7385',
  '#a95c3d',
  '#e8590c',
  '#5b4b9a',
  '#3d6fb0',
];

// Picked from the id rather than the list position, so a topic keeps its
// color when another one is added before it.
export const topicColor = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % TOPIC_COLORS.length;
  }
  return TOPIC_COLORS[hash];
};
