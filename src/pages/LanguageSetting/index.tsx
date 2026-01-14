import { flexContent, p } from '@/theme';
import DefaultLayout from '@/layouts/DefaultLayout';
import { View } from 'react-native';
import CheckboxGroup from '@/components/CheckboxGroup';

export default function LanguageSetting() {
  return (
    <DefaultLayout pageTitle="Langue">
      <View style={[flexContent(1), p(10)]}>
        <CheckboxGroup
          header={null}
          items={[
            {
              id: 'fr',
              label: 'Français',
              onPress: () => {},
            },
            {
              id: 'en',
              label: 'English',
              onPress: () => {},
            },
          ]}
        />
      </View>
    </DefaultLayout>
  );
}
