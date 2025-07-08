import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

interface EmailFieldProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  label?: string;
}

const EmailField: React.FC<EmailFieldProps> = ({ value, onChange, placeholder = 'Enter your email', label = 'Email' }) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#cbd5e1"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#e2e8f0',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    marginLeft: 12,
  },
  eyeIcon: {
    padding: 4,
  },
});

export default EmailField;
