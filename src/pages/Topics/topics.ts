import { IconNameType } from '@/components/Icon';
import fr from '@/i18n/locales/fr';

export type Topic = {
  // Also the label's key under `topics.items`.
  id: keyof typeof fr.topics.items;
  icon: IconNameType;
  // Same in both themes: the cards are meant to be vivid, with white labels.
  color: string;
};

export const TOPICS: Topic[] = [
  { id: 'love', icon: 'heart', color: '#1e8aa8' },
  { id: 'anxiety', icon: 'pulse', color: '#d81b78' },
  { id: 'anger', icon: 'flame', color: '#857340' },
  { id: 'hope', icon: 'sunny', color: '#8a7462' },
  { id: 'depression', icon: 'rainy', color: '#7a7638' },
  { id: 'peace', icon: 'leaf', color: '#0b9549' },
  { id: 'fear', icon: 'thunderstorm', color: '#c9a400' },
  { id: 'stress', icon: 'hourglass', color: '#8e6a49' },
  { id: 'patience', icon: 'time', color: '#a5606e' },
  { id: 'temptation', icon: 'nutrition', color: '#16862b' },
  { id: 'pride', icon: 'trophy', color: '#a0613c' },
  { id: 'doubt', icon: 'help-circle', color: '#2e7385' },
  { id: 'joy', icon: 'happy', color: '#a95c3d' },
  { id: 'jealousy', icon: 'eye', color: '#e8590c' },
  { id: 'faith', icon: 'star', color: '#5b4b9a' },
  { id: 'forgiveness', icon: 'hand-left', color: '#3d6fb0' },
];
