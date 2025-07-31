import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ensureValidSession } from "../../services/session";
import { supabase } from "../../onboarding/services/supabaseClient";
import SavingsGoalPopup from "../popups/SavingsGoalPopup";

export default function SavingsGoal() {
  const [goalAmount, setGoalAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // si aún no lo tienes

  useEffect(() => {
    const fetchGoalAmount = async () => {
      setLoading(true);
      const session = await ensureValidSession();
      if (!session?.user?.id) {
        setGoalAmount(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("savings_info")
        .select("goal_amount")
        .eq("uid", session.user.id)
        .limit(1)
        .single();

      if (error || !data) {
        console.error("Error fetching goal amount:", error);
        setGoalAmount(null);
      } else {
        setGoalAmount(data.goal_amount);
      }

      setLoading(false);
    };

    fetchGoalAmount();
  }, []);

  const [showGoalPopup, setShowGoalPopup] = useState(false);

  // PASO 3: Crear función para abrir el popup
  const handleGoalPress = () => {
    if (!loading && goalAmount !== null) {
      setShowGoalPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowGoalPopup(false);
  };

  const handleGoalUpdated = (newGoal: number) => {
    setGoalAmount(newGoal);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGoalPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="flag" size={20} color="#06BF8B" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>Savings Goal</Text>
          <Text style={styles.buttonAmount}>
            {loading || goalAmount === null ? 'Loading...' : `$${goalAmount.toLocaleString()}`}
          </Text>

        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
      <SavingsGoalPopup
        visible={showGoalPopup}
        onClose={handleClosePopup}
        currentGoal={goalAmount}
        onGoalUpdated={handleGoalUpdated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonSpacing: {
    marginTop: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#66D9B880',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1c',
    marginBottom: 2,
  },
  buttonAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#999',
  },
});