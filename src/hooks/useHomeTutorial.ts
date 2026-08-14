import { useContext } from 'react';
import { HomeTutorialContext } from '@/contexts/homeTutorialProvider';

export const useHomeTutorial = () => useContext(HomeTutorialContext);
