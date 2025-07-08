import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, Platform } from 'react-native';
// Make sure to adjust the import path for ArrowRight as needed
import { ArrowRight } from 'lucide-react-native';


interface ContinueButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  children: string;
  style?: ViewStyle;
}

function ContinueButton({ onPress, disabled = false, children, style }: ContinueButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.continueButton,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.continueText}>{children}</Text>
      <ArrowRight color="#ffffff" size={20} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: 20,
    marginBottom: Platform.OS === 'android' ? 15 : 0,
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginRight: 8,
  },
});

export default ContinueButton;
