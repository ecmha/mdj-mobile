import { flexContent, p } from '@/theme';
import DefaultLayout from '@/layouts/DefaultLayout';
import { View } from 'react-native';
import CheckboxGroup from '@/components/CheckboxGroup';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { SupportedLanguage } from '@/i18n';

export default function LanguageSetting() {
  const { t } = useTranslation();
  const { language, updateLanguage } = useLanguage();

  return (
    <DefaultLayout pageTitle={t('language_setting.title')}>
      <View style={[flexContent(1), p(10)]}>
        <CheckboxGroup<SupportedLanguage>
          header={null}
          defaultValue={language}
          items={[
            {
              id: 'fr',
              label: t('language_setting.french'),
              onPress: id => updateLanguage(id),
            },
            {
              id: 'en',
              label: t('language_setting.english'),
              onPress: id => updateLanguage(id),
            },
          ]}
        />
      </View>
    </DefaultLayout>
  );
}
