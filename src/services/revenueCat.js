import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

// Tu API Key de RevenueCat (reemplaza con tu key real)
const REVENUECAT_API_KEY = 'appl_bLLgvLvwaikAalePBwLoOigiHNW';

// Product IDs que coinciden con App Store Connect
const PRODUCT_IDS = {
  monthly: 'PIAMonthly',
  annual: 'PIAYearly'
};

let isInitialized = false;

// Inicializar RevenueCat
export const initializeRevenueCat = async () => {
  if (isInitialized) return;
  
  try {
    console.log('Initializing RevenueCat...');
    
    // Configurar RevenueCat
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG); // Solo para desarrollo
    
    if (Platform.OS === 'ios') {
      await Purchases.configure({
        apiKey: REVENUECAT_API_KEY,
      });
    } else if (Platform.OS === 'android') {
      await Purchases.configure({
        apiKey: REVENUECAT_API_KEY, // Mismo key para ambos o diferente si tienes keys separadas
      });
    }
    
    isInitialized = true;
    console.log('✅ RevenueCat initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing RevenueCat:', error);
    throw error;
  }
};

// Obtener productos disponibles
export const getProducts = async () => {
  try {
    console.log('Fetching products...');
    const products = await Purchases.getProducts([
      PRODUCT_IDS.monthly,
      PRODUCT_IDS.annual
    ]);
    
    console.log('Products fetched:', products);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Comprar suscripción
export const purchaseSubscription = async (productId) => {
  try {
    console.log(`Purchasing subscription: ${productId}`);
    
    const { customerInfo } = await Purchases.purchaseProduct(productId);
    
    console.log('Purchase successful:', customerInfo);
    
    // Verificar si la compra fue exitosa
    const hasActiveSubscription = checkActiveSubscription(customerInfo);
    
    return {
      success: true,
      customerInfo,
      hasActiveSubscription
    };
  } catch (error) {
    console.error('Purchase error:', error);
    
    // Manejar diferentes tipos de errores
    if (error.userCancelled) {
      return {
        success: false,
        error: 'cancelled',
        message: 'Purchase was cancelled by user'
      };
    }
    
    return {
      success: false,
      error: 'failed',
      message: error.message || 'Purchase failed'
    };
  }
};

// Restaurar compras
export const restorePurchases = async () => {
  try {
    console.log('Restoring purchases...');
    
    const { customerInfo } = await Purchases.restorePurchases();
    
    console.log('Purchases restored:', customerInfo);
    
    const hasActiveSubscription = checkActiveSubscription(customerInfo);
    
    return {
      success: true,
      customerInfo,
      hasActiveSubscription
    };
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return {
      success: false,
      error: error.message || 'Failed to restore purchases'
    };
  }
};

// Verificar si hay suscripción activa
export const checkActiveSubscription = (customerInfo = null) => {
  try {
    if (!customerInfo) {
      console.log('No customerInfo provided');
      return false;
    }
    
    // Verificar si hay entitlements activos
    const activeEntitlements = customerInfo.entitlements.active;
    
    console.log('Active entitlements:', Object.keys(activeEntitlements));
    
    // Si hay cualquier entitlement activo, el usuario tiene acceso premium
    return Object.keys(activeEntitlements).length > 0;
  } catch (error) {
    console.error('Error checking active subscription:', error);
    return false;
  }
};

// Obtener información del cliente actual
export const getCurrentCustomerInfo = async () => {
  try {
    console.log('Getting current customer info...');
    
    const customerInfo = await Purchases.getCustomerInfo();
    
    console.log('Current customer info:', customerInfo);
    
    const hasActiveSubscription = checkActiveSubscription(customerInfo);
    
    return {
      success: true,
      customerInfo,
      hasActiveSubscription
    };
  } catch (error) {
    console.error('Error getting customer info:', error);
    return {
      success: false,
      error: error.message || 'Failed to get customer info',
      hasActiveSubscription: false
    };
  }
};

// Configurar user ID (opcional, útil para analytics)
export const setUserId = async (userId) => {
  try {
    await Purchases.logIn(userId);
    console.log(`✅ User ID set to: ${userId}`);
  } catch (error) {
    console.error('Error setting user ID:', error);
  }
};

// Logout (limpiar datos de RevenueCat)
export const logoutRevenueCat = async () => {
  try {
    await Purchases.logOut();
    console.log('✅ RevenueCat logout successful');
  } catch (error) {
    console.error('Error logging out from RevenueCat:', error);
  }
};

export { PRODUCT_IDS };