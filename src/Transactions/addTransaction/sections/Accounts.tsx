import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Account from '../components/Account';
import { supabase, getAuthenticatedSupabase } from '../../../onboarding/services/supabaseClient';
import { ensureValidSession } from '../../../services/session';

export default function Accounts({ selected, onSelect }: { selected?: string; onSelect?: (acc: string) => void }) {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>(selected || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccounts() {
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
          .from('accounts')
          .select('title')
          .eq('uid', uid);
        
        if (dbError) {
          setError(dbError.message);
        } else {
          const titles = (data || []).map((acc: any) => acc.title);
          setAccounts(titles);
          if (!selectedAccount && titles.length > 0) {
            setSelectedAccount(titles[0]);
            if (onSelect) onSelect(titles[0]);
          }
          // If no accounts exist, create default ones
          if (titles.length === 0) {
            await createDefaultAccounts(uid);
            // Fetch accounts again after creating them
            const { data: newData, error: newError } = await authenticatedSupabase
              .from('accounts')
              .select('title')
              .eq('uid', uid);
            if (!newError && newData) {
              const newTitles = newData.map((acc: any) => acc.title);
              setAccounts(newTitles);
              if (newTitles.length > 0) {
                setSelectedAccount(newTitles[0]);
                if (onSelect) onSelect(newTitles[0]);
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
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createDefaultAccounts = async (uid: string) => {
    try {
      const authenticatedSupabase = await getAuthenticatedSupabase();
      const defaultAccounts = [
        { account_name: 'cash', title: 'Cash', balance: 0 },
        { account_name: 'credit_card', title: 'Credit card', balance: 0 },
        { account_name: 'savings', title: 'Savings', balance: 0 }
      ];
      
      for (const account of defaultAccounts) {
        const { error } = await authenticatedSupabase.from('accounts').upsert({
          uid,
          ...account
        });
        if (error) {
          console.error(`Error creating ${account.title} account:`, error);
        } else {
          console.log(`Successfully created ${account.title} account`);
        }
      }
    } catch (e: any) {
      console.error('Error creating default accounts:', e);
    }
  };

  const handleSelect = (acc: string) => {
    setSelectedAccount(acc);
    if (onSelect) onSelect(acc);
  };

  if (loading) {
    return <Text>Loading accounts...</Text>;
  }
  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Account</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {accounts.map((acc) => (
          <TouchableOpacity
            key={acc}
            activeOpacity={0.8}
            onPress={() => handleSelect(acc)}
          >
            <Account
              type={acc}
              selected={selectedAccount === acc}
            />
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
