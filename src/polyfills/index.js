import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';

// Add any additional polyfills needed for mobile here
if (Platform.OS !== 'web') {
  // Mobile-specific polyfills
  global.Buffer = require('buffer').Buffer;
}
