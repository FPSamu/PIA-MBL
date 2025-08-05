import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TransactionCard from '../../Dashboard/components/TransactionCard';
import { ensureValidSession } from '../../services/session';
import { supabase } from '../../onboarding/services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionScreen({ onBack }: { onBack?: () => void }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to format timestamp to readable date string
  const formatTimestampToDate = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return timestamp; // Fallback to original value
    }
  };

  // Function to format timestamp to readable date and time string
  const formatTimestampToDateTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${month}/${day}/${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting timestamp to datetime:', error);
      return timestamp; // Fallback to original value
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const session = await ensureValidSession();
      if (!session?.user?.id) {
        setTransactions([]);
        setLoading(false);
        return;
      }
      
      // Order by timestamp (date column) in descending order for newest first
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('uid', session.user.id)
        .order('date', { ascending: false });
        
      if (error || !data) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      } else {
        // Process transactions to format dates
        const processedTransactions = data.map(transaction => ({
          ...transaction,
          formattedDate: formatTimestampToDate(transaction.date),
          formattedDateTime: formatTimestampToDateTime(transaction.date)
        }));
        
        console.log('Fetched transactions with timestamps:', processedTransactions.slice(0, 2)); // Log first 2 for debugging
        setTransactions(processedTransactions);
      }
      setLoading(false);
    };
    
    fetchTransactions();
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#1e3a8a" />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Transactions</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="small" color="#1e3a8a" style={{ margin: 16 }} />
          ) : transactions.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888', margin: 16 }}>No transactions found.</Text>
          ) : (
            transactions.map((item, idx, arr) => (
              <React.Fragment key={item.id || `${item.title}-${item.date}-${idx}`}>
                <TransactionCard
                  title={item.title}
                  account={item.account}
                  category={item.category}
                  date={item.formattedDate} // Use formatted date for display
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    paddingVertical: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  backButton: {
    padding: 4,
    width: 32,
    alignItems: 'flex-start',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    paddingVertical: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#757575',
    marginHorizontal: 18,
    opacity: 0.18,
  },
});