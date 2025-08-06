import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Modal, Animated, Easing, Platform, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { getSession, ensureValidSession, initializeSessionListener } from './src/services/session';
import { checkUserPremiumAccess } from './src/services/userPermissions';
import { initializeRevenueCat, setUserId } from './src/services/revenueCat';
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
import InsightsScreen from './src/insights/Insights'
import SettingsScreen from './src/settings/Settings'

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('getStarted');
  const [checkingSession, setCheckingSession] = useState(true);
  const [checkingUserAccess, setCheckingUserAccess] = useState(false);
  const [revenueCatInitialized, setRevenueCatInitialized] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [customGoal, setCustomGoal] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [aboutAnswers, setAboutAnswers] = useState({ source: null, goal: null });
  const [dashboardRefresh, setDashboardRefresh] = useState(0);

  // Inicializar RevenueCat al cargar la app
  useEffect(() => {
    const setupRevenueCat = async () => {
      try {
        await initializeRevenueCat();
        setRevenueCatInitialized(true);
        console.log('✅ RevenueCat initialized in App.js');
      } catch (error) {
        console.error('❌ Failed to initialize RevenueCat:', error);
        // Continuar sin RevenueCat en caso de error
        setRevenueCatInitialized(false);
      }
    };

    setupRevenueCat();
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const session = await getSession();
      if (session && session.access_token && session.refresh_token) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      }
      initializeSessionListener();
  
      const validSession = await ensureValidSession();
      if (validSession) {
        // Configurar user ID en RevenueCat si está inicializado
        if (revenueCatInitialized && validSession.user?.id) {
          try {
            await setUserId(validSession.user.id);
          } catch (error) {
            console.log('Warning: Could not set RevenueCat user ID:', error);
          }
        }
        
        // Si hay sesión válida, verificar acceso del usuario
        await checkAndNavigateUserAccess();
      }
      setCheckingSession(false);
    };

    // Solo restaurar sesión si RevenueCat ya está inicializado o falló
    if (revenueCatInitialized !== null) {
      restoreSession();
    }
  }, [revenueCatInitialized]);

  // Función principal para verificar acceso del usuario (ahora incluye RevenueCat)
  const checkAndNavigateUserAccess = async () => {
    setCheckingUserAccess(true);
    
    try {
      console.log('🔍 Checking user access...');
      
      // Usar la función actualizada que verifica tanto lifetime premium como RevenueCat
      const accessResult = await checkUserPremiumAccess();
      
      if (accessResult.hasAccess) {
        console.log(`✅ Access granted - Type: ${accessResult.type}, Source: ${accessResult.source}`);
        setCurrentScreen('dashboard');
      } else {
        console.log('❌ No access found - Showing subscription screen');
        setCurrentScreen('subscription');
      }
    } catch (error) {
      console.error('Error checking user access:', error);
      // En caso de error, mostrar subscription screen por seguridad
      setCurrentScreen('subscription');
    }
    
    setCheckingUserAccess(false);
  };

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

  // Función para manejar el éxito de la suscripción
  const handleSubscriptionSuccess = async () => {
    console.log('🎉 Subscription successful!');
    
    // Verificar nuevamente el acceso después de la compra exitosa
    await checkAndNavigateUserAccess();
  };

  let content = null;

  if (checkingSession) {
    // Podrías mostrar un SplashScreen o loading aquí
    content = null;
  } else if (checkingUserAccess) {
    // Podrías mostrar un loading específico para verificación de acceso
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
    content = <LoginScreen onLogin={checkAndNavigateUserAccess} onSwitchToSignup={navigateToFeatures} />;
  } else if (currentScreen === 'signup') {
    content = <SignupScreen onSignup={checkAndNavigateUserAccess} onSwitchToLogin={navigateToLogin} onVerificationRequired={navigateToSplash} onboardingData={{ selectedFeature, selectedGoal, customGoal, customAmount, aboutAnswers }} />;
  } else if (currentScreen === 'splash') {
    content = <SplashScreen onVerified={checkAndNavigateUserAccess} />;
  } else if (currentScreen === 'subscription') {
    content = <SubscriptionScreen onSubscriptionSuccess={handleSubscriptionSuccess} />;
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