import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal, Alert } from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { supabase } from "../../onboarding/services/supabaseClient";
import { ensureValidSession, removeSession } from "../../services/session";

export default function AccountSettings({ onLogout }) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleSettingsPress = () => {
    setShowSettingsModal(true);
  };

  const handleCloseModal = () => {
    setShowSettingsModal(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Iniciando proceso de logout...");
              
              // Cerrar el modal primero
              setShowSettingsModal(false);
              
              // Ejecutar removeSession
              console.log("Llamando removeSession...");
              await removeSession();
              console.log("removeSession completado");
              
              // Llamar callback si existe (esto debería navegar al login)
              if (onLogout) {
                console.log("Llamando callback onLogout...");
                onLogout();
              } else {
                console.log("No se proporcionó callback onLogout");
              }
              
              console.log("Logout completado exitosamente");
              
            } catch (error) {
              console.error("Error durante logout:", error);
              Alert.alert("Error", `Ocurrió un error al cerrar sesión: ${error.message}`);
              
              // Intentar logout alternativo con supabase directamente
              try {
                console.log("Intentando logout alternativo...");
                const { error: supabaseError } = await supabase.auth.signOut();
                if (supabaseError) {
                  console.error("Error en logout alternativo:", supabaseError);
                } else {
                  console.log("Logout alternativo exitoso");
                  if (onLogout) {
                    onLogout();
                  } else {
                    console.log("No se proporcionó callback para logout alternativo");
                  }
                }
              } catch (altError) {
                console.error("Error en logout alternativo:", altError);
              }
            }
          }
        }
      ]
    );
  };

  return (
    <View>
      <TouchableOpacity 
        style={[styles.button, styles.buttonSpacing]}
        onPress={handleSettingsPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="settings" size={20} color="#666" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>Account Settings</Text>
          <Text style={styles.buttonSubtitle}>Manage your account</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>

      {/* Modal con las opciones */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettingsModal}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Account Settings</Text>
              <TouchableOpacity 
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={handleLogout}
            >
              <View style={[styles.optionIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="log-out-outline" size={22} color="#FF9800" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Cerrar Sesión</Text>
                <Text style={styles.optionSubtitle}>Salir de tu cuenta</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>

            {/* <TouchableOpacity 
              style={[
                styles.modalOption,
                isDeleting && styles.disabledOption
              ]}
              onPress={handleDeleteAccount}
              disabled={isDeleting}
            >
              <View style={[styles.optionIconContainer, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="trash-outline" size={22} color="#F44336" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[
                  styles.optionTitle, 
                  { color: '#F44336' },
                  isDeleting && { opacity: 0.6 }
                ]}>
                  {isDeleting ? "Eliminando..." : "Eliminar Cuenta"}
                </Text>
                <Text style={styles.optionSubtitle}>Eliminar permanentemente</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity> */}
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
    marginTop: 12,
  },
  buttonSpacing: {
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
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
  buttonSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  
  // Estilos del modal
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
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  disabledOption: {
    opacity: 0.6,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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