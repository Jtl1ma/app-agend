import {useContext} from 'react';
import { AuthContext } from "../context/authContext";
import { Dimensions, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { TrendingUp, User, Bell, BarChart2, CreditCard, Home, Settings } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import StatsCard from "../components/cards/statsCard";
import TransactionItem from "../components/cards/transactionCard";
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/button/button';
import { AppointmentsContext } from '../context/appointmentsContext';



// Dashboard Principal
export default function Dashboard({ navigation }) {
    const { user } = useContext(AuthContext);
    const { appointments } = useContext(AppointmentsContext);



  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Dashboard</Text>
          <Text style={styles.subTitle}>Bem-vindo ao seu painel de controle</Text>
        </View>

        {/* Icon header */}
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell color="#1E293B" size={24} />
          </TouchableOpacity>
          
          <View>
          <TouchableOpacity style={styles.profileButton}
           onPress={() => navigation.navigate('Perfil')}>
            <User color="#FFF" size={24} />
          </TouchableOpacity>
          </View>

        </View>

      </View>
<View style={styles.containerButton}>
          <Button title="Agendar Novo Cliente" 
          onPress={() => navigation.navigate('Agendar')} />
          <Ionicons name="add-circle-outline" size={18} color="white" />
        </View>
      
      {/* Conteúdo Principal */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cartões de Estatísticas */}
        <View style={styles.statsContainer}>
          <StatsCard 
            title="Agendamentos do mês" 
            value="56" 
            icon={CreditCard} 
            color="blue" 
            trend="+12% referente ao mês passado" 
          />
          <StatsCard 
            title="Novos Clientes" 
            value="45" 
            icon={TrendingUp} 
            color="green" 
            trend="+8% from last month" 
          />
          <StatsCard 
            title="Receita total" 
            value="R$7.640,50" 
            icon={BarChart2} 
            color="orange" 
            trend="+3% from last month" 
          />
        </View>

        {/* Gráfico */}
        <View style={[styles.chartContainer, styles.shadow]}>
          <Text style={styles.sectionTitle}>Visão geral mensal</Text>
          <LineChart
            data={{
              labels: [
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100
                  ]
                }
              ]
            }}
            width={Dimensions.get("window").width - 52} // Ajusta a largura do gráfico
            height={230}
            chartConfig={{
              backgroundColor: "#FFF",
              backgroundGradientFrom: "#FFF",
              backgroundGradientTo: "#FFF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#007AFF"
              }
            }}
            bezier
            style={{
              marginVertical: 2,
              borderRadius: 16
            }}
          />
        </View>

        {/* Transações Recentes */}
        <View style={styles.transactionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agendamentos recentes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionsList}>
            <TransactionItem
              type="exponse"
              title="name client"
              date="Today"
              amount="confirmed"
              category="tema"
            />
            <TransactionItem
              type="income"
              title="Salary"
              date="Yesterday"
              amount="3,500.00"
              category="Salary"
            />
            <TransactionItem
              type="expense"
              title="Dinner"
              date="Yesterday"
              amount="45.80"
              category="Food"
            />
            <TransactionItem
              type="expense"
              title="Netflix"
              date="Jun 15"
              amount="14.99"
              category="Entertainment"
            />
          </View>
        </View>
      </ScrollView>

      {/* Menu de Navegação */}
     {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Home color="#007AFF" size={24} />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <CreditCard color="#94A3B8" size={24} />
          <Text style={styles.navText}>Cards</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <BarChart2 color="#94A3B8" size={24} />
          <Text style={styles.navText}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Settings color="#94A3B8" size={24} />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>*/}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 10,
   // paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    //marginBottom: 54,
  },
  greeting: {
     fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    //fontSize: 16,
   // color: "#64748B",
  },
  subTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    /*fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 4,*/
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  scheduleButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 10,

  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 18,

  },
  containerButton: {
    marginBottom: 24,
    marginLeft: 24,
    padding: 12,
  },

  statsContainer: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
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
  chartContainer: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 6,
    marginHorizontal: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 16,
  },
  transactionsContainer: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAll: {
    color: "#007AFF",
    fontWeight: "500",
  },
  transactionsList: {
    gap: 12,
  },
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  navItem: {
    alignItems: "center",
    padding: 8,
  },
  navItemActive: {
    alignItems: "center",
    padding: 8,
  },
  navText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 12,
    color: "#007AFF",
    marginTop: 4,
    fontWeight: "500",
  },
});