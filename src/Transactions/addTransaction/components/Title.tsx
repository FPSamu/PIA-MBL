import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface TitleProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function Title({ value, onChangeText }: TitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title (optional)</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="What was this for?"
        placeholderTextColor="#757575"
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
