import { supabase } from '../config/supabase.config';
import NetInfo from '@react-native-community/netinfo';

// Helper function to generate UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const authService = {
  async checkNetwork() {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('No internet connection. Please check your network settings.');
    }
    return true;
  },

  async signIn({ email, password }) {
    try {
      console.log('Attempting to sign in user:', email);
      
      // Check network connection first
      await this.checkNetwork();
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // First check if we have an existing session
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (existingSession) {
        console.log('Found existing session, signing out first...');
        await supabase.auth.signOut();
      }

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password.trim()
      });

      if (error) {
        console.error('Supabase auth error:', {
          message: error.message,
          status: error.status,
          name: error.name,
          details: error.details
        });
        throw error;
      }

      if (!data?.user || !data?.session) {
        throw new Error('No user data received after successful login');
      }

      console.log('Sign in successful for user:', data.user.email);
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', {
        name: error.name,
        message: error.message,
        status: error?.status,
        details: error?.details
      });
      
      // Handle specific error cases
      if (error.message === 'Network request failed') {
        return { 
          data: null, 
          error: new Error('Unable to connect to the server. Please check your internet connection and try again.')
        };
      }
      
      if (error.message === 'Invalid API key') {
        return { 
          data: null, 
          error: new Error('Authentication service is temporarily unavailable. Please try again in a few minutes.')
        };
      }
      
      return { 
        data: null, 
        error: new Error(error.message || 'Unable to sign in. Please try again.')
      };
    }
  },

  async signUp({ email, password }) {
    try {
      console.log('Starting signup process for:', email);

      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Ensure clean state
      await supabase.auth.signOut();
      
      // Simple signup
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password.trim(),
        options: {
          emailRedirectTo: null
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (!data?.user) {
        throw new Error('Signup failed: No user data received');
      }

      // Create user role (default to non-admin)
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          is_admin: false
        })
        .select()
        .single();

      if (roleError) {
        console.error('Role creation error:', roleError);
        throw roleError;
      }

      // Create minimal profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: generateUUID(),
          user_id: data.user.id,
          email: email.toLowerCase().trim()
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      // Sign out after signup to ensure clean state
      await supabase.auth.signOut();

      return { data, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('An unexpected error occurred during signup')
      };
    }
  },

  async signOut() {
    try {
      console.log('Attempting to sign out user');
      
      // Check network connection first
      await this.checkNetwork();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signout error:', error);
        throw error;
      }

      console.log('Sign out successful');
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error.message);
      
      // Handle specific error cases
      if (error.message === 'Network request failed') {
        return { 
          error: new Error('Unable to connect to the server. Please check your internet connection and try again.')
        };
      }
      
      return { error };
    }
  },

  async resetPassword(email) {
    try {
      console.log('Starting password reset for:', email);

      if (!email) {
        throw new Error('Email is required');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Send password reset email through Supabase with Vercel hosted page
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://gceprep-password-reset.vercel.app/reset-password'
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        error: new Error(error.message || 'Failed to send reset instructions')
      };
    }
  },

  async getCurrentSession() {
    try {
      console.log('Attempting to get current session');
      
      // Check network connection first
      await this.checkNetwork();
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      return { session, error: null };
    } catch (error) {
      console.error('Get session error:', error.message);
      
      // Handle specific error cases
      if (error.message === 'Network request failed') {
        return { 
          session: null, 
          error: new Error('Unable to connect to the server. Please check your internet connection and try again.')
        };
      }
      
      return { session: null, error };
    }
  }
};
