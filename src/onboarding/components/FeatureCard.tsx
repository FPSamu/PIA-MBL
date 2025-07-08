import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';

interface FeatureCardProps {
  image: ImageSourcePropType;
  icon: React.ReactNode;
  iconBackground: string;
  title: string;
  description: string;
}

function FeatureCard({ image, icon, iconBackground, title, description }: FeatureCardProps) {
  return (
    <View style={styles.featureCard}>
      <Image source={image} style={styles.featureImage} resizeMode="cover" />
      <View style={styles.featureContent}>
        <View style={[styles.featureIcon, { backgroundColor: iconBackground }]}> 
          {icon}
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    // backdropFilter is not supported in React Native, so we omit it
  },
  featureImage: {
    width: '100%',
    height: 120,
  },
  featureContent: {
    padding: 20,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    lineHeight: 22,
  },
});

export default FeatureCard;
