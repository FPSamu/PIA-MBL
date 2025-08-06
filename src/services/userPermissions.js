import { supabase } from '../onboarding/services/supabaseClient';
import { getSession } from './session';
import { getCurrentCustomerInfo, initializeRevenueCat } from './revenueCat';

// Verificar si el usuario tiene acceso lifetime premium
export const checkLifetimePremium = async () => {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      console.log('No valid session found');
      return false;
    }

    const { data, error } = await supabase
      .from('user_permissions')
      .select('is_lifetime_premium')
      .eq('user_id', session.user.id)
      .eq('is_lifetime_premium', true)
      .single();

    if (error) {
      // Si no existe registro, no es premium
      if (error.code === 'PGRST116') {
        console.log('User not found in permissions table');
        return false;
      }
      console.error('Error checking lifetime premium:', error);
      return false;
    }

    return data?.is_lifetime_premium || false;
  } catch (error) {
    console.error('Error in checkLifetimePremium:', error);
    return false;
  }
};

// Verificar suscripción activa con RevenueCat
export const checkRevenueCatSubscription = async () => {
  try {
    console.log('Checking RevenueCat subscription...');
    
    // Asegurarse de que RevenueCat esté inicializado
    await initializeRevenueCat();
    
    // Obtener información del cliente
    const result = await getCurrentCustomerInfo();
    
    if (!result.success) {
      console.log('Failed to get customer info from RevenueCat');
      return false;
    }
    
    console.log(`RevenueCat subscription status: ${result.hasActiveSubscription}`);
    return result.hasActiveSubscription;
  } catch (error) {
    console.error('Error checking RevenueCat subscription:', error);
    return false;
  }
};

// Función principal para verificar todo tipo de acceso premium
export const checkUserPremiumAccess = async () => {
  try {
    console.log('🔍 Checking user premium access...');
    
    // 1. Primero verificar si es lifetime premium (más rápido)
    const isLifetimePremium = await checkLifetimePremium();
    if (isLifetimePremium) {
      console.log('✅ User has lifetime premium access');
      return { 
        hasAccess: true, 
        type: 'lifetime_premium',
        source: 'database'
      };
    }
    
    // 2. Si no es lifetime premium, verificar suscripción con RevenueCat
    const hasActiveSubscription = await checkRevenueCatSubscription();
    if (hasActiveSubscription) {
      console.log('✅ User has active RevenueCat subscription');
      return { 
        hasAccess: true, 
        type: 'subscription',
        source: 'revenuecat'
      };
    }
    
    console.log('❌ User has no premium access');
    return { 
      hasAccess: false, 
      type: 'none',
      source: null
    };
  } catch (error) {
    console.error('Error checking user premium access:', error);
    return { 
      hasAccess: false, 
      type: 'error',
      source: null,
      error: error.message
    };
  }
};

// Obtener información completa de permisos del usuario
export const getUserPermissions = async () => {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) return null;

    const { data, error } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting user permissions:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserPermissions:', error);
    return null;
  }
};

// Función para uso interno/admin (implementar autenticación de admin según tu lógica)
export const grantLifetimePremium = async (userId, grantedBy, notes = '') => {
  try {
    const { data, error } = await supabase
      .from('user_permissions')
      .upsert({
        user_id: userId,
        is_lifetime_premium: true,
        granted_by: grantedBy,
        notes: notes,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error granting lifetime premium:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in grantLifetimePremium:', error);
    return { success: false, error };
  }
};