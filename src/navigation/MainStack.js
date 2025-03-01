import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentTabNavigator from './StudentTabNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
import EnglishSubSystem from '../screens/EnglishSubSystem';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={StudentTabNavigator} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="EnglishSubSystem" component={EnglishSubSystem} />
    </Stack.Navigator>
  );
};

export default MainStack;
