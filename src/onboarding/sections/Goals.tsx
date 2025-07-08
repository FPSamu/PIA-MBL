import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import GoalCard from '../components/GoalCard';
import { PiggyBank, Home, Car, Plane, BookOpen, TrendingUp } from 'lucide-react-native';

const predefinedGoals = [
  {
    id: 'emergency',
    icon: PiggyBank,
    label: 'Emergency Fund',
    color: '#3b82f6',
  },
  {
    id: 'house',
    icon: Home,
    label: 'Buy a House',
    color: '#22c55e',
  },
  {
    id: 'car',
    icon: Car,
    label: 'Buy a Car',
    color: '#f59e0b',
  },
  {
    id: 'vacation',
    icon: Plane,
    label: 'Vacation',
    color: '#6366f1',
  },
  {
    id: 'education',
    icon: BookOpen,
    label: 'Education',
    color: '#ef4444',
  },
  {
    id: 'invest',
    icon: TrendingUp,
    label: 'Invest',
    color: '#a855f7',
  },
];

interface GoalsSectionProps {
  onSelectGoal?: (goalId: string) => void;
  selectedGoal?: string | null;
}

const Goals: React.FC<GoalsSectionProps> = ({ onSelectGoal, selectedGoal }) => {
  return (
    <View style={styles.goalsContainer}>
      {predefinedGoals.map((goal) => (
        <GoalCard
          key={goal.id}
          id={goal.id}
          icon={goal.icon}
          label={goal.label}
          color={goal.color}
          selected={selectedGoal === goal.id}
          onPress={onSelectGoal!}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default Goals;
