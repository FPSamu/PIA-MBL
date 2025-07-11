import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import NavButton from './components/NavButton';
import { Ionicons } from '@expo/vector-icons';

const NAVS = ['Home', 'Transactions', 'Insights', 'Settings'] as const;
type NavType = typeof NAVS[number];

interface NavbarProps {
  onAddPress?: () => void;
}

export default function Navbar({ onAddPress }: NavbarProps) {
  const [selected, setSelected] = useState<NavType>('Home');

  const handleNavPress = (nav: NavType) => {
    setSelected(nav);
  };

  const handleAddPress = () => {
    setSelected(undefined);
    if (onAddPress) onAddPress();
  };

  return (
    <View style={styles.floatingWrapper} pointerEvents="box-none">
      <View style={styles.navbar}>
        <NavButton label="Home" selected={selected === 'Home'} onPress={() => handleNavPress('Home')} />
        <NavButton label="Transactions" selected={selected === 'Transactions'} onPress={() => handleNavPress('Transactions')} />
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress} activeOpacity={0.8}>
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
        <NavButton label="Insights" selected={selected === 'Insights'} onPress={() => handleNavPress('Insights')} />
        <NavButton label="Settings" selected={selected === 'Settings'} onPress={() => handleNavPress('Settings')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 24 : 16,
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'box-none',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: 'rgba(217,217,217,0.85)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: '#fff',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5C6AC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#5C6AC4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
});
