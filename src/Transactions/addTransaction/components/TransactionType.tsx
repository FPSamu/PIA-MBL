import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface TransactionTypeProps {
  label: 'Expenses' | 'Income';
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function TransactionType({ label, selected = false, onPress, style }: TransactionTypeProps) {
  const isIncome = label === 'Income';
  const selectedColor = isIncome ? '#00B383' : '#FF5252';
  const backgroundColor = selected ? `${selectedColor}1A` : '#fff'; // 1A = 10% opacity
  const borderColor = selected ? selectedColor : '#E0E0E0';
  const textColor = selected ? selectedColor : '#757575';

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor, borderColor }, style]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    // paddingHorizontal: 32,
    width: 145,
    borderRadius: 10,
    borderWidth: 2,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
