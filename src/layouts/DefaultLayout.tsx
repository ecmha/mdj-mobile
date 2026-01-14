import { View, StyleSheet, StatusBar } from 'react-native';
import Header from '@/components/Header';
import { bgDefault } from '@/theme';
import { useTheme } from '@/hooks/useTheme';

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
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
