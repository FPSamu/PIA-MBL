import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const GoogleButton: React.FC = () => {
  return (
    <TouchableOpacity style={[styles.button, styles.disabledButton]} disabled={true} activeOpacity={1}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Text style={styles.gIcon}>G</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buttonText}>Continue with Google</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Available soon</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gIcon: {
    fontSize: 20,
    color: '#4285F4',
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    flex: 0,
  },
  badge: {
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#1e3a8a',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});

export default GoogleButton;
