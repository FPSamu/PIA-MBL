import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';

const CATEGORY_CONFIG = {
  Groceries: {
    icon: (color: string) => <MaterialCommunityIcons name="food-apple" size={28} color={color} />,
    circle: 'rgba(76, 175, 80, 0.5)', // green
    iconColor: '#388E3C',
  },
  Restaurant: {
    icon: (color: string) => <MaterialCommunityIcons name="silverware-fork-knife" size={28} color={color} />,
    circle: 'rgba(255, 152, 0, 0.5)', // orange
    iconColor: '#FF9800',
  },
  Transport: {
    icon: (color: string) => <FontAwesome5 name="bus" size={26} color={color} />,
    circle: 'rgba(33, 150, 243, 0.5)', // blue
    iconColor: '#1976D2',
  },
  House: {
    icon: (color: string) => <Ionicons name="home" size={28} color={color} />,
    circle: 'rgba(156, 39, 176, 0.5)', // purple
    iconColor: '#7C4DFF',
  },
  Shopping: {
    icon: (color: string) => <Feather name="shopping-bag" size={26} color={color} />,
    circle: 'rgba(255, 87, 34, 0.5)', // deep orange
    iconColor: '#FF5722',
  },
  Gas: {
    icon: (color: string) => <MaterialCommunityIcons name="gas-station" size={28} color={color} />,
    circle: 'rgba(255, 235, 59, 0.5)', // yellow
    iconColor: '#FBC02D',
  },
  Income: {
    icon: (color: string) => <Feather name="dollar-sign" size={28} color={color} />,
    circle: 'rgba(0, 179, 131, 0.5)', // teal
    iconColor: '#00B383',
  },
};

interface CategorieProps {
  category: keyof typeof CATEGORY_CONFIG;
}

export default function Categorie({ category }: CategorieProps) {
  const config = CATEGORY_CONFIG[category];
  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: config.circle }]}> 
        {config.icon(config.iconColor)}
      </View>
      <Text style={styles.text}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  circle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  text: {
    fontSize: 13,
    color: '#1C1C1E',
    fontWeight: '500',
    textAlign: 'center',
  },
});
