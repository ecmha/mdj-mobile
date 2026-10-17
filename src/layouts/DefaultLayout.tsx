import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import Header from '@/components/Header';
import { bgDefault, flexContent, px } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import Footer from '@/components/Footer';
import AuthPromptModal from '@/components/AuthPromptModal';

export default function DefaultLayout({
  children,
  pageTitle,
  scrollable = true,
}: {
  children: React.ReactNode;
  pageTitle: string;
  // A page that scrolls itself — a FlatList, say — must opt out: nesting a
  // VirtualizedList in this ScrollView breaks virtualization, so paging and
  // `onEndReached` stop firing. Such a page owns its own bottom spacing, so
  // the Footer is left out with it.
  scrollable?: boolean;
}) {
  const theme = useTheme() ?? 'light';
  return (
    <View style={[styles.container, bgDefault(theme)]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Header title={pageTitle} />
      {scrollable ? (
        <ScrollView
          // `flexGrow` so a page shorter than the screen still fills it, which
          // is what lets a page push something (a logout link) to the bottom.
          // Children stay top-aligned either way.
          contentContainerStyle={[px(10), styles.scrollContent]}
          showsVerticalScrollIndicator={false}
        >
          {children}
          <Footer />
        </ScrollView>
      ) : (
        <View style={[flexContent(1), px(10)]}>{children}</View>
      )}
      <AuthPromptModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
