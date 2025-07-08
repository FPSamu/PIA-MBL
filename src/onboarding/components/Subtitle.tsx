import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface SubtitleProps {
  children: any;
}

function Subtitle({ children }: SubtitleProps) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default Subtitle;
