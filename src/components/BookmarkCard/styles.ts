import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listCover: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
  listText: {
    justifyContent: 'center',
  },
  gridCard: {
    // A fixed share of the row rather than `flex: 1`: a flexed card alone on
    // the last row (an odd number of bookmarks) would stretch to the full
    // width and stop looking like a grid. Two of these plus the gutter left
    // by `justifyContent: 'space-between'` fill the row.
    width: '48.5%',
  },
  gridCover: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  gridText: {
    marginTop: 8,
  },
});
