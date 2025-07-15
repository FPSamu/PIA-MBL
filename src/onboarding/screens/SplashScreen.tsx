import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { getSession, saveSession, getUserInfo, saveUserInfo, getCredentials } from '../../services/session';

export default function SplashScreen({ onVerified }: { onVerified: () => void }) {
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('Please verify your account with the message we just sent to your email');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let countdown: NodeJS.Timeout | null = null;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (countdown) clearInterval(countdown);
    };
  }, [timer]);

  useEffect(() => {
    const checkVerification = async () => {
      console.log('Checking verification status...');
      setChecking(true);
      
      try {
        // First try to get stored user info
        const storedUser = await getUserInfo();
        console.log('Stored user info:', storedUser ? 'found' : 'not found');
        
        // Get stored credentials to sign in and check verification
        const credentials = await getCredentials();
        
        if (credentials) {
          console.log('Attempting to sign in with stored credentials to check verification');
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
          });
          
          if (signInData.session && !signInError) {
            console.log('Successfully signed in - user is verified');
            await saveSession(signInData.session);
            console.log('Session saved, redirecting to dashboard');
            onVerified();
            return;
          } else if (signInError && signInError.message.includes('Email not confirmed')) {
            console.log('User not verified yet');
            setMessage('Please check your email and click the verification link');
          } else {
            console.log('Sign in failed:', signInError);
            setMessage('Error checking verification status. Please try again.');
          }
        } else {
          console.log('No stored credentials available');
          setMessage('No stored credentials. Please sign up again.');
        }
        
      } catch (error) {
        console.error('Error in verification check:', error);
        setMessage('Error checking verification status. Please try again.');
      } finally {
        setChecking(false);
      }
    };

    // Check immediately
    checkVerification();

    // Set up interval to check every 3 seconds
    const interval = setInterval(checkVerification, 3000);

    return () => clearInterval(interval);
  }, [onVerified]);

  const handleResendEmail = async () => {
    setResending(true);
    try {
      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert('Error', 'No stored credentials found. Please sign up again.');
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: credentials.email,
      });

      if (error) {
        console.error('Error resending verification email:', error);
        Alert.alert('Error', 'Failed to resend verification email. Please try again.');
      } else {
        console.log('Verification email resent successfully');
        Alert.alert('Success', 'Verification email has been resent to your email address.');
        setTimer(60); // Restart timer after resending
      }
    } catch (error) {
      console.error('Error in resend function:', error);
      Alert.alert('Error', 'Failed to resend verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.message}>{message}</Text>
        {checking && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5C6AC4" />
            <Text style={styles.loadingText}>Checking verification status...</Text>
          </View>
        )}
        <TouchableOpacity 
          style={[styles.resendButton, (resending || timer > 0) && styles.resendButtonDisabled]} 
          onPress={handleResendEmail}
          disabled={resending || timer > 0}
        >
          <Text style={styles.resendButtonText}>
            {resending
              ? 'Sending...'
              : timer > 0
                ? `Resend Verification Email (${timer}s)`
                : 'Resend Verification Email'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#E2E8F0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#E2E8F0',
    fontSize: 14,
    marginTop: 12,
  },
  resendButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  resendButtonDisabled: {
    backgroundColor: '#6b7280',
  },
  resendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
