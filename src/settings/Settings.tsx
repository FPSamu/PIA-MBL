import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ensureValidSession } from "../services/session";
import { supabase } from "../onboarding/services/supabaseClient";

export default function Settings({ onBack }: { onBack?: () => void }) {
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" backgroundColor="#000" />
      <View>
        <View style={{ width: 32, height: 40 }} />
      </View>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
            <View style={styles.section}>
              <Text style={styles.label}>Goal</Text>
              <TouchableOpacity 
                style={styles.button}
                // onPress={handleGoalPress}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="flag" size={20} color="#666" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.buttonTitle}>Savings Goal</Text>
                  <Text style={styles.buttonAmount}>$10,000</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Accounts</Text>
              <TouchableOpacity 
                style={styles.button}
                // onPress={() => handleAccountPress('Checking')}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="card" size={20} color="#666" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.buttonTitle}>Checking Account</Text>
                  <Text style={styles.buttonAmount}>$2,450.00</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.buttonSpacing]}
                // onPress={() => handleAccountPress('Savings')}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="wallet" size={20} color="#666" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.buttonTitle}>Savings Account</Text>
                  <Text style={styles.buttonAmount}>$8,750.50</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.buttonSpacing]}
                // onPress={() => handleAccountPress('Credit')}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="card-outline" size={20} color="#666" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.buttonTitle}>Credit Card</Text>
                  <Text style={styles.buttonAmount}>-$1,245.30</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>App Settings</Text>
              <TouchableOpacity 
                style={styles.button}
                // onPress={() => handleSettingPress('Notifications')}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="notifications" size={20} color="#666" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.buttonTitle}>Notifications</Text>
                  <Text style={styles.buttonSubtitle}>Push notifications</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.buttonSpacing]}
                // onPress={() => handleSettingPress('Security')}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="shield-checkmark" size={20} color="#666" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.buttonTitle}>Security</Text>
                  <Text style={styles.buttonSubtitle}>Face ID enabled</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.buttonSpacing]}
                // onPress={() => handleSettingPress('Privacy')}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="lock-closed" size={20} color="#666" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.buttonTitle}>Privacy</Text>
                  <Text style={styles.buttonSubtitle}>Data & permissions</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    paddingVertical: 64,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  label: {
    color: "#1c1c1c",
    fontSize: 26,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 16,
  },
  section: {
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonSpacing: {
    marginTop: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1c',
    marginBottom: 2,
  },
  buttonAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#999',
  },
});