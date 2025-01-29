import { Platform } from 'react-native';

export const getShadowStyle = (elevation = 5) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    };
  } else if (Platform.OS === 'web') {
    return {
      boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    };
  } else {
    return {
      elevation,
    };
  }
};
