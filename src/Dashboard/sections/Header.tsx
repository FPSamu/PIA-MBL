import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

export default function DashboardHeader() {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hello}>Hello!</Text>
      <View style={styles.iconCircle}>
        <Image source={require('../../../assets/icon.png')} style={styles.icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  hello: {
    color: '#1C1C1E',
    fontSize: 28,
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: '600',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
});
