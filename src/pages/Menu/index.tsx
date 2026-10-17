import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import DefaultLayout from '@/layouts/DefaultLayout';
import MenuCard from '@/components/MenuCard';
import Toast from '@/components/Toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import { MenuItem, MENU_ITEMS } from './menuItems';

// Menu of the app's sections, reached from Home's app icon.
export default function Menu() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const theme = useTheme() ?? 'light';
  const { requireAuth } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openItem = useCallback(
    ({ route, requiresAuth }: MenuItem) => {
      if (!route) {
        setToastMessage(t('menu.unavailable'));
        return;
      }
      const go = () => navigation.navigate(route);
      if (requiresAuth) requireAuth(go);
      else go();
    },
    [navigation, requireAuth, t],
  );

  const hideToast = useCallback(() => setToastMessage(null), []);

  // Not scrollable through the layout: the toast must sit over the screen,
  // not at the end of the scroll content.
  return (
    <DefaultLayout pageTitle={t('menu.title')} scrollable={false}>
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {MENU_ITEMS.map(item => (
          <MenuCard
            key={item.id}
            label={t(`menu.items.${item.id}`)}
            icon={item.icon}
            backgroundColor={item.background[theme]}
            onPress={() => openItem(item)}
          />
        ))}
      </ScrollView>
      <Toast message={toastMessage} onHide={hideToast} style={styles.toast} />
    </DefaultLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Row gap only: the column gutter is what `space-between` leaves.
    justifyContent: 'space-between',
    rowGap: 12,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  toast: { bottom: 40 },
});
