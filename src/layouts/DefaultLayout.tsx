import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import Header from '@/components/Header';
import { bgDefault, px } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import Footer from '@/components/Footer';

export default function DefaultLayout({
  children,
  pageTitle,
}: {
  children: React.ReactNode;
  pageTitle: string;
}) {
  const theme = useTheme() ?? 'light';
  return (
    <View style={[styles.container, bgDefault(theme)]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Header title={pageTitle} />
      <ScrollView contentContainerStyle={[px(10)]} showsVerticalScrollIndicator={false}>
        {children}
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
