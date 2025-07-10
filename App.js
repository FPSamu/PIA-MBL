import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { getSession } from './src/services/session';
import GetStarted from './src/onboarding/screens/GetStarted';
import FeaturesScreen from './src/onboarding/screens/FeaturesScreen';
import GoalsScreen from './src/onboarding/screens/GoalsScreen';
import AboutUserScreen from './src/onboarding/screens/AboutUserScreen';
import SignupScreen from './src/onboarding/screens/SignupScreen';
import LoginScreen from './src/onboarding/screens/LoginScreen';
import Dashboard from './src/Dashboard/Dashboard';
import ProgressBar from './src/onboarding/components/ProgressBar';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('getStarted');
  const [checkingSession, setCheckingSession] = useState(true);

  // Onboarding state
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [customGoal, setCustomGoal] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [aboutAnswers, setAboutAnswers] = useState({ source: null, goal: null });

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        setCurrentScreen('dashboard');
      }
      setCheckingSession(false);
    };
    checkSession();
  }, []);

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
    setCurrentScreen('signup');
  };

  const navigateToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  let content = null;

  if (checkingSession) {
    content = null;
  } else if (currentScreen === 'getStarted') {
    content = <GetStarted onGetStarted={navigateToFeatures} onLoginPress={navigateToLogin} />;
  } else if (currentScreen === 'features') {
    content = <FeaturesScreen onContinue={navigateToGoals} selectedFeature={selectedFeature} setSelectedFeature={setSelectedFeature} />;
  } else if (currentScreen === 'goals') {
    content = <GoalsScreen onContinue={navigateToAbout} selectedGoal={selectedGoal} setSelectedGoal={setSelectedGoal} customGoal={customGoal} setCustomGoal={setCustomGoal} customAmount={customAmount} setCustomAmount={setCustomAmount} />;
  } else if (currentScreen === 'about') {
    content = <AboutUserScreen onContinue={navigateToSignup} answers={aboutAnswers} setAnswers={setAboutAnswers} />;
  } else if (currentScreen === 'login') {
    content = <LoginScreen onLogin={navigateToDashboard} onSwitchToSignup={navigateToFeatures} />;
  } else if (currentScreen === 'signup') {
    content = <SignupScreen onSignup={navigateToDashboard} onSwitchToLogin={navigateToLogin} onboardingData={{ selectedFeature, selectedGoal, customGoal, customAmount, aboutAnswers }} />;
  } else if (currentScreen === 'dashboard') {
    content = <Dashboard onLogout={() => setCurrentScreen('getStarted')} />;
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
