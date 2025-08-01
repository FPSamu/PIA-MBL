import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts, Inter_600SemiBold, Inter_500Medium, Inter_400Regular } from '@expo-google-fonts/inter';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

type MessageCategory = 'excessive_expenses' | 'recurrent_expenses' | 'saving_opportunities';

interface RecommendationsProps {
  title: string;
  description: string;
  category: MessageCategory;
  onHelpfulPress?: () => void;
  onNotForMePress?: () => void;
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
};

export default function Recommendations({ 
  title, 
  description, 
  category, 
  onHelpfulPress, 
  onNotForMePress 
}: RecommendationsProps) {
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_500Medium,
    Inter_400Regular,
  });

  if (!fontsLoaded) return null;

  const categoryStyle = CATEGORY_STYLES[category];

  return (
    <View>
      <Text style={styles.sectionTitle}>New Recommendation</Text>
      <View style={styles.container}>
        {/* Header con icono y título */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: categoryStyle.circleColor }]}>
            {categoryStyle.icon(categoryStyle.iconColor)}
          </View>
          <Text style={[styles.title, { color: categoryStyle.titleColor }]}>{title}</Text>
        </View>

        {/* Descripción */}
        <Text style={styles.description}>{description}</Text>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.helpfulButton]} 
            onPress={onHelpfulPress}
            activeOpacity={0.7}
          >
            <MaterialIcons name="thumb-up" size={16} color="#06BF8B" />
            <Text style={styles.helpfulButtonText}>Helpful</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.notForMeButton]} 
            onPress={onNotForMePress}
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
    color: 'red'
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
});

// Ejemplo de uso:
/*
// Gastos excesivos
<Recommendations
  title="High dining expenses detected"
  description="You've spent $450 on restaurants this month, which is 80% above your usual average. Consider cooking at home more often."
  category="excessive_expenses"
  onHelpfulPress={() => console.log('Helpful pressed')}
  onNotForMePress={() => console.log('Not for me pressed')}
/>

// Gastos recurrentes
<Recommendations
  title="Monthly subscriptions review"
  description="You have 8 active subscriptions totaling $127/month. Consider canceling unused services like that gym membership you haven't used in 3 months."
  category="recurrent_expenses"
  onHelpfulPress={() => console.log('Helpful pressed')}
  onNotForMePress={() => console.log('Not for me pressed')}
/>

// Oportunidades de ahorro
<Recommendations
  title="Increase your savings potential"
  description="Based on your income and expenses, you could save an additional $200 monthly by setting up an automatic transfer to your savings account."
  category="saving_opportunities"
  onHelpfulPress={() => console.log('Helpful pressed')}
  onNotForMePress={() => console.log('Not for me pressed')}
/>
*/