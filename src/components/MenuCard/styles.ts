import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    // Same grid sizing as BookmarkCard: a fixed share of the row, so a lone
    // card on the last row keeps its column width instead of stretching.
    width: '48.5%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // A lighter disc over the card's own tint, whatever that tint is.
  iconWrapperLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  iconWrapperDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
