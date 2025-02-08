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
  ScrollView,
  Platform,
} from 'react-native';
import { supabase } from '../config/supabase.config';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Linking } from 'expo-linking';

// Base64 encoded SVG logo
const logoBase64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAyMDAgNTAiPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMjE5NkYzIj5QcmVwRXhhbTwvdGV4dD48L3N2Zz4=';

const googleLogoBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuMjQgMTAuMjg1VjE0LjRoNi44MDZjLS4yNzUgMS43NjUtMS45NjcgNS4xNzQtNi44MDYgNS4xNzQtNC4wOTUgMC03LjQzOS0zLjM4OS03LjQzOS03LjU3NFM4LjE0NSA0LjQyNiAxMi4yNCA0LjQyNmMyLjMzIDAgMy44OS45ODkgNC43ODUgMS44NDlsLjMxLS4zMUwxOS4zMSAzLjYyQzE3LjI0IDEuNjY1IDE0Ljk5NSAwIDEyLjI0IDAgNS40OTQgMCAwIDUuNDk0IDAgMTIuMjRjMCA2Ljc0NSA1LjQ5NCAxMi4yNCAxMi4yNCAxMi4yNGM3LjA3IDAgMTEuNzYtNC45NyAxMS43Ni0xMS45NTUgMC0uODA1LS4wODUtMS40Mi0uMTktMi4wMzVoLTExLjU3eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

      // Fetch user profile to check admin status
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('user_id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData.is_admin) {
        navigation.replace('AccessType');
      } else {
        navigation.replace('MainStack', { screen: 'MainTabs' });
      }
      
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    Alert.alert('Not Available', 'Google Sign-In is not yet functional. Please use email and password.');
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Fetch user profile to check admin status
        supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) throw error;

            if (data.is_admin) {
              navigation.replace('AccessType');
            } else {
              navigation.replace('MainStack', { screen: 'MainTabs' });
            }
          });
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
        <View style={styles.form}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <MaterialIcons 
                name={showPassword ? "visibility" : "visibility-off"} 
                size={24} 
                color="#666666" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, styles.loginButton]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

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
              <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
              <Text style={styles.link}>Create Account</Text>
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
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 12,
    fontSize: 16,
    flex: 1,
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
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
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  link: {
    color: '#34C759',
    fontSize: 16,
  },
});
