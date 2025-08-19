import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFonts, Inter_600SemiBold } from '@expo-google-fonts/inter';
import AccountCard from '../components/AccountCard';
import { ensureValidSession } from '../../services/session';
import { supabase } from '../../onboarding/services/supabaseClient';

export default function Accounts({ refreshKey }: { refreshKey?: number }) {
  const [cash, setCash] = useState<string>('Loading...');
  const [savings, setSavings] = useState<string>('Loading...');
  const [credit, setCredit] = useState<string>('Loading...');
  const [creditPositive, setCreditPositive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCash = async () => {
      const session = await ensureValidSession();
      if (!session?.user?.id) {
        setCash('N/A');
        return;
      }

      const { data, error } = await supabase
        .from('accounts')
        .select('balance')
        .eq('account_name', 'cash')
        .eq('uid', session.user.id)
        .limit(1)
        .single();

      if (error || !data) {
        setCash('N/A');
      } else {
        setCash(`$${Number(data.balance).toLocaleString()}`);
      }
    };

    fetchCash();
  }, []);

  useEffect(() => {
    const fetchSavings = async () => {
      const session = await ensureValidSession();
      if (!session?.user?.id) {
        setSavings('N/A');
        return;
      }

      const { data, error } = await supabase
        .from('accounts')
        .select('balance')
        .eq('account_name', 'savings')
        .eq('uid', session.user.id)
        .limit(1)
        .single();

      if (error || !data) {
        setSavings('N/A');
      } else {
        setSavings(`$${Number(data.balance).toLocaleString()}`);
      }
    };

    fetchSavings();
  }, []);

  useEffect(() => {
    const fetchCredit = async () => {
      const session = await ensureValidSession();
      if (!session?.user?.id) {
        setCredit('N/A');
        setCreditPositive(false);
        return;
      }

      const { data, error } = await supabase
        .from('accounts')
        .select('balance')
        .eq('account_name', 'credit_card')
        .eq('uid', session.user.id)
        .limit(1)
        .single();

      if (error || !data) {
        setCredit('N/A');
        setCreditPositive(false);
      } else {
        const value = Number(data.balance);
        setCredit(`${value < 0 ? '-' : ''}$${Math.abs(value).toLocaleString()}`);
        setCreditPositive(value >= 0);
      }
    };

    fetchCredit();
  }, []);

  useEffect(() => {
    const stillLoading =
      cash === 'Loading...' || savings === 'Loading...' || credit === 'Loading...';
    setLoading(stillLoading);
  }, [cash, savings, credit]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your accounts</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AccountCard type="cash" amount={loading ? 'Loading...' : cash} />
        <AccountCard type="savings" amount={loading ? 'Loading...' : savings} />
        <AccountCard type="credit" amount={loading ? 'Loading...' : credit} positive={creditPositive} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    paddingHorizontal: 24,
    fontSize: 26,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold'
  }
});
