import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import Header from '../sections/Header';
import AboutCard from '../components/AboutCard';
import ContinueButton from '../components/ContinueButton';
import ProgressBar from '../components/ProgressBar';
import { Users, Smartphone, Globe, Store, HandCoins, ChartNoAxesCombined, Banknote, Star } from 'lucide-react-native';

const questions = [
  {
    id: 'source',
    question: 'How did you find our app?',
    options: [
      { id: 'friends', label: 'Friends', icon: Users },
      { id: 'social', label: 'Social Media', icon: Smartphone },
      { id: 'web', label: 'Web Search', icon: Globe },
      { id: 'appstore', label: 'Apps store', icon: Store },
    ],
  },
  {
    id: 'goal',
    question: 'What is your main financial goal?',
    options: [
      { id: 'save', label: 'Save Money', icon: HandCoins },
      { id: 'invest', label: 'Invest', icon: ChartNoAxesCombined },
      { id: 'budget', label: 'Budgeting', icon: Banknote },
      { id: 'goals', label: 'Reach financial goals', icon: Star },
    ],
  }
];

export default function AboutUserScreen({ onContinue }: { onContinue: () => void }) {
  const [answers, setAnswers] = useState<{ [key: string]: string | null }>({
    source: null,
    goal: null,
  });

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const canContinue = Object.values(answers).every((val) => !!val);

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={3} totalSteps={4} />
      <Header
        title="Tell us about yourself"
        subtitle="Help us personalize your experience."
      />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {questions.map((q) => (
          <AboutCard
            key={q.id}
            question={q.question}
            options={q.options}
            selectedOption={answers[q.id]}
            onSelect={(optionId) => handleSelect(q.id, optionId)}
          />
        ))}
        <ContinueButton onPress={onContinue} disabled={!canContinue}>
          Continue
        </ContinueButton>
      </ScrollView>
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
