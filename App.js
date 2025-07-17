import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Modal, Animated, Easing, Platform, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { getSession, ensureValidSession, initializeSessionListener } from './src/services/session';
import GetStarted from './src/onboarding/screens/GetStarted';
import FeaturesScreen from './src/onboarding/screens/FeaturesScreen';
import GoalsScreen from './src/onboarding/screens/GoalsScreen';
import AboutUserScreen from './src/onboarding/screens/AboutUserScreen';
import SignupScreen from './src/onboarding/screens/SignupScreen';
import LoginScreen from './src/onboarding/screens/LoginScreen';
import SplashScreen from './src/onboarding/screens/SplashScreen';
import Dashboard from './src/Dashboard/Dashboard';
import ProgressBar from './src/onboarding/components/ProgressBar';
import Navbar from './src/navbar/Navbar';
import AddTransactionScreen from './src/Transactions/addTransaction/AddTransactionScreen';
import { supabase } from './src/onboarding/services/supabaseClient'; // import supabase

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('getStarted');
  const [checkingSession, setCheckingSession] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Onboarding state
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [customGoal, setCustomGoal] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [aboutAnswers, setAboutAnswers] = useState({ source: null, goal: null });
  const [dashboardRefresh, setDashboardRefresh] = useState(0);

  useEffect(() => {
    const restoreSession = async () => {
      const session = await getSession();
      if (session && session.access_token && session.refresh_token) {
        // Restore session into Supabase's internal state
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      }
      // Now initialize the listener
      initializeSessionListener();
  
      // Now check if session is valid and set screen accordingly
      const validSession = await ensureValidSession();
      if (validSession) {
        setCurrentScreen('dashboard');
      }
      setCheckingSession(false);
    };
    restoreSession();
  }, []);

  useEffect(() => {
    if (showAddTransaction) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [showAddTransaction]);

  const handleShowAddTransaction = () => setShowAddTransaction(true);
  const handleCloseAddTransaction = () => setShowAddTransaction(false);

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
    content = <SignupScreen onSignup={navigateToDashboard} onSwitchToLogin={navigateToLogin} onVerificationRequired={navigateToSplash} onboardingData={{ selectedFeature, selectedGoal, customGoal, customAmount, aboutAnswers }} />;
  } else if (currentScreen === 'splash') {
    content = <SplashScreen onVerified={navigateToDashboard} />;
  } else if (currentScreen === 'dashboard') {
    content = <Dashboard onLogout={() => setCurrentScreen('getStarted')} refreshKey={dashboardRefresh} />;
  }

  return (
    <View style={styles.container}>
      {content}
      {currentScreen === 'dashboard' && (
        <Navbar onAddPress={handleShowAddTransaction} />
      )}
      <Modal
        visible={showAddTransaction}
        animationType="none"
        transparent
        onRequestClose={handleCloseAddTransaction}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.animatedModal, { transform: [{ translateY: slideAnim }] }]}> 
            <AddTransactionScreen onClose={handleCloseAddTransaction} />
          </Animated.View>
        </View>
      </Modal>
      <StatusBar style="light" />
    </View>
  );

  function navigateToFeatures() { setCurrentScreen('features'); }
  function navigateToGoals() { setCurrentScreen('goals'); }
  function navigateToAbout() { setCurrentScreen('about'); }
  function navigateToLogin() { setCurrentScreen('login'); }
  function navigateToSignup() { setCurrentScreen('signup'); }
  function navigateToDashboard() {
    setDashboardRefresh(prev => prev + 1);
    setCurrentScreen('dashboard');
  }
  function navigateToSplash() { setCurrentScreen('splash'); }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },
  animatedModal: {
    backgroundColor: '#F5F6FA',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    minHeight: SCREEN_HEIGHT,
    maxHeight: SCREEN_HEIGHT,
    width: '100%',
    height: SCREEN_HEIGHT,
    overflow: 'hidden',
  },
});
