import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, ScrollView, Text, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import Header from '../sections/Header';
import GoogleButton from '../components/GoogleButton';
import UserAuthFields from '../sections/UserAuthFields';
import ContinueButton from '../components/ContinueButton';
import { signUp } from '../functions/authentication';
import { saveSession } from '../../services/session';
import { supabase } from '../services/supabaseClient';

export default function SignupScreen({ onSignup, onSwitchToLogin, onboardingData }: { onSignup?: () => void; onSwitchToLogin?: () => void; onboardingData: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthChange = (newEmail: string, newPassword: string) => {
    setEmail(newEmail);
    setPassword(newPassword);
  };

  const canSignup = email.trim().length > 0 && password.length > 0;

  const handleSignup = async () => {
    setLoading(true);
    try {
      const { error, data } = await signUp(email, password);
      if (error) {
        Alert.alert('Sign Up Error', error.message);
      } else {
        let userId = null;
        if (data && data.session) {
          await saveSession(data.session);
          userId = data.session.user.id;
        } else if (data && data.user) {
          userId = data.user.id;
        }
        if (userId) {
          console.log('Signup userId:', userId);
          console.log('Onboarding data:', onboardingData);
          // Demographics
          const { error: demoError } = await supabase.from('demographics').upsert({
            uid: userId,
            where_from: onboardingData?.aboutAnswers?.source || null,
            financial_goal: onboardingData?.aboutAnswers?.goal || null,
          });
          if (demoError) {
            console.error('DEMOGRAPHICS error:', demoError);
            Alert.alert('DB Error', 'DEMOGRAPHICS: ' + demoError.message);
          }
          // Savings Info
          const { error: savingsError } = await supabase.from('savings_info').upsert({
            uid: userId,
            goal_title: onboardingData?.selectedGoal || onboardingData?.customGoal || null,
            goal_amount: onboardingData?.customAmount ? parseFloat(onboardingData.customAmount) : null,
          });
          if (savingsError) {
            console.error('SAVINGS_INFO error:', savingsError);
            Alert.alert('DB Error', 'SAVINGS_INFO: ' + savingsError.message);
          }
          // Accounts
          const { error: accountsError } = await supabase.from('accounts').upsert({
            uid: userId,
            account_name: 'cash',
            title: 'Cash',
            balance: null,
          });
          console.log('Cash account creation result:', { error: accountsError });
          if (accountsError) {
            console.error('ACCOUNTS error:', accountsError);
            Alert.alert('DB Error', 'ACCOUNTS: ' + accountsError.message);
          }
          // Add credit_card and savings accounts
          const { error: creditCardError } = await supabase.from('accounts').upsert({
            uid: userId,
            account_name: 'credit_card',
            title: 'Credit card',
            balance: null,
          });
          console.log('Credit card account creation result:', { error: creditCardError });
          if (creditCardError) {
            console.error('CREDIT_CARD error:', creditCardError);
            Alert.alert('DB Error', 'CREDIT_CARD: ' + creditCardError.message);
          }
          const { error: savingsAccountError } = await supabase.from('accounts').upsert({
            uid: userId,
            account_name: 'savings',
            title: 'Savings',
            balance: null,
          });
          console.log('Savings account creation result:', { error: savingsAccountError });
          if (savingsAccountError) {
            console.error('SAVINGS_ACCOUNT error:', savingsAccountError);
            Alert.alert('DB Error', 'SAVINGS_ACCOUNT: ' + savingsAccountError.message);
          }
          // User Balance
          const { error: balanceError } = await supabase.from('user_balance').upsert({
            uid: userId,
            total_balance: null,
          });
          if (balanceError) {
            console.error('USER_BALANCE error:', balanceError);
            Alert.alert('DB Error', 'USER_BALANCE: ' + balanceError.message);
          }
          // Categories
          const categories = [
            { name: 'Groceries', color: '#388E3C' },
            { name: 'Restaurant', color: '#FF9800' },
            { name: 'Transport', color: '#1976D2' },
            { name: 'House', color: '#7C4DFF' },
            { name: 'Shopping', color: '#FF5722' },
            { name: 'Gas', color: '#FBC02D' },
            { name: 'Income', color: '#00B383' },
          ];
          
          for (const category of categories) {
            const { error: categoryError } = await supabase.from('categories').upsert({
              uid: userId,
              name: category.name,
              color: category.color,
            });
            if (categoryError) {
              console.error(`CATEGORY ${category.name} error:`, categoryError);
              Alert.alert('DB Error', `CATEGORY ${category.name}: ` + categoryError.message);
            }
          }
        }
        Alert.alert('Success', 'Account created! Please check your email to confirm.');
        if (onSignup) onSignup();
      }
    } catch (err: any) {
      Alert.alert('Sign Up Error', err.message || 'Unknown error');
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
          title="Create Account"
          subtitle="Join thousands of users taking control of ther finances"
        />
        <GoogleButton />
        <UserAuthFields onChange={handleAuthChange} />
        <ContinueButton onPress={handleSignup} disabled={!canSignup || loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </ContinueButton>
        <View style={styles.loginTextContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text style={styles.loginButton}>Login</Text>
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
