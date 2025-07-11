import React, { useState } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Categorie from '../components/Categorie';

const CATEGORIES = [
  'Groceries',
  'Restaurant',
  'Transport',
  'House',
  'Shopping',
  'Gas',
  'Income',
] as const;
type CategoryType = typeof CATEGORIES[number];

const CATEGORY_COLORS = {
  Groceries: '#388E3C',
  Restaurant: '#FF9800',
  Transport: '#1976D2',
  House: '#7C4DFF',
  Shopping: '#FF5722',
  Gas: '#FBC02D',
  Income: '#00B383',
};

export default function Categories({ selected, onSelect }: { selected?: CategoryType; onSelect?: (cat: CategoryType) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(selected || 'Groceries');

  const handleSelect = (cat: CategoryType) => {
    setSelectedCategory(cat);
    if (onSelect) onSelect(cat);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            activeOpacity={0.8}
            onPress={() => handleSelect(cat)}
            style={[
              selectedCategory === cat && {
                borderWidth: 1,
                borderColor: CATEGORY_COLORS[cat],
                borderRadius: 10,
                padding: 2,
              },
            ]}
          >
            <Categorie category={cat} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 8,
  },
  label: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
