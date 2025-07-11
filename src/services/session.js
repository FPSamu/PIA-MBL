"use strict";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../onboarding/services/supabaseClient';

const SESSION_KEY = 'user_session';

export async function saveSession(session) {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  } catch (e) {
    console.error('Failed to save session:', e);
    return false;
  }
}

export async function getSession() {
  try {
    const value = await AsyncStorage.getItem(SESSION_KEY);
    if (!value) return null;
    
    const session = JSON.parse(value);
    
    // Check if session is expired
    if (session.expires_at && Date.now() > session.expires_at * 1000) {
      console.log('Session expired, attempting refresh...');
      return await refreshSession(session);
    }
    
    return session;
  } catch (e) {
    console.error('Failed to get session:', e);
    return null;
  }
}

export async function refreshSession(session) {
  try {
    if (!session.refresh_token) {
      console.log('No refresh token available');
      await removeSession();
      return null;
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: session.refresh_token
    });

    if (error) {
      console.error('Failed to refresh session:', error);
      await removeSession();
      return null;
    }

    if (data.session) {
      await saveSession(data.session);
      console.log('Session refreshed successfully');
      return data.session;
    }

    return null;
  } catch (e) {
    console.error('Error refreshing session:', e);
    await removeSession();
    return null;
  }
}

export async function removeSession() {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
    return true;
  } catch (e) {
    console.error('Failed to remove session:', e);
    return false;
  }
}

// Set up auth state change listener for automatic session management
export function initializeSessionListener() {
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event);
    
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      if (session) {
        await saveSession(session);
        console.log('Session saved after auth state change');
      }
    } else if (event === 'SIGNED_OUT') {
      await removeSession();
      console.log('Session removed after sign out');
    }
  });
}

// Function to check and refresh session if needed
export async function ensureValidSession() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  
  // If session is about to expire (within 5 minutes), refresh it
  const expiresAt = session.expires_at * 1000;
  const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
  
  if (expiresAt < fiveMinutesFromNow) {
    console.log('Session expiring soon, refreshing...');
    return await refreshSession(session);
  }
  
  return session;
}
