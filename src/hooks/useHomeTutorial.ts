import { useEffect, useState } from 'react';
import { retrieveItem, saveItem, STORAGE_KEYS } from '@/lib/storage';

export function useHomeTutorial() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    retrieveItem(STORAGE_KEYS.HOME_TUTORIAL).then((value) => {
      if (!value) setVisible(true);
    });
  }, []);

  const dismiss = () => {
    setVisible(false);
    saveItem(STORAGE_KEYS.HOME_TUTORIAL, 'done');
  };

  return { visible, dismiss };
}
