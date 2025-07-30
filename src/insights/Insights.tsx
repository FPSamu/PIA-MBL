import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Spending from './sections/Spending';
import Savings from './sections/Savings';

export default function Insights({ onBack }: { onBack?: () => void }) {
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#1e3a8a" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Insights</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Spending />
        <Savings />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    paddingVertical: 64
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  backButton: {
    padding: 4,
    width: 32,
    alignItems: 'flex-start',
  },
  scrollContent: {
    paddingBottom: 40,
  },
});