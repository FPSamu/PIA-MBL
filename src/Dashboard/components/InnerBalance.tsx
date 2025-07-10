import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts, Inter_600SemiBold, Inter_500Medium } from '@expo-google-fonts/inter';

interface InnerBalanceProps {
  title: 'Income' | 'Expenses';
  quantity: string | number;
}

export default function InnerBalance({ title, quantity }: InnerBalanceProps) {
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_500Medium,
  });

  if (!fontsLoaded) return null;

  const isIncome = title === 'Income';
  const quantityColor = isIncome ? '#00B383' : '#FF5252';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.quantity, { color: quantityColor }]}>{quantity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    color: '#757575',
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  quantity: {
    fontFamily: 'Inter_500Medium',
    fontWeight: '500',
    fontSize: 22,
  },
});
