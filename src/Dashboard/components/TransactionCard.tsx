import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts, Inter_600SemiBold, Inter_400Regular } from '@expo-google-fonts/inter';
import { MaterialCommunityIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';

const CATEGORY_CONFIG = {
  Groceries: {
    icon: (color: string) => <MaterialCommunityIcons name="food-apple" size={28} color={color} />,
    circle: 'rgba(76, 175, 80, 0.5)',
    iconColor: '#388E3C',
  },
  Restaurant: {
    icon: (color: string) => <MaterialCommunityIcons name="silverware-fork-knife" size={28} color={color} />,
    circle: 'rgba(255, 152, 0, 0.5)',
    iconColor: '#FF9800',
  },
  Transport: {
    icon: (color: string) => <FontAwesome5 name="bus" size={26} color={color} />,
    circle: 'rgba(33, 150, 243, 0.5)',
    iconColor: '#1976D2',
  },
  House: {
    icon: (color: string) => <Ionicons name="home" size={28} color={color} />,
    circle: 'rgba(156, 39, 176, 0.5)',
    iconColor: '#7C4DFF',
  },
  Shopping: {
    icon: (color: string) => <Feather name="shopping-bag" size={26} color={color} />,
    circle: 'rgba(255, 87, 34, 0.5)',
    iconColor: '#FF5722',
  },
  Gas: {
    icon: (color: string) => <MaterialCommunityIcons name="gas-station" size={28} color={color} />,
    circle: 'rgba(255, 235, 59, 0.5)',
    iconColor: '#FBC02D',
  },
  Income: {
    icon: (color: string) => <Feather name="dollar-sign" size={28} color={color} />,
    circle: 'rgba(0, 179, 131, 0.5)',
    iconColor: '#00B383',
  },
};

interface TransactionCardProps {
  title: string;
  account: string;
  category: string;
  date: string;
  amount: string | number;
  type: 'income' | 'outcome';
}

const TransactionCard: React.FC<TransactionCardProps> = ({ title, account, category, date, amount, type }) => {
  // Load Inter fonts
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Helper to format date as 'Mon, 5th June'
  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = days[d.getDay()];
    const dateNum = d.getDate();
    const month = months[d.getMonth()];
    // Suffix for day
    const j = dateNum % 10, k = dateNum % 100;
    let suffix = 'th';
    if (j === 1 && k !== 11) suffix = 'st';
    else if (j === 2 && k !== 12) suffix = 'nd';
    else if (j === 3 && k !== 13) suffix = 'rd';
    return `${day}, ${dateNum}${suffix} ${month}`;
  }

  const config = CATEGORY_CONFIG[category] || {
    icon: (color: string) => <Feather name="help-circle" size={28} color={color} />,
    circle: '#E0E0E0',
    iconColor: '#757575',
  };

  const amountColor = type === 'income' ? '#00B383' : '#E53935';

  return (
    <View style={styles.cardRow}>
      <View style={[styles.iconCircle, { backgroundColor: config.circle }]}> 
        {config.icon(config.iconColor)}
      </View>
      <View style={styles.flexContent}>
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
          <View style={styles.row}>
            <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">{account}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">{category}</Text>
          </View>
          <Text style={styles.date}>{formatDate(date)}</Text>
        </View>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: amountColor }]} numberOfLines={1} ellipsizeMode="tail">{amount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 18,
    marginVertical: 8,
    marginHorizontal: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    flexShrink: 0,
  },
  flexContent: {
    flex: 1,
    minWidth: 0,
  },
  cardContent: {
    flexShrink: 1,
    flexGrow: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 18,
    color: '#1C1C1E',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  meta: {
    fontSize: 14,
    color: '#757575',
    fontFamily: 'Inter_400Regular',
    flexShrink: 1,
    flexWrap: 'wrap',
    minWidth: 0,
  },
  dot: {
    fontSize: 14,
    color: '#757575',
    marginHorizontal: 6,
    fontFamily: 'Inter_400Regular',
  },
  date: {
    fontSize: 13,
    color: '#757575',
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  amountContainer: {
    minWidth: 70,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 12,
    flexShrink: 0,
  },
  amount: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default TransactionCard;
