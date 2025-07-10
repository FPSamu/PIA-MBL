"use strict";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error('Failed to get session:', e);
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
