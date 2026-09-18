import { StyleSheet } from 'react-native';
import { DIMENSIONS } from '@/theme';

export const SHEET_HEIGHT = DIMENSIONS.WINDOW_HEIGHT * 0.45;
export const SHEET_BOTTOM_OFFSET = 20;

export default StyleSheet.create({
  // Above the Home toolbar (10) and Toast (20).
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
    elevation: 30,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    position: 'absolute',
    alignSelf: 'center',
    width: '98%',
    height: SHEET_HEIGHT,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 130,
    height: 60,
    resizeMode: 'contain',
  },
  separator: {
    alignSelf: 'center',
    width: 40,
    height: 2,
    borderRadius: 1,
    marginVertical: 12,
  },
});
