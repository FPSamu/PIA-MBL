import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Animated, Easing, LayoutAnimation, UIManager, Platform } from 'react-native';
import TransactionCard from '../components/TransactionCard';
import { ensureValidSession } from '../../services/session';
import { supabase } from '../../onboarding/services/supabaseClient';

export default function Transactions({ refreshKey, onSeeAll }: { refreshKey?: number, onSeeAll?: () => void }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [animating, setAnimating] = useState(false);
  const collapsedCount = 3;
  const cardHeight = 84; // Approximate height of each TransactionCard + margin
  const containerAnim = useState(new Animated.Value(collapsedCount * cardHeight))[0];
  const [cardAnims, setCardAnims] = useState<Animated.Value[]>([]);

  // Enable LayoutAnimation for Android (not used here, but safe)
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

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
        setCardAnims(Array(data.length).fill(0).map(() => new Animated.Value(0)));
      }
      setLoading(false);
    };
    fetchTransactions();
  }, [refreshKey]);

  const handleSeeAll = () => {
    setAnimating(true);
    setExpanded(true);
    // Animate container height (simulate expansion, but don't show all transactions)
    Animated.timing(containerAnim, {
      toValue: 320, // visually large enough to look like an expansion
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      setAnimating(false);
      if (onSeeAll) onSeeAll();
    });
  };

  // Reset card anims if collapsed
  useEffect(() => {
    if (!expanded && cardAnims.length) {
      cardAnims.forEach(anim => anim.setValue(0));
      containerAnim.setValue(collapsedCount * cardHeight);
    }
  }, [expanded, cardAnims, containerAnim]);

  // Only show 3 transactions, even when expanded (animation is just for transition)
  const visibleTransactions = transactions.slice(0, collapsedCount);

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Last Transactions</Text>
        {!expanded && (
          <TouchableOpacity onPress={handleSeeAll} style={styles.seeAllButton} disabled={animating}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
      <Animated.View style={[styles.container, expanded && { overflow: 'hidden', height: containerAnim }]}> 
        {loading ? (
          <ActivityIndicator size="small" color="#1e3a8a" style={{ margin: 16 }} />
        ) : transactions.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888', margin: 16 }}>No transactions found.</Text>
        ) : (
          visibleTransactions.map((item, idx, arr) => {
            const anim = expanded ? cardAnims[idx] : undefined;
            return (
              <Animated.View
                key={item.id || `${item.title}-${item.date}-${idx}`}
                style={expanded && anim ? {
                  opacity: anim,
                  transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                } : undefined}
              >
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
              </Animated.View>
            );
          })
        )}
      </Animated.View>
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
