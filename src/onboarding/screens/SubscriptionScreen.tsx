import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getProducts, purchaseSubscription, restorePurchases, PRODUCT_IDS } from '../../services/revenueCat';

const SubscriptionScreen = ({ onSubscriptionSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Cargar productos de RevenueCat al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      console.log('Loading products from RevenueCat...');
      
      const revenueCatProducts = await getProducts();
      
      if (revenueCatProducts && revenueCatProducts.length > 0) {
        console.log('Products loaded:', revenueCatProducts);
        setProducts(revenueCatProducts);
      } else {
        console.log('No products found, using default configuration');
        // Si no hay productos de RevenueCat, mantener configuración por defecto
      }
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Error', 'Could not load subscription plans. Please try again.');
    } finally {
      setLoadingProducts(false);
    }
  };

  // Crear planes basados en productos de RevenueCat o configuración por defecto
  const createPlans = () => {
    const defaultPlans = [
      {
        id: 'monthly',
        productId: PRODUCT_IDS.monthly,
        title: 'Monthly',
        price: '$6',
        period: '/month',
        description: 'Perfect for trying out PIA',
        features: [
          'Full access to all features',
          '7-day free trial',
          'Cancel anytime',
          '24/7 support'
        ],
        savings: null,
        pricePerMonth: 6,
      },
      {
        id: 'annual',
        productId: PRODUCT_IDS.annual,
        title: 'Annual',
        price: '$50',
        period: '/year',
        description: 'Best value - Save 30%',
        features: [
          'Full access to all features',
          '7-day free trial',
          'Cancel anytime',
          '24/7 priority support',
        ],
        savings: 'Save $22/year',
        pricePerMonth: 4.17,
        popular: true,
      }
    ];

    // Si tenemos productos de RevenueCat, actualizar precios
    if (products.length > 0) {
      return defaultPlans.map(plan => {
        const revenueCatProduct = products.find(p => p.identifier === plan.productId);
        if (revenueCatProduct) {
          return {
            ...plan,
            price: revenueCatProduct.priceString,
            priceValue: revenueCatProduct.price,
            currency: revenueCatProduct.currencyCode,
            revenueCatProduct
          };
        }
        return plan;
      });
    }

    return defaultPlans;
  };

  const plans = createPlans();

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    const selectedPlanData = plans.find(p => p.id === selectedPlan);
    
    if (!selectedPlanData) {
      Alert.alert('Error', 'Please select a plan');
      return;
    }

    setLoading(true);

    try {
      console.log(`Starting subscription for: ${selectedPlanData.productId}`);

      // Usar RevenueCat para realizar la compra
      const result = await purchaseSubscription(selectedPlanData.productId);

      if (result.success && result.hasActiveSubscription) {
        Alert.alert(
          'Success! 🎉',
          'Your subscription is now active. Welcome to PIA Premium!',
          [
            {
              text: 'Continue',
              onPress: () => onSubscriptionSuccess?.()
            }
          ]
        );
      } else if (result.error === 'cancelled') {
        // Usuario canceló, no mostrar error
        console.log('Purchase cancelled by user');
      } else {
        Alert.alert(
          'Purchase Failed',
          result.message || 'Could not complete the purchase. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);

    try {
      console.log('Restoring purchases...');
      
      const result = await restorePurchases();

      if (result.success && result.hasActiveSubscription) {
        Alert.alert(
          'Purchases Restored! 🎉',
          'Your subscription has been restored successfully.',
          [
            {
              text: 'Continue',
              onPress: () => onSubscriptionSuccess?.()
            }
          ]
        );
      } else if (result.success) {
        Alert.alert(
          'No Active Subscription',
          'No active subscriptions were found to restore.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Restore Failed',
          result.error || 'Could not restore purchases. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert(
        'Error',
        'Could not restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
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
        disabled={loading}
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

  if (loadingProducts) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Loading Plans...</Text>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading subscription plans...</Text>
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
          Start your 7-day free trial today
        </Text>
      </LinearGradient>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.trialBanner}>
          <Ionicons name="gift" size={24} color="#FF9500" />
          <Text style={styles.trialText}>
            7 days free, then {plans.find(p => p.id === selectedPlan)?.price}{plans.find(p => p.id === selectedPlan)?.period}
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, loading && styles.disabledButton]}
          onPress={handleSubscribe}
          activeOpacity={0.8}
          disabled={loading}
        >
          <LinearGradient
            colors={loading ? ['#A0A0A0', '#808080'] : ['#007AFF', '#0051D5']}
            style={styles.subscribeGradient}
          >
            {loading ? (
              <View style={styles.loadingButtonContent}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.subscribeButtonText}>Processing...</Text>
              </View>
            ) : (
              <Text style={styles.subscribeButtonText}>
                Start Free Trial
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.restoreButton, loading && styles.disabledButton]}
          onPress={handleRestore}
          activeOpacity={0.6}
          disabled={loading}
        >
          <Text style={[styles.restoreButtonText, loading && styles.disabledText]}>
            Restore Purchases
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Cancel anytime. Your subscription will be charged to your iTunes/Google Play account.
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
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
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
    opacity: 0.6,
  },
  subscribeGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    opacity: 0.5,
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