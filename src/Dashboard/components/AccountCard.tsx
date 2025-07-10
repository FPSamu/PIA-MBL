import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts, Inter_600SemiBold, Inter_500Medium } from '@expo-google-fonts/inter';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';

interface AccountCardProps {
  type: 'cash' | 'savings' | 'credit';
  amount: string | number;
}

const BASE_COLORS = {
  cash: '#FFB324',
  savings: '#06BF8B',
  credit: '#FC3838',
};

const CIRCLE_COLORS = {
  cash: '#FFCA6680',
  savings: '#66D9B880',
  credit: '#FF8A8A80',
};

const ICONS = {
  cash: (color: string) => <FontAwesome5 name="money-bill-wave" size={22} color={color} />,
  savings: (color: string) => <MaterialIcons name="savings" size={24} color={color} />,
  credit: (color: string) => <Ionicons name="card" size={22} color={color} />,
};

export default function AccountCard({ type, amount }: AccountCardProps) {
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_500Medium,
  });

  if (!fontsLoaded) return null;

  const isCredit = type === 'credit';
  const amountColor = isCredit ? '#FF5252' : '#1C1C1E';
  const iconColor = BASE_COLORS[type];

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={[styles.iconCircle, { backgroundColor: CIRCLE_COLORS[type] }]}> 
          {ICONS[type](iconColor)}
        </View>
        <Text style={styles.title}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
        <Text style={[styles.amount, { color: amountColor }]}>{amount}</Text>
        <Text style={styles.type}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,
    shadowColor: '#D4D4D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    width: 160,
    height: 160,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    marginBottom: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#1C1C1E',
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  amount: {
    fontFamily: 'Inter_500Medium',
    fontWeight: '500',
    fontSize: 22,
    marginBottom: 2,
  },
  type: {
    color: '#757575',
    fontFamily: 'Inter_500Medium',
    fontWeight: '500',
    fontSize: 14,
  },
});
