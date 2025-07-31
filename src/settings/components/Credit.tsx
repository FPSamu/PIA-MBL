import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ensureValidSession } from "../../services/session";
import { supabase } from "../../onboarding/services/supabaseClient";
import CreditPopup from "../popups/CreditPopup";

export default function Credit() {
  const [creditAmount, setCreditAmount] = useState<number | null>(null);
  const [creditTitle, setCreditTitle] = useState<string | null>(null);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const fetchCreditAmount = async () => {
          setLoading(true);
          const session = await ensureValidSession();
          if (!session?.user?.id) {
            setCreditAmount(null);
            setLoading(false);
            return;
          }
    
          const { data, error } = await supabase
            .from("accounts")
            .select("balance, title")
            .eq("uid", session.user.id)
            .eq("account_name", 'credit_card')
            .limit(1)
            .single();
    
          if (error || !data) {
            console.error("Error fetching credit amount:", error);
            setCreditAmount(null);
          } else {
            setCreditAmount(data.balance);
            setCreditTitle(data.title);
          }
    
          setLoading(false);
        };
    
        fetchCreditAmount();
      }, []);

          const [showCreditPopup, setShowCreditPopup] = useState(false);
                
                  // PASO 3: Crear función para abrir el popup
                  const handleCreditPress = () => {
                    if (!loading && creditAmount !== null) {
                      setShowCreditPopup(true);
                    }
                  };
                
                  const handleClosePopup = () => {
                    setShowCreditPopup(false);
                  };
                
                  const handleCreditUpdated = (newSavings: number) => {
                    setCreditAmount(newSavings);
                  };

    return(
        <View>
            <TouchableOpacity 
                style={[styles.button, styles.buttonSpacing]}
                onPress={handleCreditPress}
                activeOpacity={0.7}
            >
            <View style={styles.iconContainer}>
                <Ionicons name="card" size={20} color="#FC3838" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.buttonTitle}>Credit Card</Text>
                <Text style={styles.buttonAmount}>
                  {loading || creditAmount === null ? 'Loading...' : `$${creditAmount.toLocaleString()}`}
                </Text>
            </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
            <CreditPopup
              visible={showCreditPopup}
              onClose={handleClosePopup}
              currentCredit={creditAmount}
              currentTitle={creditTitle}
              onCashUpdated={handleCreditUpdated}
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
    // marginTop: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF8A8A80',
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