import { useContext } from 'react';
import MText from '@/components/Text';
import HomeLayout from '@/layouts/HomeLayout';
import { WelcomeContext } from '@/contexts/welcomeProvider';

export default function Home() {
  // const { updateShowWelcome } = useContext(WelcomeContext);
  // updateShowWelcome(false);
  return (
    <HomeLayout>
      <MText></MText>
    </HomeLayout>
  );
}
