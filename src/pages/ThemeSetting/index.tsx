import { flexContent, p } from '@/theme';
import DefaultLayout from '@/layouts/DefaultLayout';
import { View } from 'react-native';
import CheckboxGroup from '@/components/CheckboxGroup';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/themeProvider';
import { useTranslation } from 'react-i18next';

export default function ThemeSetting() {
  const { updateTheme } = useContext(ThemeContext);
  const { t } = useTranslation();
  return (
    <DefaultLayout pageTitle={t('theme_setting.title')}>
      <View style={[flexContent(1), p(10)]}>
        <CheckboxGroup
          header={null}
          items={[
            {
              id: 'light',
              label: t('theme_setting.light'),
              onPress: () => updateTheme('light'),
            },
            {
              id: 'dark',
              label: t('theme_setting.dark'),
              onPress: () => updateTheme('dark'),
            },
          ]}
        />
      </View>
    </DefaultLayout>
  );
}
