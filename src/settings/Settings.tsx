import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ensureValidSession } from "../services/session";
import { supabase } from "../onboarding/services/supabaseClient";
import SavingsGoal from "./components/SavingsGoal";
import Cash from "./components/Cash";
import Credit from "./components/Credit";
import Privacy from "./components/Privacy";
import Savings from "./components/Savings";

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
              <SavingsGoal />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Accounts</Text>
              <Cash />
              <Savings />
              <Credit />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>App Settings</Text>
              <Privacy />
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
});