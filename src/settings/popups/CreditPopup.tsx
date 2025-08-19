import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { supabase } from "../../onboarding/services/supabaseClient";
import { ensureValidSession } from "../../services/session";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";

interface CreditPopupProps {
    visible: boolean;
    onClose: () => void;
    currentCredit: number | null;
    currentTitle: string | null;
    onCashUpdated: (newCash: number, newTitle: string) => void;
}

export default function CreditPopup({
    visible,
    onClose,
    currentCredit,
    currentTitle,
    onCashUpdated,
}: CreditPopupProps) {
    const [newCreditAmount, setNewCreditAmount] = useState<string>(
        currentCredit ? currentCredit.toString() : ""
    );
    const [newAccountTitle, setNewAccountTitle] = useState<string>(
        currentTitle || ""
    );
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
    if (visible) {
        setNewCreditAmount(currentCredit ? currentCredit.toString() : "");
        setNewAccountTitle(currentTitle || "");
    }
}, [visible, currentCredit, currentTitle]);

    const handleUpdateCash = async () => {
        const creditValue = parseFloat(newCreditAmount);

        if (isNaN(creditValue)) {
            Alert.alert("Invalid Amount", "Please enter a valid credit amount");
            return;
        }

        if (!newAccountTitle.trim()) {
            Alert.alert("Invalid Name", "Please enter a valid account name");
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
                .from("accounts")
                .update({
                    balance: creditValue,
                    title: newAccountTitle.trim()
                })
                .eq("uid", session.user.id)
                .eq("account_name", "cash");

            if (error) {
                console.error("Error updating credit:", error);
                Alert.alert("Error", "Failed to update credit information");
            } else {
                onCashUpdated(creditValue, newAccountTitle.trim());
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
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.popup}>
                    <View style={styles.header}>
                        <View style={styles.iconHeader}>
                            <Ionicons name="card" size={20} color="#FC3838" />
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <Text style={styles.title}>Credit Account</Text>
                        <Text style={styles.subtitle}>Update your credit account information</Text>

                        {(currentCredit !== null || currentTitle) && (
                            <View style={styles.currentInfoContainer}>
                                <Text style={styles.currentInfoTitle}>Current Information</Text>
                                {currentTitle && (
                                    <View style={styles.currentInfoRow}>
                                        <Text style={styles.currentInfoLabel}>Account Name:</Text>
                                        <Text style={styles.currentInfoValue}>{currentTitle}</Text>
                                    </View>
                                )}
                                {currentCredit !== null && (
                                    <View style={styles.currentInfoRow}>
                                        <Text style={styles.currentInfoLabel}>Balance:</Text>
                                        <Text style={styles.currentInfoValue}>
                                            ${currentCredit.toLocaleString()}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Account Name</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="create-outline" size={18} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={newAccountTitle}
                                    onChangeText={setNewAccountTitle}
                                    placeholder="Enter account name"
                                    returnKeyType="next"
                                    maxLength={50}
                                />
                            </View>
                        </View>

                        {/* Amount Input */}
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Credit Amount</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.dollarSign}>$</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newCreditAmount}
                                    onChangeText={(text) =>
                                        setNewCreditAmount(formatCurrency(text))
                                    }
                                    placeholder="0.00"
                                    keyboardType="decimal-pad"
                                    returnKeyType="done"
                                />
                            </View>
                        </View>

                        {/* Preview */}
                        {(newCreditAmount && !isNaN(parseFloat(newCreditAmount))) || newAccountTitle.trim() ? (
                            <View style={styles.previewContainer}>
                                <Text style={styles.previewLabel}>Preview Changes</Text>
                                {newAccountTitle.trim() && (
                                    <View style={styles.previewRow}>
                                        <Text style={styles.previewFieldLabel}>Name:</Text>
                                        <Text style={styles.previewFieldValue}>{newAccountTitle.trim()}</Text>
                                    </View>
                                )}
                                {newCreditAmount && !isNaN(parseFloat(newCreditAmount)) && (
                                    <View style={styles.previewRow}>
                                        <Text style={styles.previewFieldLabel}>Amount:</Text>
                                        <Text style={styles.previewAmount}>
                                            ${parseFloat(newCreditAmount).toLocaleString()}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ) : null}
                    </View>
                    </ScrollView>

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
                            onPress={handleUpdateCash}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={styles.updateButtonText}>Update Account</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
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
        flex: 0,
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
        backgroundColor: "#ff8a8a5e",
        justifyContent: "center",
        alignItems: "center",
    },
    closeButton: {
        padding: 8,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        // flex: 1
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
    currentInfoContainer: {
        backgroundColor: "#F8F9FA",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    currentInfoTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 12,
    },
    currentInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    currentInfoLabel: {
        fontSize: 14,
        color: "#666",
    },
    currentInfoValue: {
        fontSize: 14,
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
    inputIcon: {
        marginRight: 12,
    },
    dollarSign: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
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
        marginBottom: 12,
        fontWeight: "600",
    },
    previewRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    previewFieldLabel: {
        fontSize: 14,
        color: "#06BF8B",
        fontWeight: "500",
    },
    previewFieldValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#06BF8B",
    },
    previewAmount: {
        fontSize: 16,
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