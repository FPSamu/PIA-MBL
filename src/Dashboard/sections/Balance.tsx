import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts, Inter_600SemiBold, Inter_500Medium } from '@expo-google-fonts/inter';
import InnerBalance from '../components/InnerBalance';

interface BalanceProps {
  total: string | number;
  income: string | number;
  expenses: string | number;
}

export default function Balance({ total, income, expenses }: BalanceProps) {
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total balance</Text>
      <Text style={styles.total}>{total}</Text>
      <View style={styles.row}>
        <InnerBalance title="Income" quantity={income} />
        <View style={styles.separator} />
        <InnerBalance title="Expenses" quantity={expenses} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    marginTop: 16,
    shadowColor: '#D4D4D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    color: '#4A4A4A',
    fontFamily: 'Inter_500Medium',
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 2,
  },
  total: {
    color: '#1C1C1E',
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    fontSize: 28,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  separator: {
    width: 1,
    height: 36,
    backgroundColor: '#D4D4D4',
    marginHorizontal: 18,
    borderRadius: 1,
  },
});
