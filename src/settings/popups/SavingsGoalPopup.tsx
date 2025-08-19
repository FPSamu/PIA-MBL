import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../onboarding/services/supabaseClient";
import { ensureValidSession } from "../../services/session";

interface SavingsGoalPopupProps {
  visible: boolean;
  onClose: () => void;
  currentGoal: number | null;
  onGoalUpdated: (newGoal: number) => void;
}

export default function SavingsGoalPopup({
  visible,
  onClose,
  currentGoal,
  onGoalUpdated,
}: SavingsGoalPopupProps) {
  const [newGoalAmount, setNewGoalAmount] = useState<string>(
    currentGoal ? currentGoal.toString() : ""
  );
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (visible) {  
      setNewGoalAmount(currentGoal ? currentGoal.toString() : "");
    }
  }, [visible, currentGoal]);

  const handleUpdateGoal = async () => {
    const goalValue = parseFloat(newGoalAmount);
    
    if (isNaN(goalValue) || goalValue <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid goal amount");
      return;
    }

    setIsUpdating(true);

    try {
      const session = await ensureValidSession();
      if (!session?.user?.id) {
        Alert.alert("Error", "Please log in again");
        setIsUpdating(false);
        return;
      }

      const { error } = await supabase
        .from("savings_info")
        .update({ goal_amount: goalValue })
        .eq("uid", session.user.id);

      if (error) {
        console.error("Error updating goal:", error);
        Alert.alert("Error", "Failed to update savings goal");
      } else {
        onGoalUpdated(goalValue);
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Something went wrong");
    }

    setIsUpdating(false);
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    return numericValue;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.header}>
            <View style={styles.iconHeader}>
              <Ionicons name="flag" size={24} color="#06BF8B" />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Savings Goal</Text>
            <Text style={styles.subtitle}>
              Set your target savings amount to help track your progress
            </Text>

            {currentGoal && (
              <View style={styles.currentGoalContainer}>
                <Text style={styles.currentGoalLabel}>Current Goal</Text>
                <Text style={styles.currentGoalAmount}>
                  ${currentGoal.toLocaleString()}
                </Text>
              </View>
            )}

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>New Goal Amount</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.input}
                  value={newGoalAmount}
                  onChangeText={(text) => setNewGoalAmount(formatCurrency(text))}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
              </View>
            </View>

            {newGoalAmount && !isNaN(parseFloat(newGoalAmount)) && (
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>New Goal Preview</Text>
                <Text style={styles.previewAmount}>
                  ${parseFloat(newGoalAmount).toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isUpdating}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.updateButton,
                isUpdating && styles.updateButtonDisabled,
              ]}
              onPress={handleUpdateGoal}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.updateButtonText}>Update Goal</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  iconHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F8F5",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1c1c1c",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    lineHeight: 22,
  },
  currentGoalContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  currentGoalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  currentGoalAmount: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1c1c1c",
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1c",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  dollarSign: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1c1c1c",
    paddingVertical: 16,
  },
  previewContainer: {
    backgroundColor: "#E8F8F5",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#06BF8B",
  },
  previewLabel: {
    fontSize: 14,
    color: "#06BF8B",
    marginBottom: 4,
    fontWeight: "500",
  },
  previewAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#06BF8B",
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  updateButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#06BF8B",
    alignItems: "center",
  },
  updateButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});