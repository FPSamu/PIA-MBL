import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

const SubscriptionScreen = ({ onSubscriptionSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  const initializeRevenueCat = async () => {
    try {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

      if (Platform.OS === 'ios') {
        // Purchases.configure({apiKey: <revenuecat_project_apple_api_key>});
      } else if (Platform.OS === 'android') {
        Purchases.configure({apiKey: "goog_YMpixEdTzFYhVIkQJonwgKhSIIh"});
      }

      await getCustomerInfo();  
      await getOfferings();
    } catch (error) {
      console.error('❌ Error inicializando RevenueCat:', error);
      Alert.alert('Error', 'Failed to load subscription data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCustomerInfo = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      setCustomerInfo(customerInfo);
      console.log("📢customer info", JSON.stringify(customerInfo, null, 2));
      
      // Check if user already has active subscription
      if (customerInfo.entitlements.active && Object.keys(customerInfo.entitlements.active).length > 0) {
        console.log("✅ Usuario ya tiene suscripción activa");
        onSubscriptionSuccess?.();
      }
    } catch (error) {
      console.error('❌ Error getting customer info:', error);
    }
  };

  const getOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        setOfferings(offerings);
        console.log("📢offerings", JSON.stringify(offerings, null, 2));
      } else {
        console.log("⚠️ No hay offerings disponibles");
      }
    } catch (error) {
      console.error('❌ Error getting offerings:', error);
    }
  };

  // Convert RevenueCat data to display format
  const getPlansFromOfferings = () => {
    if (!offerings?.current) return [];

    const plans = [];
    
    // Monthly plan
    if (offerings.current.monthly) {
      const monthlyPackage = offerings.current.monthly;
      plans.push({
        id: 'monthly',
        title: 'Monthly',
        price: monthlyPackage.product.priceString,
        period: '/month',
        description: 'Perfect for trying out PIA',
        features: [
          'Full access to all features',
          '7-day free trial',
          'Cancel anytime',
          '24/7 support'
        ],
        savings: null,
        pricePerMonth: monthlyPackage.product.price,
        package: monthlyPackage
      });
    }

    // Annual plan
    if (offerings.current.annual) {
      const yearlyPackage = offerings.current.annual;
      const monthlyPrice = offerings.current.monthly?.product.price || 0;
      const yearlyPrice = yearlyPackage.product.price;
      const savings = monthlyPrice > 0 ? Math.round((monthlyPrice * 12) - yearlyPrice) : 0;
      
      plans.push({
        id: 'annual',
        title: 'Annual',
        price: yearlyPackage.product.priceString,
        period: '/year',
        description: savings > 0 ? `Best value - Save $${savings}` : 'Best value',
        features: [
          'Full access to all features',
          '7-day free trial',
          'Cancel anytime',
          '24/7 priority support',
        ],
        savings: savings > 0 ? `Save $${savings}/year` : null,
        pricePerMonth: yearlyPackage.product.pricePerMonth / 1000000, // Convert from micros
        popular: true,
        package: yearlyPackage
      });
    }

    return plans;
  };

  const plans = getPlansFromOfferings();

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    if (!offerings?.current) {
      Alert.alert('Error', 'No subscription plans available. Please try again later.');
      return;
    }

    const selectedPlanData = plans.find(p => p.id === selectedPlan);
    if (!selectedPlanData?.package) {
      Alert.alert('Error', 'Selected plan not found. Please try again.');
      return;
    }

    Alert.alert(
      'Start Subscription',
      `You selected the ${selectedPlanData.title} plan (${selectedPlanData.price}${selectedPlanData.period}). This will start your subscription.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => processPurchase(selectedPlanData.package)
        }
      ]
    );
  };

  const processPurchase = async (packageToPurchase) => {
    setPurchasing(true);
    
    try {
      console.log('🛒 Iniciando compra del package:', packageToPurchase.identifier);
      
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      console.log('✅ Compra completada:', customerInfo);
      
      // Check if the purchase was successful and user has active entitlements
      if (customerInfo.entitlements.active && Object.keys(customerInfo.entitlements.active).length > 0) {
        console.log('🎉 Suscripción activa confirmada');
        Alert.alert(
          'Success!', 
          'Your subscription is now active. Welcome to PIA Premium!',
          [
            { 
              text: 'Continue', 
              onPress: () => onSubscriptionSuccess?.()
            }
          ]
        );
      } else {
        console.log('⚠️ Compra completada pero sin entitlements activos');
        Alert.alert('Purchase Complete', 'Your purchase was processed. It may take a moment to activate.');
        // Still call success callback as purchase was completed
        onSubscriptionSuccess?.();
      }
      
    } catch (error) {
      console.error('❌ Error durante la compra:', error);
      
      if (error.userCancelled) {
        console.log('🚫 Usuario canceló la compra');
        // Don't show error for user cancellation
        return;
      }
      
      let errorMessage = 'Failed to process subscription. Please try again.';
      
      if (error.code === 'PURCHASE_NOT_ALLOWED_ERROR') {
        errorMessage = 'Purchases are not allowed on this device.';
      } else if (error.code === 'PAYMENT_PENDING_ERROR') {
        errorMessage = 'Payment is pending. Please wait for confirmation.';
      } else if (error.code === 'PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR') {
        errorMessage = 'This subscription is not available for purchase.';
      }
      
      Alert.alert('Purchase Error', errorMessage);
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      console.log('🔄 Restaurando compras...');
      const customerInfo = await Purchases.restorePurchases();
      console.log('📦 Compras restauradas:', customerInfo);
      
      if (customerInfo.entitlements.active && Object.keys(customerInfo.entitlements.active).length > 0) {
        Alert.alert(
          'Purchases Restored!', 
          'Your subscription has been restored successfully.',
          [
            { 
              text: 'Continue', 
              onPress: () => onSubscriptionSuccess?.()
            }
          ]
        );
      } else {
        Alert.alert('No Purchases Found', 'No active subscriptions were found to restore.');
      }
    } catch (error) {
      console.error('❌ Error restaurando compras:', error);
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  };

  const PlanCard = ({ plan }) => {
    const isSelected = selectedPlan === plan.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          isSelected && styles.selectedPlan,
          plan.popular && styles.popularPlan
        ]}
        onPress={() => handlePlanSelect(plan.id)}
        activeOpacity={0.8}
      >
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>{plan.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.period}>{plan.period}</Text>
          </View>
          {plan.savings && (
            <Text style={styles.savings}>{plan.savings}</Text>
          )}
          <Text style={styles.pricePerMonth}>
            ${plan.pricePerMonth.toFixed(2)}/month
          </Text>
        </View>

        <Text style={styles.description}>{plan.description}</Text>

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons 
                name="checkmark-circle" 
                size={20} 
                color={isSelected ? "#007AFF" : "#34C759"} 
              />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.radioContainer}>
          <View style={[
            styles.radio,
            isSelected && styles.radioSelected
          ]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading subscription plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // No plans available
  if (plans.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="warning" size={48} color="#FF9500" />
          <Text style={styles.errorText}>No subscription plans available</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              setLoading(true);
              initializeRevenueCat();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <Text style={styles.headerSubtitle}>
          Start your subscription today
        </Text>
      </LinearGradient>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.trialBanner}>
          <Ionicons name="gift" size={24} color="#FF9500" />
          <Text style={styles.trialText}>
            {plans.find(p => p.id === selectedPlan)?.price}{plans.find(p => p.id === selectedPlan)?.period}
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, purchasing && styles.disabledButton]}
          onPress={handleSubscribe}
          activeOpacity={0.8}
          disabled={purchasing}
        >
          <LinearGradient
            colors={purchasing ? ['#A0A0A0', '#808080'] : ['#007AFF', '#0051D5']}
            style={styles.subscribeGradient}
          >
            {purchasing ? (
              <View style={styles.purchasingContainer}>
                <ActivityIndicator color="#FFFFFF" style={styles.purchasingIndicator} />
                <Text style={styles.subscribeButtonText}>Processing...</Text>
              </View>
            ) : (
              <Text style={styles.subscribeButtonText}>
                Subscribe Now
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          activeOpacity={0.6}
          disabled={purchasing}
        >
          <Text style={[styles.restoreButtonText, purchasing && styles.disabledText]}>
            Restore Purchases
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Cancel anytime. Your subscription will be charged to your Google Play account.
            Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9E6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE066',
  },
  trialText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B8860B',
    marginLeft: 8,
  },
  plansContainer: {
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  selectedPlan: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  popularPlan: {
    borderColor: '#34C759',
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    left: 20,
    right: 20,
    backgroundColor: '#34C759',
    paddingVertical: 6,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    alignItems: 'center',
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  period: {
    fontSize: 18,
    color: '#6B7280',
    marginLeft: 4,
  },
  savings: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
    marginBottom: 4,
  },
  pricePerMonth: {
    fontSize: 14,
    color: '#6B7280',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  radioContainer: {
    alignItems: 'center',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  subscribeButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.7,
  },
  subscribeGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  purchasingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purchasingIndicator: {
    marginRight: 8,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  restoreButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  disabledText: {
    color: '#A0A0A0',
  },
  footer: {
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SubscriptionScreen;