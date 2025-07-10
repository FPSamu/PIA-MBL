import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import Header from '../sections/Header';
import ContinueButton from '../components/ContinueButton';
import Features from '../sections/Features';
import ProgressBar from '../components/ProgressBar';

interface FeaturesScreenProps {
  onContinue: () => void;
  selectedFeature: string | null;
  setSelectedFeature: (feature: string | null) => void;
}

export default function FeaturesScreen({ onContinue, selectedFeature, setSelectedFeature }: FeaturesScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ProgressBar currentStep={1} totalSteps={4} />
        <Header 
          title="Everything You Need" 
          subtitle="Powerful features to take control of your finances" 
        />
        
        <View style={styles.featuresContainer}>
          <Features selectedFeature={selectedFeature} setSelectedFeature={setSelectedFeature} />
        </View>
        
        <ContinueButton onPress={onContinue}>
          Continue
        </ContinueButton>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: Platform.OS === 'android' ? 10 : 0,
  },
  featuresContainer: {
    flex: 1,
    marginTop: 30,
    justifyContent: 'center',
  },
});
