import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { authService } from '../services/authService';

const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await authService.signOut();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      } catch (error) {
        console.error('Logout error:', error);
        // Even if there's an error, navigate to Welcome screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      }
    };

    handleLogout();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#34C759" />
    </View>
  );
};

export default LogoutScreen;
