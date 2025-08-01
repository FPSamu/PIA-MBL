import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, ScrollView, Platform } from 'react-native';
import { removeSession } from '../services/session';
import DashboardHeader from './sections/Header';
import { StatusBar } from 'expo-status-bar';
import Balance from './sections/Balance';
import Accounts from './sections/Accounts';
import { ensureValidSession } from '../services/session';
import { supabase } from '../onboarding/services/supabaseClient';
import Transactions from './sections/Transactions';
import Recommendations from './components/Recomendation';

export default function Dashboard({ onLogout, refreshKey, onSeeAll }: { onLogout?: () => void, refreshKey?: number, onSeeAll?: () => void }) {
  const [balance, setBalance] = useState<string | number>('Loading...');
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState<string | number>('Loading...');
  const [expenses, setExpenses] = useState<string | number>('Loading...');

  useEffect(() => {
    const fetchBalanceAndTransactions = async () => {
      setLoading(true);
      const session = await ensureValidSession();
      if (!session?.user?.id) {
        setBalance('N/A');
        setIncome('N/A');
        setExpenses('N/A');
        setLoading(false);
        return;
      }
      // Fetch balance
      const { data: balanceData, error: balanceError } = await supabase
        .from('user_balance')
        .select('total_balance')
        .eq('uid', session.user.id)
        .single();
      if (balanceError || !balanceData) {
        setBalance('N/A');
      } else {
        setBalance(balanceData.total_balance ?? 0);
      }
      // Fetch transactions for the last month
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      // Format as YYYY-MM-DD for Supabase
      const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}-${String(lastMonth.getDate()).padStart(2, '0')}`;
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('uid', session.user.id)
        .gte('date', lastMonthStr);
      if (txError || !transactions) {
        setIncome('N/A');
        setExpenses('N/A');
      } else {
        let incomeSum = 0;
        let expenseSum = 0;
        transactions.forEach(tx => {
          if (tx.type === 'income') {
            incomeSum += Math.abs(Number(tx.amount));
          } else if (tx.type === 'expense') {
            expenseSum += Math.abs(Number(tx.amount));
          }
        });
        setIncome(`$${incomeSum.toLocaleString()}`);
        setExpenses(`-$${expenseSum.toLocaleString()}`);
      }
      setLoading(false);
    };
    fetchBalanceAndTransactions();
  }, [refreshKey]);

  const handleLogout = async () => {
    await removeSession();
    if (onLogout) onLogout();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#000" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <DashboardHeader />
        <Balance total={loading ? 'Loading...' : '$' + balance} income={income} expenses={expenses} />
        <Recommendations
          title="Dining out too often?"
          description="You've spent $155 on restaurants this week. That's 30% more than your usual. Consider cooking at home more often to save."
          category="excessive_expenses"
          onHelpfulPress={() => console.log('Helpful pressed')}
          onNotForMePress={() => console.log('Not for me pressed')}
        />
        <Accounts refreshKey={refreshKey} />
        <Transactions refreshKey={refreshKey} onSeeAll={onSeeAll} />
        <Button title="Log Out (Test)" onPress={handleLogout} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCFB',
    paddingTop: 0,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  navbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
