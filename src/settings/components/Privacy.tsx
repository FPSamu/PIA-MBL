import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function Privacy() {
    return(
        <View>
            <TouchableOpacity 
                style={[styles.button, styles.buttonSpacing]}
                // onPress={() => handleSettingPress('Privacy')}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="lock-closed" size={20} color="#666" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.buttonTitle}>Privacy</Text>
                    <Text style={styles.buttonSubtitle}>Terms & Conditions</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonSpacing: {
    // marginTop: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1c',
    marginBottom: 2,
  },
  buttonAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#999',
  },
});