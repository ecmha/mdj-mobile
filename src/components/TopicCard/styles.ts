import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    // Same grid sizing as MenuCard: a fixed share of the row, so a lone card
    // on the last row keeps its column width instead of stretching.
    width: '48.5%',
    aspectRatio: 2,
    borderRadius: 10,
    // Clips the cover tile where it runs off the card's edges.
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  cover: {
    position: 'absolute',
    top: 10,
    right: -10,
    width: '46%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // A darker square over the card's own color, whatever that color is.
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    transform: [{ rotate: '8deg' }],
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    // The tile's own overflow can't clip: that would drop its shadow.
    borderRadius: 12,
  },
  label: {
    // The card colors are vivid in both themes, so the label is always white.
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingBottom: 10,
    // Over the cover tile when a long label reaches it.
    zIndex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
