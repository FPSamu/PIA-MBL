import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFonts, Inter_600SemiBold } from '@expo-google-fonts/inter';
import AccountCard from '../components/AccountCard';
import { ensureValidSession } from '../../services/session';
import { supabase } from '../../onboarding/services/supabaseClient';

export default function Accounts({ refreshKey }: { refreshKey?: number }) {
  const [cash, setCash] = useState<string | number>('Loading...');
  const [savings, setSavings] = useState<string | number>('Loading...');
  const [credit, setCredit] = useState<string | number>('Loading...');
  const [creditPositive, setCreditPositive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      const session = await ensureValidSession();
      if (!session?.user?.id) {
        setCash('N/A');
        setSavings('N/A');
        setCredit('N/A');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('accounts')
        .select('title, balance')
        .eq('uid', session.user.id);
      if (error || !data) {
        setCash('N/A');
        setSavings('N/A');
        setCredit('N/A');
      } else {
        const cashAcc = data.find(acc => acc.title === 'Cash');
        const savingsAcc = data.find(acc => acc.title === 'Savings');
        const creditAcc = data.find(acc => acc.title === 'Credit card');
        setCash(cashAcc ? `$${Number(cashAcc.balance).toLocaleString()}` : '$0');
        setSavings(savingsAcc ? `$${Number(savingsAcc.balance).toLocaleString()}` : '$0');
        if (creditAcc) {
          const creditValue = Number(creditAcc.balance);
          setCredit(`${creditValue < 0 ? '-' : ''}$${Math.abs(creditValue).toLocaleString()}`);
          setCreditPositive(creditValue >= 0);
        } else {
          setCredit('$0');
          setCreditPositive(false);
        }
      }
      setLoading(false);
    };
    fetchAccounts();
  }, [refreshKey]);

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
    fontWeight: 600,
    fontFamily: 'Inter_600SemiBold'
  }
});
