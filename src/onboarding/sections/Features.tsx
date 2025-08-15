import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import FeatureCard from '../components/FeatureCard';
import { CirclePlus, Bot, CreditCard, Target } from 'lucide-react-native';

const features = [
  {
    image: require('../assets/track.jpg'),
    icon: <CirclePlus color="#fff" size={24} />,
    iconBackground: '#22c55e',
    title: 'Track income & expenses',
    description: 'Easily log and monitor your income and expenses in one place.',
  },
  {
    image: require('../assets/ai.jpg'),
    icon: <Bot color="#fff" size={24} />,
    iconBackground: '#3b82f6',
    title: 'AI-powered insights',
    description: 'Get personalized recommendations and financial advice based on your spending patterns.',
  },
  {
    image: require('../assets/accounts.jpg'),
    icon: <CreditCard color="#fff" size={24} />,
    iconBackground: '#f59e0b',
    title: 'Multiple accounts',
    description: 'Manage all your cash and credit accounts in a single app.',
  },
  {
    image: require('../assets/target.jpg'),
    icon: <Target color="#fff" size={24} />,
    iconBackground: '#6366f1',
    title: 'Smart goals',
    description: 'Set, track, and achieve your financial goals with smart assistance.',
  },
];

function Features() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {features.map((feature, idx) => (
        <View style={styles.cardWrapper} key={idx}>
          <FeatureCard
            image={feature.image}
            icon={feature.icon}
            iconBackground={feature.iconBackground}
            title={feature.title}
            description={feature.description}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    paddingBottom: 16,
  },
  cardWrapper: {
    marginBottom: 2,
  },
});

export default Features;
