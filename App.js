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
import SubscriptionScreen from './src/onboarding/screens/SubscriptionScreen';
import Dashboard from './src/Dashboard/Dashboard';
import ProgressBar from './src/onboarding/components/ProgressBar';
import Navbar from './src/navbar/Navbar';
import AddTransactionScreen from './src/Transactions/addTransaction/AddTransactionScreen';
import { supabase } from './src/onboarding/services/supabaseClient';
import TransactionScreen from './src/Transactions/transactionsScreen/TransactionScreen';
import InsightsScreen from './src/insights/Insights';
import SettingsScreen from './src/settings/Settings';
import Purchases from 'react-native-purchases';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('getStarted');
  const [checkingSession, setCheckingSession] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [customGoal, setCustomGoal] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [aboutAnswers, setAboutAnswers] = useState({ source: null, goal: null });
  const [dashboardRefresh, setDashboardRefresh] = useState(0);

  const initializeRevenueCat = async () => {
    try {
      if (Platform.OS === 'ios') {
        // Purchases.configure({apiKey: <revenuecat_project_apple_api_key>});
      } else if (Platform.OS === 'android') {
        Purchases.configure({apiKey: "goog_YMpixEdTzFYhVIkQJonwgKhSIIh"});
      }
      console.log('RevenueCat initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
      return false;
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      console.log('Customer info:', customerInfo);
      
      if (customerInfo.entitlements.active && Object.keys(customerInfo.entitlements.active).length > 0) {
        console.log('✅ Usuario tiene suscripción activa');
        return true;
      } else {
        console.log('❌ Usuario no tiene suscripción activa');
        return false;
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        console.log('🚀 Iniciando proceso de restauración de sesión...');
        
        // Paso 1: Restaurar sesión de Supabase
        const session = await getSession();
        if (session && session.access_token && session.refresh_token) {
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
          console.log('✅ Sesión de Supabase restaurada');
        }
        
        // Inicializar el listener de sesión
        initializeSessionListener();
        
        // Paso 2: Verificar si la sesión es válida
        const validSession = await ensureValidSession();
        console.log('Valid session:', validSession);
        
        if (validSession) {
          // Paso 3: Inicializar RevenueCat
          const revenueCatInitialized = await initializeRevenueCat();
          
          if (revenueCatInitialized) {
            // Paso 4: Verificar estado de suscripción
            const hasActiveSubscription = await checkSubscriptionStatus();
            
            if (hasActiveSubscription) {
              console.log('🎉 Usuario autenticado con suscripción activa -> Dashboard');
              setCurrentScreen('dashboard');
            } else {
              console.log('💳 Usuario autenticado sin suscripción -> Subscription');
              setCurrentScreen('subscription');
            }
          } else {
            console.log('❌ Error inicializando RevenueCat -> Subscription');
            setCurrentScreen('subscription');
          }
        } else {
          console.log('🚪 No hay sesión válida -> GetStarted');
          setCurrentScreen('getStarted');
        }
      } catch (error) {
        console.error('❌ Error durante la restauración de sesión:', error);
        setCurrentScreen('getStarted');
      } finally {
        setCheckingSession(false);
        console.log('✅ Proceso de restauración completado');
      }
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

  const navigateAfterLogin = async () => {
    try {
      console.log('🔍 Verificando suscripción después del login...');
      
      // Inicializar RevenueCat si no está inicializado
      await initializeRevenueCat();
      
      // Verificar estado de suscripción
      const hasActiveSubscription = await checkSubscriptionStatus();
      
      if (hasActiveSubscription) {
        console.log('✅ Login exitoso con suscripción -> Dashboard');
        navigateToDashboard();
      } else {
        console.log('💳 Login exitoso sin suscripción -> Subscription');
        navigateToSubscription();
      }
    } catch (error) {
      console.error('❌ Error verificando suscripción después del login:', error);
      navigateToSubscription();
    }
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
    content = <AboutUserScreen 
  onContinue={navigateToSignup} 
  answers={aboutAnswers} 
  setAnswers={(updater) => {
    if (typeof updater === 'function') {
      setAboutAnswers(prev => updater(prev));
    } else {
      setAboutAnswers(updater);
    }
  }}
/>
  } else if (currentScreen === 'login') {
    content = <LoginScreen onLogin={navigateAfterLogin} onSwitchToSignup={navigateToFeatures} />;
  } else if (currentScreen === 'signup') {
    content = <SignupScreen onSignup={navigateToSubscription} onSwitchToLogin={navigateToLogin} onVerificationRequired={navigateToSplash} onboardingData={{ selectedFeature, selectedGoal, customGoal, customAmount, aboutAnswers }} />;
  } else if (currentScreen === 'splash') {
    content = <SplashScreen onVerified={navigateToSubscription} />;
  } else if (currentScreen === 'subscription') {
    content = <SubscriptionScreen onSubscriptionSuccess={navigateToDashboard} />;
  } else if (currentScreen === 'dashboard') {
    content = <Dashboard onLogout={() => setCurrentScreen('getStarted')} refreshKey={dashboardRefresh} onSeeAll={navigateToTransactions} />;
  } else if (currentScreen === 'transactions') {
    content = <TransactionScreen onBack={navigateToDashboard} />;
  } else if (currentScreen === 'insights') {
    content = <InsightsScreen onBack={navigateToDashboard}/>;
  } else if (currentScreen === 'settings') {
    content = <SettingsScreen onBack={navigateToDashboard} onLogout={() => setCurrentScreen('login')}/>;
  }

  return (
    <View style={styles.container}>
      {content}
      {(currentScreen === 'dashboard' || currentScreen === 'transactions' || currentScreen === 'insights' || currentScreen === 'settings') && (
        <Navbar 
          onAddPress={handleShowAddTransaction}
          selected={currentScreen === 'dashboard' ? 'Home' : currentScreen === 'transactions' ? 'Transactions' : currentScreen === 'insights' ? 'Insights' : currentScreen === 'settings' ? 'Settings' : undefined}
          onNavPress={handleNavPress}
        />
      )}
      <Modal
        visible={showAddTransaction}
        animationType="none"
        transparent
        onRequestClose={handleCloseAddTransaction}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.animatedModal, { transform: [{ translateY: slideAnim }] }]}> 
            <AddTransactionScreen 
              onClose={handleCloseAddTransaction} 
              onTransactionAdded={() => setDashboardRefresh(prev => prev + 1)}
              onNavPress={handleNavPress}
            />
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
  function navigateToSubscription() { setCurrentScreen('subscription'); }
  function navigateToDashboard() {
    setDashboardRefresh(prev => prev + 1);
    setCurrentScreen('dashboard');
  }
  function navigateToSplash() { setCurrentScreen('splash'); }
  function navigateToTransactions() { setCurrentScreen('transactions'); }
  function navigateToInsights() { setCurrentScreen('insights'); }
  function navigateToSettings() { setCurrentScreen('settings'); }

  function handleNavPress(nav) {
    if (nav === 'Home') navigateToDashboard();
    else if (nav === 'Transactions') navigateToTransactions();
    else if (nav === 'Insights') navigateToInsights();
    else if (nav === 'Settings') navigateToSettings();
  }
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