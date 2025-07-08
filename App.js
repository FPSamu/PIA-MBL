import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import GetStarted from './src/onboarding/screens/GetStarted';
import FeaturesScreen from './src/onboarding/screens/FeaturesScreen';
import GoalsScreen from './src/onboarding/screens/GoalsScreen';
import AboutUserScreen from './src/onboarding/screens/AboutUserScreen';
import SignupScreen from './src/onboarding/screens/SignupScreen';
import LoginScreen from './src/onboarding/screens/LoginScreen';
import ProgressBar from './src/onboarding/components/ProgressBar';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('getStarted');

  const navigateToFeatures = () => {
    setCurrentScreen('features');
  };

  const navigateToGoals = () => {
    setCurrentScreen('goals');
  };

  const navigateToAbout = () => {
    setCurrentScreen('about');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  const navigateToSignup = () => {
    setCurrentScreen('getStarted');
  };

  let content = null;

  if (currentScreen === 'getStarted') {
    content = <GetStarted onGetStarted={navigateToFeatures} onLoginPress={navigateToLogin} />;
  } else if (currentScreen === 'features') {
    content = <FeaturesScreen onContinue={navigateToGoals} />;
  } else if (currentScreen === 'goals') {
    content = <GoalsScreen onContinue={navigateToAbout} />;
  } else if (currentScreen === 'about') {
    content = <AboutUserScreen onContinue={navigateToLogin} />;
  } else if (currentScreen === 'login') {
    content = <LoginScreen onLogin={() => {}} onSwitchToSignup={navigateToSignup} />;
  } else if (currentScreen === 'signup') {
    content = <SignupScreen onSignup={() => {}} onSwitchToLogin={navigateToLogin} />;
  }

  return (
    <View style={styles.container}>
      {content}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
  },
});
