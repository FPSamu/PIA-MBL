import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Import the category configuration
const CATEGORY_CONFIG = {
  Groceries: {
    color: '#388E3C',
  },
  Restaurant: {
    color: '#FF9800',
  },
  Transport: {
    color: '#1976D2',
  },
  House: {
    color: '#7C4DFF',
  },
  Shopping: {
    color: '#FF5722',
  },
  Gas: {
    color: '#FBC02D',
  },
  Income: {
    color: '#00B383',
  },
};

interface GraphBarProps {
  percentage: number; // Value between 0 and 100
  category: keyof typeof CATEGORY_CONFIG;
  maxHeight?: number; // Optional max height of the bar
}

export default function GraphBar({ percentage, category, maxHeight = 200 }: GraphBarProps) {
  const barHeight = Math.max(0, Math.min(100, percentage)) * (maxHeight / 100);
  const config = CATEGORY_CONFIG[category];

  return (
    <View style={styles.container}>
      <View style={styles.barWrapper}>
        <View style={[styles.barContainer, { height: maxHeight }]}>
          <View
            style={[
              styles.bar,
              {
                height: barHeight,
                backgroundColor: `${config.color}c1`,
                borderColor: config.color,
              }
            ]}
          />
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.categoryText}>{category}</Text>
          <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
  },
  barWrapper: {
    height: '100%',
    alignItems: 'center',
  },
  barContainer: {
    width: 40,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 6,
  },
  labelContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#1C1C1E',
    fontWeight: '500',
    textAlign: 'center',
  },
  percentageText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
});