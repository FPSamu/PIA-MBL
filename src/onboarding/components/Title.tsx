import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface TitleProps {
  children: any;
}

function Title({ children }: TitleProps) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default Title;
