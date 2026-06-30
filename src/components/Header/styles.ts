import { StyleSheet } from 'react-native';
import { DIMENSIONS, STATUS_BAR_HEIGHT } from '@/theme';

export default StyleSheet.create({
  header: {
    height: DIMENSIONS.SCREEN_HEIGHT / 18,
    width: DIMENSIONS.SCREEN_WIDTH,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: STATUS_BAR_HEIGHT,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    width: 50,
    height: '100%',
    alignItems: 'center',
  },
  pageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToHome: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: { width: 30, height: 30 },
});
