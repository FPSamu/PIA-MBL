import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Amount from './components/Amount';
import Title from './components/Title';
import TransactionType from './components/TransactionType';
import Categories from './sections/Categories';
import Accounts from './sections/Accounts';

export default function AddTransactionScreen({ onClose }: { onClose?: () => void }) {
  const [type, setType] = useState<'Expenses' | 'Income'>('Expenses');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<
    'Income' | 'Groceries' | 'Restaurant' | 'Transport' | 'House' | 'Shopping' | 'Gas'
  >('Groceries');
  const [account, setAccount] = useState<string>('');

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Transaction</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#1C1C1E" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.typeRow}>
          <TransactionType label="Expenses" selected={type === 'Expenses'} onPress={() => setType('Expenses')} />
          <TransactionType label="Income" selected={type === 'Income'} onPress={() => setType('Income')} />
        </View>
        <Amount value={amount} onChangeText={setAmount} />
        <Title value={title} onChangeText={setTitle} />
        <Categories selected={category} onSelect={setCategory} />
        <Accounts selected={account} onSelect={setAccount} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    paddingTop: 48,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 18,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  closeButton: {
    padding: 4,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    shadowColor: '#D4D4D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
});
