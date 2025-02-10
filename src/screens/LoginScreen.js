import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
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
      <View style={styles.headerContainer}>
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
              placeholder=""
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { flex: 1, borderWidth: 0 }]}
              placeholder=""
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <Pressable 
              onPress={() => setShowPassword(!showPassword)}
              style={({ pressed }) => [
                styles.eyeIcon,
                pressed && styles.eyeIconPressed
              ]}
            >
              <MaterialIcons 
                name={showPassword ? "visibility" : "visibility-off"} 
                size={24} 
                color="#666666" 
              />
            </Pressable>
          </View>

          <Pressable 
            style={({ pressed }) => [
              styles.button,
              styles.loginButton,
              pressed && styles.buttonPressed
            ]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.linksContainer}>
            <Pressable 
              onPress={() => navigation.navigate('ForgotPassword')}
              style={({ pressed }) => [
                styles.linkButton,
                pressed && styles.linkButtonPressed
              ]}
            >
              <Text style={styles.link}>Forgot Password?</Text>
            </Pressable>
            <Pressable 
              onPress={() => navigation.navigate('CreateAccount')}
              style={({ pressed }) => [
                styles.linkButton,
                pressed && styles.linkButtonPressed
              ]}
            >
              <Text style={styles.link}>Create Account</Text>
            </Pressable>
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
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: Platform.OS === 'android' ? 20 : 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  form: {
    width: '100%',
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
  },
  eyeIcon: {
    padding: 10,
    marginRight: 5,
    borderRadius: 20,
  },
  eyeIconPressed: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#34C759',
    borderWidth: 0,
  },
  buttonPressed: {
    backgroundColor: '#2BA149',  // Darker green for press effect
  },
  loginButton: {
  },
  buttonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: 10,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#BDBDBD',
  },
  dividerText: {
    marginHorizontal: 20,
    color: '#000000',
    fontSize: 18,
    fontWeight: '500',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  linkButton: {
    padding: 12,
    borderWidth: 0,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
    backgroundColor: '#34C759',
  },
  linkButtonPressed: {
    backgroundColor: '#2BA149',  // Darker green for press effect
  },
  link: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '500',
  },
});
