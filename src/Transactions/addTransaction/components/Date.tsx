import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface DateProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function Date({ value, onChangeText }: DateProps) {
  const formatDate = (text: string) => {
    // Remove any non-numeric characters
    const numbers = text.replace(/\D/g, '');
    
    // Format as MM/DD/YYYY
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDate(text);
    onChangeText(formatted);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleDateChange}
        placeholder="MM/DD/YYYY"
        placeholderTextColor="#757575"
        keyboardType="numeric"
        maxLength={10}
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
