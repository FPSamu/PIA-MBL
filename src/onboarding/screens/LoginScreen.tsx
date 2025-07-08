import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import Header from '../sections/Header';
import GoogleButton from '../components/GoogleButton';
import UserAuthFields from '../sections/UserAuthFields';
import ContinueButton from '../components/ContinueButton';

export default function LoginScreen({ onLogin, onSwitchToSignup }: { onLogin?: () => void; onSwitchToSignup?: () => void }) {
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
          title="Log In"
          subtitle="Welcome back! Log in to your account."
        />
        <GoogleButton />
        <UserAuthFields onChange={handleAuthChange} />
        <ContinueButton onPress={onLogin || (() => {})} disabled={!canLogin}>
          Log In
        </ContinueButton>
        <View style={styles.signupTextContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onSwitchToSignup}>
            <Text style={styles.signupButton}>Create Account</Text>
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
