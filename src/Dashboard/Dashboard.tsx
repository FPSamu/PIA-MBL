import React from 'react';
import { View, StyleSheet, Button, ScrollView, Platform } from 'react-native';
import { removeSession } from '../services/session';
import DashboardHeader from './sections/Header';
import { StatusBar } from 'expo-status-bar';
import Balance from './sections/Balance';
import Accounts from './sections/Accounts';

export default function Dashboard({ onLogout }: { onLogout?: () => void }) {
  const handleLogout = async () => {
    await removeSession();
    if (onLogout) onLogout();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#000" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <DashboardHeader />
        <Balance total={"$12,500"} income={"$3,000"} expenses={"-$1,200"} />
        <Accounts />
        <Button title="Log Out (Test)" onPress={handleLogout} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCFB',
    paddingTop: 0,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80, // space for navbar
  },
  navbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
