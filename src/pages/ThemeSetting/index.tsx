import { flexContent, p } from '@/theme';
import DefaultLayout from '@/layouts/DefaultLayout';
import { View } from 'react-native';
import CheckboxGroup from '@/components/CheckboxGroup';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/themeProvider';

export default function ThemeSetting() {
  const { updateTheme } = useContext(ThemeContext);
  return (
    <DefaultLayout pageTitle="Thème">
      <View style={[flexContent(1), p(10)]}>
        <CheckboxGroup
          header={null}
          items={[
            {
              id: 'light',
              label: 'Light mode',
              onPress: () => {
                updateTheme('light');
              },
            },
            {
              id: 'dark',
              label: 'Dark mode',
              onPress: () => {
                updateTheme('dark');
              },
            },
          ]}
        />
      </View>
    </DefaultLayout>
  );
}
