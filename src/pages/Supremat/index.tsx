import DefaultLayout from '@/layouts/DefaultLayout';
import MText from '@/components/Text';
import { useTranslation } from 'react-i18next';

export default function Supremat() {
  const { t } = useTranslation();
  return (
    <DefaultLayout pageTitle={t('supremat.title')}>
      <MText>{t('supremat.body')}</MText>
    </DefaultLayout>
  );
}
