import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Categorie from '../components/Categorie';
import { getAuthenticatedSupabase } from '../../../onboarding/services/supabaseClient';
import { ensureValidSession } from '../../../services/session';

interface Category {
  name: string;
  color: string;
}

export default function Categories({ selected, onSelect }: { selected?: string; onSelect?: (cat: string) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(selected || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const session = await ensureValidSession();
        const uid = session?.user?.id;
        if (!uid) {
          setError('No user session found');
          setLoading(false);
          return;
        }
        
        const authenticatedSupabase = await getAuthenticatedSupabase();
        const { data, error: dbError } = await authenticatedSupabase
          .from('categories')
          .select('name, color')
          .eq('uid', uid);
        
        if (dbError) {
          setError(dbError.message);
        } else {
          setCategories(data || []);
          if (!selectedCategory && data && data.length > 0) {
            setSelectedCategory(data[0].name);
            if (onSelect) onSelect(data[0].name);
          }
          // If no categories exist, create default ones
          if (!data || data.length === 0) {
            await createDefaultCategories(uid);
            // Fetch categories again after creating them
            const { data: newData, error: newError } = await authenticatedSupabase
              .from('categories')
              .select('name, color')
              .eq('uid', uid);
            if (!newError && newData) {
              setCategories(newData);
              if (newData.length > 0) {
                setSelectedCategory(newData[0].name);
                if (onSelect) onSelect(newData[0].name);
              }
            }
          }
        }
      } catch (e: any) {
        setError(e.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createDefaultCategories = async (uid: string) => {
    try {
      const authenticatedSupabase = await getAuthenticatedSupabase();
      const defaultCategories = [
        { name: 'Groceries', color: '#388E3C' },
        { name: 'Restaurant', color: '#FF9800' },
        { name: 'Transport', color: '#1976D2' },
        { name: 'House', color: '#7C4DFF' },
        { name: 'Shopping', color: '#FF5722' },
        { name: 'Gas', color: '#FBC02D' },
        { name: 'Income', color: '#00B383' },
      ];
      
      for (const category of defaultCategories) {
        const { error } = await authenticatedSupabase.from('categories').upsert({
          uid,
          ...category
        });
        if (error) {
          console.error(`Error creating ${category.name} category:`, error);
        } else {
          console.log(`Successfully created ${category.name} category`);
        }
      }
    } catch (e: any) {
      console.error('Error creating default categories:', e);
    }
  };

  const handleSelect = (cat: string) => {
    setSelectedCategory(cat);
    if (onSelect) onSelect(cat);
  };

  if (loading) {
    return <Text>Loading categories...</Text>;
  }
  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.name}
            activeOpacity={0.8}
            onPress={() => handleSelect(cat.name)}
            style={[
              selectedCategory === cat.name && {
                borderWidth: 1,
                borderColor: cat.color,
                borderRadius: 10,
                padding: 2,
              },
            ]}
          >
            <Categorie category={cat.name} />
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
