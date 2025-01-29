import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, AppState, Linking } from 'react-native';
import 'react-native-url-polyfill/auto';
import { Alert } from 'react-native';

// Get Supabase configuration from environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://iqllfdiqendlyfbnvcdu.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbGxmZGlxZW5kbHlmYm52Y2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5NjY2NDgsImV4cCI6MjA1MzU0MjY0OH0.MVxiUMwQ_fK5h1Pra-Pm2Gtyu1agRch5q2VshlsxEes';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration');
}

// Create custom storage object that works in both web and native
const storage = {
  setItem: async (key, value) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting storage item:', error);
    }
  },
  getItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting storage item:', error);
      return null;
    }
  },
  removeItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing storage item:', error);
    }
  }
};

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    debug: false, // Disable debug logs
    email: {
      verifyOtp: true,
      otpType: 'magiclink',
      shouldCreateUser: true,
      sendMagicLinkInEmail: false
    }
  },
});

// Export a function to get the current session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  return session;
};

// Export a function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error.message);
    return null;
  }
  return user;
};

// Export configuration for debugging
export const SUPABASE_CONFIG = {
  url: supabaseUrl,
  options: {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
      debug: false, // Disable debug logs
      email: {
        verifyOtp: true,
        otpType: 'magiclink',
        shouldCreateUser: true,
        sendMagicLinkInEmail: false
      }
    }
  },
};
