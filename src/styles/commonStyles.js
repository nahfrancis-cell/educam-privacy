import { StyleSheet } from 'react-native';
import { getShadowStyle } from '../utils/shadowStyles';

export const colors = {
  background: '#E8F5E9', // Light green background
  border: '#C8E6C9', // Slightly darker green for borders
  cardBackground: '#FFFFFF',
  infoBackground: '#F1F8E9', // Very light green for info sections
  primary: '#34C759', // Primary green color
  secondary: '#007AFF', // Secondary blue color
  text: {
    primary: '#000000',
    secondary: '#666666',
    white: '#FFFFFF',
  }
};

export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    ...getShadowStyle(4),
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoSection: {
    backgroundColor: colors.infoBackground,
    borderRadius: 12,
    padding: 16,
  }
};
