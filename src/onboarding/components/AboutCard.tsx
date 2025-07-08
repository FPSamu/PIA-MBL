import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Option {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface AboutCardProps {
  question: string;
  options: Option[];
  selectedOption: string | null;
  onSelect: (id: string) => void;
}

const AboutCard: React.FC<AboutCardProps> = ({ question, options, selectedOption, onSelect }) => {
  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionTitle}>{question}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedOption === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                isSelected && styles.selectedOptionCard,
              ]}
              onPress={() => onSelect(option.id)}
              activeOpacity={0.8}
            >
              <Icon 
                color={isSelected ? '#3b82f6' : '#ffffff'} 
                size={24} 
              />
              <Text style={[
                styles.optionLabel,
                isSelected && styles.selectedOptionLabel,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    marginBottom: 32,
  },
  questionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOptionCard: {
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 8,
  },
  selectedOptionLabel: {
    color: '#3b82f6',
  },
});

export default AboutCard;
