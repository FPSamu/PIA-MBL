import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import TransactionCard from '../components/TransactionCard';
import { ensureValidSession } from '../../services/session';
import { supabase } from '../../onboarding/services/supabaseClient';

export default function Transactions({ refreshKey, onSeeAll }: { refreshKey?: number, onSeeAll?: () => void }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const session = await ensureValidSession();
      if (!session?.user?.id) {
        setTransactions([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('uid', session.user.id)
        .order('date', { ascending: false });
      if (error || !data) {
        setTransactions([]);
      } else {
        setTransactions(data);
      }
      setLoading(false);
    };
    fetchTransactions();
  }, [refreshKey]);

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Transactions</Text>
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="small" color="#1e3a8a" style={{ margin: 16 }} />
        ) : transactions.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888', margin: 16 }}>No transactions found.</Text>
        ) : (
          transactions.slice(0, 3).map((item, idx, arr) => (
            <React.Fragment key={item.id}>
              <TransactionCard
                title={item.title}
                account={item.account}
                category={item.category}
                date={item.date}
                amount={
                  item.amount < 0
                    ? `-$${Math.abs(item.amount).toLocaleString()}`
                    : `$${Number(item.amount).toLocaleString()}`
                }
                type={item.type === 'income' ? 'income' : 'outcome'}
              />
              {idx < arr.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 24,
  },
  label: {
    fontSize: 26,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAllText: {
    color: '#1e3a8a',
    fontWeight: '500',
    fontSize: 16,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    // paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  listContent: {
    paddingVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#757575',
    marginHorizontal: 18,
    opacity: 0.18,
  },
});
