import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

interface ManualGoalProps {
  onChange?: (goal: string, amount?: string) => void;
  disabled?: boolean;
}

const ManualGoal: React.FC<ManualGoalProps> = ({ onChange, disabled }) => {
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState('');

  const handleGoalChange = (text: string) => {
    setGoal(text);
    if (onChange) onChange(text, amount);
  };

  const handleAmountChange = (text: string) => {
    // Only allow numbers and decimal
    const sanitized = text.replace(/[^0-9.]/g, '');
    setAmount(sanitized);
    if (onChange) onChange(goal, sanitized);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Custom Goal</Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          style={styles.input}
          placeholder="Enter your goal..."
          placeholderTextColor="#cbd5e1"
          value={goal}
          onChangeText={handleGoalChange}
          editable={!disabled}
        />
        {disabled && (
          <View style={styles.disabledOverlay} pointerEvents="none">
            <Text style={styles.disabledText}>Unselect to edit</Text>
          </View>
        )}
      </View>
      <Text style={styles.label}>Target Amount (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter target amount..."
        placeholderTextColor="#cbd5e1"
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType="numeric"
        editable={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
    position: 'relative',
  },
  label: {
    color: '#e2e8f0',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 58, 138, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  disabledText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    padding: 8,
  },
});

export default ManualGoal;
