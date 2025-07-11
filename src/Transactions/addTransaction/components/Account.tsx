import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AccountProps {
  type: string;
  selected?: boolean;
}

export default function Account({ type, selected }: AccountProps) {
  return (
    <View style={[styles.container, selected && styles.selectedContainer]}>
      <Text style={[styles.text, selected && styles.selectedText]}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderColor: '#D4D4D4',
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  selectedContainer: {
    backgroundColor: '#E5E6F3',
    borderColor: '#5C6AC4',
  },
  text: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedText: {
    color: '#5C6AC4',
  },
});
