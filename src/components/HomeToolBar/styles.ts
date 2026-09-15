import { StyleSheet } from 'react-native';
import { DIMENSIONS } from '@/theme';

export const HOME_TOOLBAR_HEIGHT = DIMENSIONS.WINDOW_HEIGHT * 0.08;

export default StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: HOME_TOOLBAR_HEIGHT,
  },
  side: {
    width: DIMENSIONS.WINDOW_WIDTH * 0.2,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: DIMENSIONS.WINDOW_WIDTH * 0.2,
  },
  center: {
    flex: 1,
    flexDirection: 'row',
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#000',
  },
  stateIconContainer: {
    position: 'absolute',
    top: -2,
    right: 20,
  },
  bookmarkUnavailable: {
    opacity: 0.5,
  },
});
