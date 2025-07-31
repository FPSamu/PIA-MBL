import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ensureValidSession } from "../../services/session";
import { supabase } from "../../onboarding/services/supabaseClient";
import SavingsPopup from "../popups/SavingsPopup";

export default function Savings() {
  const [savingsAmount, setSavingsAmount] = useState<number | null>(null);
  const [savingsTitle, setSavingsTitle] = useState<string | null>(null);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const fetchSavingsAmount = async () => {
          setLoading(true);
          const session = await ensureValidSession();
          if (!session?.user?.id) {
            setSavingsAmount(null);
            setLoading(false);
            return;
          }
    
          const { data, error } = await supabase
            .from("accounts")
            .select("balance, title")
            .eq("uid", session.user.id)
            .eq("account_name", 'savings')
            .limit(1)
            .single();
    
          if (error || !data) {
            console.error("Error fetching savings amount:", error);
            setSavingsAmount(null);
          } else {
            setSavingsAmount(data.balance);
            setSavingsTitle(data.title);
          }
    
          setLoading(false);
        };
    
        fetchSavingsAmount();
      }, []);

      const [showSavingsPopup, setShowSavingsPopup] = useState(false);
      
        // PASO 3: Crear función para abrir el popup
        const handleSavingsPress = () => {
          if (!loading && savingsAmount !== null) {
            setShowSavingsPopup(true);
          }
        };
      
        const handleClosePopup = () => {
          setShowSavingsPopup(false);
        };
      
        const handleSavingsUpdated = (newSavings: number) => {
          setSavingsAmount(newSavings);
        };

    return(
        <View>
            <TouchableOpacity 
                style={[styles.button, styles.buttonSpacing]}
                onPress={handleSavingsPress}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>
                    <MaterialIcons name="savings" size={22} color={"#06BF8B"} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.buttonTitle}>Savings</Text>
                    <Text style={styles.buttonAmount}>
                      {loading || savingsAmount === null ? 'Loading...' : `$${savingsAmount.toLocaleString()}`}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
            <SavingsPopup
              visible={showSavingsPopup}
              onClose={handleClosePopup}
              currentSavings={savingsAmount}
              currentTitle={savingsTitle}
              onSavingsUpdated={handleSavingsUpdated}
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
    marginBottom: 12,
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