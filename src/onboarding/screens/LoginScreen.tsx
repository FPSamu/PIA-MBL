import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, ScrollView, Text, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import Header from '../sections/Header';
import GoogleButton from '../components/GoogleButton';
import UserAuthFields from '../sections/UserAuthFields';
import ContinueButton from '../components/ContinueButton';
import { signIn } from '../functions/authentication';
import { saveSession } from '../../services/session';

export default function LoginScreen({ onLogin, onSwitchToSignup }: { onLogin?: () => void; onSwitchToSignup?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthChange = (newEmail: string, newPassword: string) => {
    setEmail(newEmail);
    setPassword(newPassword);
  };

  const canLogin = email.trim().length > 0 && password.length > 0;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error, data } = await signIn(email, password);
      if (error) {
        if (
          error.message?.toLowerCase().includes('invalid login credentials') ||
          error.message?.toLowerCase().includes('user not found') ||
          error.message?.toLowerCase().includes('invalid email or password')
        ) {
          Alert.alert('Login Error', 'Either the email or the password is wrong.');
        } else if (
          error.message?.toLowerCase().includes('email not confirmed') ||
          error.message?.toLowerCase().includes('email not verified')
        ) {
          Alert.alert('Account Not Verified', 'Please verify your email before logging in.');
        } else {
          Alert.alert('Login Error', error.message || 'Unknown error');
        }
      } else {
        if (data && data.session) {
          await saveSession(data.session);
        }
        if (onLogin) onLogin();
      }
    } catch (err: any) {
      Alert.alert('Login Error', err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Header
            title="Log In"
            subtitle="Welcome back! Log in to your account."
          />
          <GoogleButton />
          <UserAuthFields onChange={handleAuthChange} />
          <ContinueButton onPress={handleLogin} disabled={!canLogin || loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </ContinueButton>
          <View style={styles.signupTextContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onSwitchToSignup}>
              <Text style={styles.signupButton}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingBottom: Platform.OS === 'android' ? 25 : 0,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  signupTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  signupText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  signupButton: {
    color: '#3b82f6',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    textDecorationLine: 'underline',
  },
});
