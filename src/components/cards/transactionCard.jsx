import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { 
  TrendingUp, 
  User, 
  Bell, 
  BarChart2, 
  CreditCard, 
  Home, 
  Settings, 
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal
} from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";



// Componente TransactionItem
const TransactionItem = ({ type, title, date, amount, category }) => {
  return (
    <View style={styles.transactionItem}>
      <View style={[
        styles.transactionIcon, 
        { backgroundColor: type === 'income' ? '#E6F7EE' : '#FFEBEE' }
      ]}>
        {type === 'income' ? (
          <ArrowDownLeft color="#4CD964" size={16} />
        ) : (
          <ArrowUpRight color="#FF3B30" size={16} />
        )}
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{title}</Text>
        <Text style={styles.transactionDate}>{date} • {category}</Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text style={[
          styles.transactionAmount,
          { color: type === 'income' ? '#4CD964' : '#FF3B30' }
        ]}>
          {type === 'income' ? '+' : '-'}${amount}
        </Text>
        <MoreHorizontal color="#94A3B8" size={16} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  

  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E293B",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
  transactionAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "500",
  },
});
export default TransactionItem;