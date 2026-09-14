import { Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import { htmlToPlainText } from '@/lib/html';
import { WEBSITE_URL } from '@/config/app';
import HomeTool from './Tool';
import { Message } from '@/services/messages/types';
import { useMemo } from 'react';

export type CTAShareProps = {
  message?: Message | null;
};

export default function CTAShare({ message }: CTAShareProps) {
  const { t } = useTranslation();

  const authorTitle = useMemo(() => {
    if (!message?.author?.title) return '';
    return t(`home.titles.${message.author.title}`);
  }, [message, t]);

  const authorLine = useMemo(() => {
    return t('home.by_author', {
      name: `${message?.author?.firstname} ${
        message?.author?.lastname || ''
      }`.trim(),
      title: authorTitle,
    });
  }, [message, t, authorTitle]);

  const handleShare = async () => {
    if (!message) return;
    const body = [
      message.title,
      ...(message?.verses ?? []),
      htmlToPlainText(message.content),
      authorLine,
      t('home.share_footer', { url: WEBSITE_URL }),
    ]
      .filter(Boolean)
      .join('\n\n');

    Share.share(
      { message: body, title: message.title },
      { dialogTitle: message.title },
    ).catch(() => undefined);
  };

  return (
    <HomeTool
      onPress={handleShare}
      accessibilityLabel={t('home.share')}
      icon="share-social"
    />
  );
}
