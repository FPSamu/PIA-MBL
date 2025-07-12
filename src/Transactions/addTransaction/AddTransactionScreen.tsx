import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Amount from './components/Amount';
import Title from './components/Title';
import DateComponent from './components/Date';
import TransactionType from './components/TransactionType';
import Categories from './sections/Categories';
import Accounts from './sections/Accounts';
import SaveButton from './components/SaveButton';
import { getAuthenticatedSupabase } from '../../onboarding/services/supabaseClient';
import { ensureValidSession } from '../../services/session';

export default function AddTransactionScreen({ onClose }: { onClose?: () => void }) {
  const [type, setType] = useState<'Expenses' | 'Income'>('Expenses');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  
  // Initialize with current date
  const getCurrentDate = () => {
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const year = currentDate.getFullYear();
    return `${month}/${day}/${year}`;
  };
  
  const [date, setDate] = useState(getCurrentDate());
  const [category, setCategory] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!isFormValid) return;
    
    setSaving(true);
    try {
      const session = await ensureValidSession();
      if (!session?.user?.id) {
        Alert.alert('Error', 'No user session found. Please log in again.');
        return;
      }

      const authenticatedSupabase = await getAuthenticatedSupabase();
      
      // Prepare transaction data
      const transactionData = {
        uid: session.user.id,
        category: category,
        type: type === 'Expenses' ? 'expense' : 'income',
        title: title.trim() || category, // Use category as title if title is empty
        account: account,
        amount: parseFloat(amount),
        date: date,
      };

      // Insert transaction
      const { error: txError } = await authenticatedSupabase
        .from('transactions')
        .insert(transactionData);

      if (txError) {
        console.error('Error saving transaction:', txError);
        Alert.alert('Error', 'Failed to save transaction. Please try again.');
        setSaving(false);
        return;
      }

      // Fetch current balance for the selected account
      const { data: accountData, error: accFetchError } = await authenticatedSupabase
        .from('accounts')
        .select('balance')
        .eq('uid', session.user.id)
        .eq('title', account)
        .single();

      console.log('Account balance update debug:', {
        uid: session.user.id,
        accountTitle: account,
        accountData,
        accFetchError
      });

      if (accFetchError) {
        console.error('Error fetching account balance:', accFetchError);
        Alert.alert('Error', 'Transaction saved, but failed to update account balance.');
        setSaving(false);
        if (onClose) onClose();
        return;
      }

      let currentBalance = accountData?.balance ?? 0;
      if (typeof currentBalance !== 'number') {
        currentBalance = parseFloat(currentBalance) || 0;
      }

      // Calculate new balance
      const amt = parseFloat(amount);
      const newBalance =
        type === 'Expenses' ? currentBalance - amt : currentBalance + amt;

      console.log('Balance calculation:', {
        currentBalance,
        amount: amt,
        type,
        newBalance
      });

      // Update account balance
      const { error: accUpdateError } = await authenticatedSupabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('uid', session.user.id)
        .eq('title', account);

      console.log('Account update result:', { accUpdateError });

      if (accUpdateError) {
        console.error('Error updating account balance:', accUpdateError);
        Alert.alert('Error', 'Transaction saved, but failed to update account balance.');
      } else {
        // Update user total balance
        const { data: allAccounts, error: fetchAllError } = await authenticatedSupabase
          .from('accounts')
          .select('title, balance')
          .eq('uid', session.user.id);

        if (fetchAllError) {
          console.error('Error fetching all accounts for total balance:', fetchAllError);
        } else {
          let cashBalance = 0;
          let savingsBalance = 0;
          let creditCardBalance = 0;

          allAccounts.forEach(acc => {
            if (acc.title === 'Cash') {
              cashBalance = parseFloat(acc.balance) || 0;
            } else if (acc.title === 'Savings') {
              savingsBalance = parseFloat(acc.balance) || 0;
            } else if (acc.title === 'Credit card') {
              creditCardBalance = parseFloat(acc.balance) || 0;
            }
          });

          const totalBalance = (cashBalance + savingsBalance) - creditCardBalance;

          console.log('Total balance calculation:', {
            cashBalance,
            savingsBalance,
            creditCardBalance,
            totalBalance
          });

          // Update user_balance table
          const { error: totalBalanceError } = await authenticatedSupabase
            .from('user_balance')
            .update({ total_balance: totalBalance })
            .eq('uid', session.user.id);

          if (totalBalanceError) {
            console.error('Error updating total balance:', totalBalanceError);
          } else {
            console.log('Total balance updated successfully');
          }
        }

        Alert.alert('Success', 'Transaction saved successfully!', [
          { text: 'OK', onPress: onClose }
        ]);
      }
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      Alert.alert('Error', 'Failed to save transaction. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = amount.trim() && category && account;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Transaction</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#1C1C1E" />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.typeRow}>
              <TransactionType label="Expenses" selected={type === 'Expenses'} onPress={() => setType('Expenses')} />
              <TransactionType label="Income" selected={type === 'Income'} onPress={() => setType('Income')} />
            </View>
            <Amount value={amount} onChangeText={setAmount} />
            <Title value={title} onChangeText={setTitle} />
            <Categories selected={category} onSelect={setCategory} />
            <Accounts selected={account} onSelect={setAccount} />
            <DateComponent value={date} onChangeText={setDate} />
            <SaveButton onPress={handleSave} disabled={!isFormValid || saving} saving={saving} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
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
