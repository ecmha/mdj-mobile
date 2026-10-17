import { IconNameType } from '@/components/Icon';
import { RootStackParamList } from '@/Navigation';
import fr from '@/i18n/locales/fr';

// Routes a menu item can open: only screens that take no params.
type MenuItemRoute = {
  [K in keyof RootStackParamList]: undefined extends RootStackParamList[K]
    ? K
    : never;
}[keyof RootStackParamList];

export type MenuItem = {
  // Also the label's key under `menu.items`.
  id: keyof typeof fr.menu.items;
  icon: IconNameType;
  // The card's own tint, per theme: soft in light, deep in dark, so the
  // foreground icon and label read on both.
  background: Record<'light' | 'dark', string>;
  // An item without a route isn't built yet: tapping it says so.
  route?: MenuItemRoute;
  // Goes through `requireAuth()`, like the screen's other entry points.
  requiresAuth?: boolean;
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'bookmarks',
    icon: 'bookmark-outline',
    background: { light: '#f2c9b8', dark: '#4a2f3a' },
    route: 'Bookmarks',
    requiresAuth: true,
  },
  {
    id: 'topics',
    icon: 'grid-outline',
    background: { light: '#f0dca0', dark: '#4a3f24' },
    route: 'Topics',
  },
  {
    id: 'teachings',
    icon: 'library-outline',
    background: { light: '#e9d8b4', dark: '#3b3355' },
  },
  {
    id: 'talk_to_preacher',
    icon: 'chatbubbles-outline',
    background: { light: '#c9dcc8', dark: '#24423a' },
  },
  {
    id: 'liturgical_guide',
    icon: 'book-outline',
    background: { light: '#cfd6ea', dark: '#2a3556' },
  },
];
