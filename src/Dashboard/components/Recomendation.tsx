import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts, Inter_600SemiBold, Inter_500Medium, Inter_400Regular } from '@expo-google-fonts/inter';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../../onboarding/services/supabaseClient';
import { ensureValidSession } from '../../services/session';

type MessageCategory = 'excessive_expenses' | 'recurrent_expenses' | 'saving_opportunities' | 'no_transactions';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  type: MessageCategory;
  useful: boolean | null;
}

const CATEGORY_STYLES = {
  excessive_expenses: {
    iconColor: '#FC3838',
    circleColor: '#FF8A8A80',
    titleColor: '#FC3838',
    icon: (color: string) => <MaterialIcons name="trending-up" size={24} color={color} />,
  },
  recurrent_expenses: {
    iconColor: '#FFB324',
    circleColor: '#FFCA6680',
    titleColor: '#FFB324',
    icon: (color: string) => <MaterialIcons name="repeat" size={24} color={color} />,
  },
  saving_opportunities: {
    iconColor: '#06BF8B',
    circleColor: '#66D9B880',
    titleColor: '#06BF8B',
    icon: (color: string) => <MaterialIcons name="savings" size={24} color={color} />,
  },
  no_transactions: {
    iconColor: '#6366F1',
    circleColor: '#A5B4FC80',
    titleColor: '#6366F1',
    icon: (color: string) => <MaterialIcons name="receipt-long" size={24} color={color} />,
  },
};

export default function Recommendations() {
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_500Medium,
    Inter_400Regular,
  });

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendation();
  }, []);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const session = await ensureValidSession();
      if (!session?.user?.id) {
        setError('No se pudo verificar la sesión');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('recommendations')
        .select('*')
        .eq('uid', session.user.id)
        .is('useful', null)
        .limit(1)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No hay recomendaciones pendientes
          setRecommendation(null);
        } else {
          console.error('Error fetching recommendation:', fetchError);
          setError('Error al cargar la recomendación');
        }
      } else {
        setRecommendation(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('Error inesperado al cargar la recomendación');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (isUseful: boolean) => {
    if (!recommendation) return;

    try {
      const session = await ensureValidSession();
      const { error: updateError } = await supabase
        .from('recommendations')
        .update({ useful: isUseful })
        .eq('uid', session.user.id)
        .is('useful', null);

      if (updateError) {
        console.error('Error updating recommendation:', updateError);
        setError('Error al actualizar la recomendación');
        return;
      }

      fetchRecommendation();
    } catch (error) {
      console.error('Unexpected error updating recommendation:', error);
      setError('Error inesperado al actualizar');
    }
  };

  const handleHelpfulPress = () => {
    handleFeedback(true);
  };

  const handleNotForMePress = () => {
    handleFeedback(false);
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View>
        <Text style={styles.sectionTitle}>New Recommendation</Text>
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading recommendation...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text style={styles.sectionTitle}>New Recommendation</Text>
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={24} color="#FC3838" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={fetchRecommendation}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (!recommendation) {
    return (
      <View>
        <Text style={styles.sectionTitle}>New Recommendation</Text>
        <View style={styles.container}>
          <View style={styles.noRecommendationContainer}>
            <MaterialIcons name="check-circle" size={48} color="#06BF8B" />
            <Text style={styles.noRecommendationTitle}>All caught up!</Text>
            <Text style={styles.noRecommendationText}>
              No new recommendations at the moment. Keep using the app and we'll provide more insights.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const categoryStyle = CATEGORY_STYLES[recommendation.type];

  return (
    <View>
      <Text style={styles.sectionTitle}>New Recommendation</Text>
      <View style={styles.container}>
        {/* Header con icono y título */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: categoryStyle.circleColor }]}>
            {categoryStyle.icon(categoryStyle.iconColor)}
          </View>
          <Text style={[styles.title, { color: categoryStyle.titleColor }]}>
            {recommendation.title}
          </Text>
        </View>

        {/* Descripción */}
        <Text style={styles.description}>{recommendation.description}</Text>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.helpfulButton]} 
            onPress={handleHelpfulPress}
            activeOpacity={0.7}
          >
            <MaterialIcons name="thumb-up" size={16} color="#06BF8B" />
            <Text style={styles.helpfulButtonText}>Helpful</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.notForMeButton]} 
            onPress={handleNotForMePress}
            activeOpacity={0.7}
          >
            <MaterialIcons name="thumb-down" size={16} color="#757575" />
            <Text style={styles.notForMeButtonText}>Not for me</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 24, 
    paddingHorizontal: 24,
    fontSize: 26,
    fontWeight: 600,
    fontFamily: 'Inter_600SemiBold',
    color: '#1c1c1c'
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    marginHorizontal: 24,
    shadowColor: '#D4D4D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 180,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 22,
  },
  description: {
    color: '#757575',
    fontFamily: 'Inter_400Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E7',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  helpfulButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  notForMeButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  helpfulButtonText: {
    color: '#06BF8B',
    fontFamily: 'Inter_500Medium',
    fontWeight: '500',
    fontSize: 14,
  },
  notForMeButtonText: {
    color: '#757575',
    fontFamily: 'Inter_500Medium',
    fontWeight: '500',
    fontSize: 14,
  },
  
  // Estilos para estados de carga y error
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  loadingText: {
    color: '#757575',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  errorText: {
    color: '#FC3838',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#06BF8B',
    fontFamily: 'Inter_500Medium',
    fontWeight: '500',
    fontSize: 14,
  },
  noRecommendationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
    paddingVertical: 16,
  },
  noRecommendationTitle: {
    color: '#1c1c1c',
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    fontSize: 18,
    marginTop: 12,
    marginBottom: 8,
  },
  noRecommendationText: {
    color: '#757575',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});