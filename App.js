// Import polyfills first
import 'react-native-get-random-values';
import * as Crypto from 'expo-crypto';
import './src/polyfills';

// Then import React and other dependencies
import { AppRegistry, Platform } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import WelcomeScreen from './src/screens/WelcomeScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MCQQuestionScreen from './src/screens/MCQQuestionScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import ResetPasswordConfirmScreen from './src/screens/ResetPasswordConfirmScreen';
import AccessTypeScreen from './src/screens/AccessTypeScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import SelectLevelScreen from './src/screens/SelectLevelScreen';
import TopicAndQuestionTypeScreen from './src/screens/TopicAndQuestionTypeScreen';
import StructuralQuestionScreen from './src/screens/StructuralQuestionScreen';
import QuestionImageManager from './src/screens/admin/QuestionImageManager';
import MainStack from './src/navigation/MainStack';
import EnglishSubSystem from './src/screens/EnglishSubSystem';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import PasswordVerificationScreen from './src/screens/PasswordVerificationScreen';

// Removed unused SignUpScreen import

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Handle deep linking
const scheme = 'com.nahfrancis.educam';
const prefix = Platform.OS === 'web' ? window.location.origin : `${scheme}://`;

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      Welcome: '*',
      Login: 'login',
      CreateAccount: 'create-account',
      ForgotPassword: 'forgot-password',
      ResetPasswordConfirm: 'reset-password',
      StudentRoot: {
        screens: {
          Home: 'home',
          Notes: 'notes',
          Profile: 'profile',
        }
      }
    }
  }
};

const App = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
            <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="PasswordVerification" component={PasswordVerificationScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="ResetPasswordConfirm" component={ResetPasswordConfirmScreen} />
            <Stack.Screen name="AccessType" component={AccessTypeScreen} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="MainStack" component={MainStack} />
            <Stack.Screen name="SelectLevel" component={SelectLevelScreen} />
            <Stack.Screen name="TopicAndQuestionType" component={TopicAndQuestionTypeScreen} />
            <Stack.Screen name="MCQQuestion" component={MCQQuestionScreen} />
            <Stack.Screen name="StructuralQuestion" component={StructuralQuestionScreen} />
            <Stack.Screen name="QuestionImageManager" component={QuestionImageManager} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

// Register the app
if (Platform.OS === 'web') {
  AppRegistry.registerComponent('educam', () => App);
} else {
  AppRegistry.registerComponent('educam', () => App);
}

export default App;
