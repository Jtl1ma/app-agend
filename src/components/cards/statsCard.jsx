//import React from "react";
import { colorVariants } from "../../consts/colors";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUp } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
//import { Dimensions } from "react-native";


// Componente StatsCard (que transformamos anteriormente)
const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
  const colors = colorVariants[color] || colorVariants.blue; // valor padrão

  return (
    <View style={[styles.statCard, styles.shadow]}>
      <LinearGradient
        colors={colors.bg}
        style={[styles.gradientCircle, { opacity: 0.1 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View style={styles.cardHeader}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
          <View style={[styles.iconContainer, { backgroundColor: colors.accent }]}>
            <Icon color={colors.icon} size={24} />
          </View>
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <TrendingUp color="#4CD964" size={16} />
            <Text style={[styles.trendText, { color: colors.text }]}>{trend}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    borderWidth: 0,
    padding: 16,
    backdropFilter: "blur(10px)",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  gradientCircle: {
    position: "absolute",
    top: -32,
    right: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  cardHeader: {
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  value: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 8,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  trendText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
    
});
export default StatsCard;