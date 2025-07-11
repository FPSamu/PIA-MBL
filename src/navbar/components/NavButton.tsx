import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';

interface NavButtonProps {
  label: 'Home' | 'Transactions' | 'Insights' | 'Settings';
  selected?: boolean;
  onPress?: () => void;
}

const ICONS = {
  Home: (color: string) => <Ionicons name="home" size={24} color={color} />,
  Transactions: (color: string) => <MaterialIcons name="swap-horiz" size={24} color={color} />,
  Insights: (color: string) => <Feather name="bar-chart-2" size={24} color={color} />,
  Settings: (color: string) => <FontAwesome5 name="cog" size={22} color={color} />,
};

export default function NavButton({ label, selected = false, onPress }: NavButtonProps) {
  const color = selected ? '#5C6AC4' : '#1C1C1E';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.icon}>{ICONS[label](color)}</View>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  icon: {
    marginBottom: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
