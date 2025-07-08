import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface GoalCardProps {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  selected: boolean;
  onPress: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ id, icon: Icon, label, color, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.goalCard,
        selected && styles.selectedGoalCard,
      ]}
      onPress={() => onPress(id)}
      activeOpacity={0.8}
    >
      <View style={[styles.goalIcon, { backgroundColor: color }]}> 
        <Icon color="#ffffff" size={24} />
      </View>
      <Text style={styles.goalLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  goalCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedGoalCard: {
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  goalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default GoalCard;
