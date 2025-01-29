import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../config/supabase.config';

const EmailVerificationScreen = ({ route, navigation }) => {
  const { email, name, userId } = route.params;
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const createProfile = async (userId) => {
    try {
      // Try creating profile with minimal data first
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          user_id: userId,
          email: email,
          name: name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Try alternative approach with rpc if insert fails
        const { error: rpcError } = await supabase.rpc('create_new_profile', {
          user_id: userId,
          user_email: email,
          user_name: name
        });

        if (rpcError) {
          console.error('RPC profile creation error:', rpcError);
          throw rpcError;
        }
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      throw error;
    }
  };

  const handleVerification = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsLoading(true);
    try {
      // First verify the email
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'signup'
      });

      if (verifyError) throw verifyError;

      // Then try to create the profile
      try {
        await createProfile(userId);
        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login')
          }
        ]);
      } catch (profileError) {
        // Still allow login even if profile creation fails
        console.error('Profile creation failed:', profileError);
        Alert.alert('Warning', 'Account created but profile setup failed. You can complete your profile after logging in.', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login')
          }
        ]);
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', error.message || 'Failed to verify email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isResendDisabled || timeLeft > 0) {
      Alert.alert('Please Wait', `Please wait ${timeLeft} seconds before requesting another code.`);
      return;
    }
    
    setIsLoading(true);
    setIsResendDisabled(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });

      if (error) {
        if (error.message.includes('security purposes')) {
          const waitTime = error.message.match(/\d+/)[0]; 
          setTimeLeft(parseInt(waitTime) || 60);
          Alert.alert('Please Wait', `Please wait ${waitTime} seconds before requesting another code.`);
        } else {
          Alert.alert('Error', 'Failed to resend verification code. Please try again.');
          setIsResendDisabled(false);
        }
      } else {
        setTimeLeft(60);
        Alert.alert('Success', 'A new verification code has been sent to your email.');
      }
    } catch (error) {
      console.error('Resend code error:', error);
      Alert.alert('Error', 'Failed to resend verification code. Please try again.');
      setIsResendDisabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <MaterialIcons name="arrow-back" size={24} color="#34C759" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          Please enter the 6-digit code sent to {email}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.codeInput}
              placeholder=""
              placeholderTextColor="#999"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              maxLength={6}
              editable={!isLoading}
              textAlign="center"
              autoFocus={true}
            />
          </View>

          <TouchableOpacity
            style={[styles.verifyButton, isLoading && styles.buttonDisabled]}
            onPress={handleVerification}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Verify Email</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleResendCode}
            disabled={isResendDisabled || isLoading}
            style={[styles.resendButton, (isResendDisabled || isLoading) && styles.buttonDisabled]}
          >
            {isLoading ? (
              <ActivityIndicator color="#4CAF50" />
            ) : (
              <Text style={[styles.resendText, isResendDisabled && styles.textDisabled]}>
                {timeLeft > 0 ? `Resend Code (${timeLeft}s)` : 'Resend Code'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 60,
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 100 : 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  codeInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 8,
  },
  verifyButton: {
    backgroundColor: '#34C759',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  resendButton: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendText: {
    color: '#34C759',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  textDisabled: {
    color: '#666666',
  },
});

export default EmailVerificationScreen;
