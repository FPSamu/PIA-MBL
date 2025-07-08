import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, Image, Platform } from 'react-native';
import Header from '../sections/Header';
import { ArrowRight } from 'lucide-react-native';

interface GetStartedProps {
  onGetStarted: () => void;
  onLoginPress?: () => void;
}

export default function GetStarted({ onGetStarted, onLoginPress }: GetStartedProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header 
          title="Welcome to your Personal Income Assistant" 
          subtitle="Your personal AI assistant to help you achieve your goals and stay organized." 
        />
        <Image 
          style={styles.icon}
          source={require("../../../assets/icon.png")}
        />
        
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={onGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <ArrowRight color="#1e3a8a" size={24} />
        </TouchableOpacity>
        <View style={styles.loginTextContainer}>
          <Text style={styles.loginText}>I have an account! </Text>
          <TouchableOpacity onPress={onLoginPress}>
            <Text style={styles.loginButton}>Login</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    width: 240,
    height: 240,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 40,
  },
  getStartedText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1e3a8a',
    marginRight: 8,
  },
  loginTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  loginText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  loginButton: {
    color: '#3b82f6',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    textDecorationLine: 'underline',
  },
}); 