import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ensureValidSession } from "../../services/session";
import { supabase } from "../../onboarding/services/supabaseClient";
import CashPopup from "../popups/CashPopup";

export default function Cash() {
  const [cashAmount, setCashAmount] = useState<number | null>(null);
  const [cashTitle, setCashTitle] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // si aún no lo tienes
  
    useEffect(() => {
      const fetchCashAmount = async () => {
        setLoading(true);
        const session = await ensureValidSession();
        if (!session?.user?.id) {
          setCashAmount(null);
          setLoading(false);
          return;
        }
  
        const { data, error } = await supabase
          .from("accounts")
          .select("balance, title")
          .eq("uid", session.user.id)
          .eq("account_name", 'cash')
          .limit(1)
          .single();
  
        if (error || !data) {
          console.error("Error fetching cash amount:", error);
          setCashAmount(null);
        } else {
          setCashAmount(data.balance);
          setCashTitle(data.title);
        }
  
        setLoading(false);
      };
  
      fetchCashAmount();
    }, []);

    const [showCashPopup, setShowCashPopup] = useState(false);
          
            // PASO 3: Crear función para abrir el popup
            const handleCashPress = () => {
              if (!loading && cashAmount !== null) {
                setShowCashPopup(true);
              }
            };
          
            const handleClosePopup = () => {
              setShowCashPopup(false);
            };
          
            const handleCashUpdated = (newSavings: number) => {
              setCashAmount(newSavings);
            };
  
    return(
        <View>
            <TouchableOpacity 
                style={[styles.button, styles.buttonSpacing]}
                onPress={handleCashPress}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>
                  <FontAwesome5 name="money-bill-wave" size={18} color={'#FFB324'} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.buttonTitle}>Cash</Text>
                    <Text style={styles.buttonAmount}>
                      {loading || cashAmount === null ? 'Loading...' : `$${cashAmount.toLocaleString()}`}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
            <CashPopup
              visible={showCashPopup}
              onClose={handleClosePopup}
              currentCash={cashAmount}
              currentTitle={cashTitle}
              onCashUpdated={handleCashUpdated}
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
    backgroundColor: '#FFCA6680',
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