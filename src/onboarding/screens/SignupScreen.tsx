import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import Header from '../sections/Header';
import GoogleButton from '../components/GoogleButton';
import UserAuthFields from '../sections/UserAuthFields';
import ContinueButton from '../components/ContinueButton';

export default function SignupScreen({ onSignup, onSwitchToLogin }: { onSignup?: () => void; onSwitchToLogin?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthChange = (newEmail: string, newPassword: string) => {
    setEmail(newEmail);
    setPassword(newPassword);
  };

  const canLogin = email.trim().length > 0 && password.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Header
          title="Create Account"
          subtitle="Join thousands of users taking control of ther finances"
        />
        <GoogleButton />
        <UserAuthFields onChange={handleAuthChange} />
        <ContinueButton onPress={onSignup || (() => {})} disabled={!canLogin}>
          Create Account
        </ContinueButton>
        <View style={styles.loginTextContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text style={styles.loginButton}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  loginTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  loginText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  loginButton: {
    color: '#3b82f6',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    textDecorationLine: 'underline',
  },
});
