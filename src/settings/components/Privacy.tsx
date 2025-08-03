import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Linking, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Privacy() {
    const [modalVisible, setModalVisible] = useState(false);

    const handlePrivacyPress = () => {
        setModalVisible(true);
    };

    const handleOptionPress = async (url, title) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', `No se puede abrir el enlace: ${url}`);
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al intentar abrir el enlace');
        }
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity 
                style={[styles.button, styles.buttonSpacing]}
                onPress={handlePrivacyPress}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="lock-closed" size={20} color="#666" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.buttonTitle}>Privacy</Text>
                    <Text style={styles.buttonSubtitle}>Terms & Conditions</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            {/* Modal con las opciones */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Privacy & Terms</Text>
                            <TouchableOpacity 
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={styles.modalOption}
                            onPress={() => handleOptionPress('https://piaassistant.com/privacy-policy.html', 'Privacy Policy')}
                        >
                            <View style={styles.optionIconContainer}>
                                <Ionicons name="shield-checkmark" size={24} color="#4A90E2" />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Privacy Policy</Text>
                                <Text style={styles.optionSubtitle}>Cómo protegemos tu información</Text>
                            </View>
                            <Ionicons name="open-outline" size={20} color="#ccc" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.modalOption}
                            onPress={() => handleOptionPress('https://piaassistant.com/terms.html', 'Terms and Conditions')}
                        >
                            <View style={styles.optionIconContainer}>
                                <Ionicons name="document-text" size={24} color="#4A90E2" />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Terms and Conditions</Text>
                                <Text style={styles.optionSubtitle}>Términos de uso del servicio</Text>
                            </View>
                            <Ionicons name="open-outline" size={20} color="#ccc" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    backgroundColor: '#f8f9fa',
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
  modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginBottom: 10,
        backgroundColor: '#f8f9fa',
    },
    optionIconContainer: {
        marginRight: 15,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    optionSubtitle: {
        fontSize: 14,
        color: '#666',
    },
});