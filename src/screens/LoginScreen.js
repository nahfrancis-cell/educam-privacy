import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { supabase } from '../config/supabase.config';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';

// Base64 encoded SVG logo
const logoBase64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAyMDAgNTAiPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMjE5NkYzIj5QcmVwRXhhbTwvdGV4dD48L3N2Zz4=';

const googleLogoBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuMjQgMTAuMjg1VjE0LjRoNi44MDZjLS4yNzUgMS43NjUtMS45NjcgNS4xNzQtNi44MDYgNS4xNzQtNC4wOTUgMC03LjQzOS0zLjM4OS03LjQzOS03LjU3NFM4LjE0NSA0LjQyNiAxMi4yNCA0LjQyNmMyLjMzIDAgMy44OS45ODkgNC43ODUgMS44NDlsLjMxLS4zMUwxOS4zMSAzLjYyQzE3LjI0IDEuNjY1IDE0Ljk5NSAwIDEyLjI0IDAgNS40OTQgMCAwIDUuNDk0IDAgMTIuMjRjMCA2Ljc0NSA1LjQ5NCAxMi4yNCAxMi4yNCAxMi4yNGM3LjA3IDAgMTEuNzYtNC45NyAxMS43Ni0xMS45NTUgMC0uODA1LS4wODUtMS40Mi0uMTktMi4wMzVoLTExLjU3eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is admin (email is admin@educam.com)
      if (data?.user?.email === 'admin@educam.com') {
        navigation.replace('AccessType');
      } else {
        // For regular users, navigate to MainStack with MainTabs screen
        navigation.replace('MainStack', { screen: 'MainTabs' });
      }
      
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'educam://auth/callback',
          scopes: 'email profile',
          skipBrowserRedirect: true
        }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // For mobile, we need to open the URL in a browser
        Linking.openURL(data.url);
      }
      
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert(
        'Google Sign-In Error',
        'Unable to sign in with Google. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Check if user is admin
        if (session.user?.email === 'admin@educam.com') {
          navigation.replace('AccessType');
        } else {
          // For regular users, navigate to MainStack with MainTabs screen
          navigation.replace('MainStack', { screen: 'MainTabs' });
        }
      }
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enter Details</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#4CAF50' }]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>

          <Text style={styles.googleButtonLabel}>Continue with Google</Text>
          <TouchableOpacity 
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Image 
                  source={{ uri: googleLogoBase64 }}
                  style={styles.googleLogo}
                />
                <View style={styles.googleTextContainer}>
                  <Text style={[styles.googleButtonText, { color: '#4285F4' }]}>G</Text>
                  <Text style={[styles.googleButtonText, { color: '#EA4335' }]}>o</Text>
                  <Text style={[styles.googleButtonText, { color: '#FBBC05' }]}>o</Text>
                  <Text style={[styles.googleButtonText, { color: '#4285F4' }]}>g</Text>
                  <Text style={[styles.googleButtonText, { color: '#34A853' }]}>l</Text>
                  <Text style={[styles.googleButtonText, { color: '#EA4335' }]}>e</Text>
                </View>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 55,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#fff',
    zIndex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
    padding: 5,
  },
  input: {
    padding: 12,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#757575',
    fontSize: 16,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  googleButtonLabel: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  googleLogo: {
    width: 28,
    height: 28,
  },
  googleTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 28, 
  },
  googleButtonText: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
