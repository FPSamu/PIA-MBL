import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface AmountProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function Amount({ value, onChangeText }: AmountProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="0.00"
        placeholderTextColor="#757575"
        keyboardType="numeric"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    color: '#c1c1c1',
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
});
