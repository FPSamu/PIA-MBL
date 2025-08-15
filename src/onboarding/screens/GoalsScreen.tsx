import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import Header from '../sections/Header';
import Goals from '../sections/Goals';
import ManualGoal from '../sections/ManualGoal';
import ContinueButton from '../components/ContinueButton';
import ProgressBar from '../components/ProgressBar';

export default function GoalsScreen({ onContinue, selectedGoal, setSelectedGoal, customGoal, setCustomGoal, customAmount, setCustomAmount }: {
  onContinue: () => void;
  selectedGoal: string | null;
  setSelectedGoal: (goal: string | null) => void;
  customGoal: string;
  setCustomGoal: (goal: string) => void;
  customAmount: string;
  setCustomAmount: (amount: string) => void;
}) {
  const handleSelectGoal = (goalId: string) => {
    if (selectedGoal === goalId) {
      setSelectedGoal(null); // Unselect if already selected
    } else {
      setSelectedGoal(goalId);
      setCustomGoal(''); // Clear custom goal if a predefined goal is selected
    }
  };

  const handleCustomGoalChange = (goal: string, amount?: string) => {
    setCustomGoal(goal);
    setCustomAmount(amount || '');

    // Solo limpiar selectedGoal si el usuario escribe algo en el campo de meta personalizada
    if (goal.trim() !== '') {
      setSelectedGoal(null);
    }
  };

  const handleContinue = () => {
    if (!canContinue) {
      console.warn('Continue pressed but conditions not met');
      return;
    }
    
    try {
      onContinue();
    } catch (error) {
      console.error('Error in onContinue:', error);
    }
  };

  const canContinue = Boolean(selectedGoal) || Boolean(customGoal.trim());

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={2} totalSteps={4} />
      <Header
        title="What's your main goal?"
        subtitle="Choose a goal or create your own. You can set a target amount too!"
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Goals onSelectGoal={handleSelectGoal} selectedGoal={selectedGoal} />
          <ManualGoal onChange={handleCustomGoalChange} disabled={!!selectedGoal} value={customGoal} amount={customAmount} />
          <ContinueButton onPress={handleContinue} disabled={!canContinue}>
            Continue
          </ContinueButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingBottom: Platform.OS === 'android' ? 25 : 0,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});
