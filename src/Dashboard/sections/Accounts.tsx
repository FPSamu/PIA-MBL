import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFonts, Inter_600SemiBold } from '@expo-google-fonts/inter';
import AccountCard from '../components/AccountCard';

export default function Accounts() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your accounts</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AccountCard type="cash" amount="$1,200" />
        <AccountCard type="savings" amount="$8,500" />
        <AccountCard type="credit" amount="-$2,000" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    paddingHorizontal: 24,
    fontSize: 26,
    fontWeight: 600,
    fontFamily: 'Inter_600SemiBold'
  }
});
