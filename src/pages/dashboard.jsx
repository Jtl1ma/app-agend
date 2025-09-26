import {useContext, useEffect,} from 'react';
//import { AuthContext } from "../context/authContext";
import { Dimensions, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { TrendingUp, User, Bell, BarChart2, CreditCard, Home, Settings } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import StatsCard from "../components/cards/statsCard";
import TransactionItem from "../components/cards/transactionCard";
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/button/button';
import { AppointmentsContext } from '../context/appointmentsContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

//import DateTimePicker from '@react-native-community/datetimepicker';



// Dashboard Principal
export default function Dashboard({ navigation }) {

    const { appointments } = useContext(AppointmentsContext);

    //const somaValor = ()=>{
      let datas = [];
        appointments.forEach(itens=> {itens.valor; datas.push(itens.valor)}); 
          
         // Converter para números e somar
          const soma = datas.reduce((total, valor) => total + parseFloat(valor), 0);
          //console.log(soma.toFixed(2));
      //    return soma;
    //}
/*useEffect(() => {
  somaValor();
}, []);*/
   
const getStatusColor = (status) => {
    switch(status) {
      case 'confirmado': return 'green';
      case 'concluido': return 'blue';
      case 'cancelado': return 'red';
      default: return 'orange'; // Pendente
    }
  };
  const upcomingAppointments = appointments.slice(0, 5);
  const upAppointments = appointments.slice(0, 1);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Dashboard</Text>
          <Text style={styles.subTitle}>Bem-vindo ao painel de controle!</Text>
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

        <TouchableOpacity onPress={() => navigation.navigate('Agendar')}>

      <View style={styles.containerButton}>
          <Button title="Agendar Novo Cliente" 
          onPress={() => navigation.navigate('Agendar')} />
          <Ionicons name="add-circle-outline" size={18} color="white" />
      </View>
         </TouchableOpacity>
      
      {/* Conteúdo Principal */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cartões de Estatísticas */}
          
         {/* {appointments.map(item=> (*/}
         {upAppointments.map(item => (

        <View key={item.id ?? index} style={styles.statsContainer}>
            {/*Para mostrar os agendamentos do final de semana
            preciso criar um componente que vai ser renderizado aqui por
            um filtro (data_inicial, data_final) e pegar os agendamentos
            do final de semana. Vindo backend.
    ----------------------//-------------------------        
        <StatsCard
            title="Agendamentos do final de semana"
            value={item[0] ? item[0].length : 0}
            icon={TrendingUp}
            color="purple"
            trend="Serviços do final de semana"
          />*/}
          <StatsCard
            title="Agendamentos do final de semana"
            value={item[0] ? item[0].length : 0}
            icon={TrendingUp}
            color="purple"
            trend="Serviços do final de semana"
          />

          <StatsCard 
          title="Agendamentos do mês" 
          value={appointments.length} 
          icon={CreditCard} 
          color="blue" 
          trend="+12% referente ao mês passado" 
          />
        
          <StatsCard 
          title="Total de Clientes" 
          value={appointments.length} 
          icon={TrendingUp} 
          color="green" 
          trend={`${appointments.length}% referente ao mês passado`} 
          />
          <StatsCard 
          title="Receita total" 
          value={`R$ ${soma.toFixed(2)}`} 
          icon={BarChart2} 
          color="orange" 
          trend="Serviços concluídos" 
          />
          
        </View>  
          ))}
         

        {/* Agendamentos do final de semana */}
         
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Agendamentos final de semana.</Text>
            <Text style={styles.detailText}>Total: ({ appointments.length}) 
            </Text>
            {appointments.length === 0 ? (
                      <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>Nenhum agendamento por enquanto!</Text>
                        <Text style={styles.emptySubtext}>Toque no botão para agendar</Text>
                      </View>
                    ) : (
                     appointments.map(app => (
                          
                      <View key={app.id} style={styles.appointmentItem}>
                          
                   <TouchableOpacity onPress={()=> navigation.navigate('serviceAppointment')}>

                          <Text style={styles.appointmentText}>Cliente: {app.client}</Text>
                          <Text style={styles.appointmentText}>Contato: {app.contato}</Text>
                          <Text style={styles.appointmentText}>Tema: {app.tema}</Text>
                          <Text style={styles.appointmentDate}>
                            {format(new Date(app.data_evento), "PPPP", { locale: ptBR })} 
                          </Text>
                          <Text style={styles.appointmentText}>Local: {app.local_evento}</Text>
                          <Text style={[styles.appointmentStatus, { color: getStatusColor(app.status) }]}>
                          {app && app.status ? app.status : 'Sem status' || 'pendente' || 'confirmado' || 'concluido' ||'cancelado'}
                          </Text>
                    </TouchableOpacity>
                        </View>
                      ))
                    )}
                    
          </View>
        
        {/* Transações Recentes */}
        <View style={styles.transactionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Agendamentos</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Agendamentos')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {/* Lista de Transações monstra apenas os 3 primeiros agendamentos */}

          <View style={styles.transactionsList}>
            
          {upcomingAppointments.map(app => (    
            
            <TransactionItem
              type="exponse"
              title={app?.client}
              date={app?.data_evento ? format(new Date(app.data_evento), "PPPP", { locale: ptBR }) : ""}
              amount={app?.valor}
              category={app?.tema}
            />
          ))}

            {/*<TransactionItem
              type="income"
              title={appointments[0].client}
              date={format(new Date(appointments[0].data_evento), "PPPP", { locale: ptBR })}
              amount={appointments[0].status}
              category={appointments[0].tema}
            />
            <TransactionItem
              type="expense"
              title={appointments[0].client}
              date={format(new Date(appointments[0].data_evento), "PPPP", { locale: ptBR })}
              amount={appointments[0].status}
              category={appointments[0].tema}
            />
            <TransactionItem
              type="expense"
              title={appointments[0].client}
              date={format(new Date(appointments[0].data_evento), "PPPP", { locale: ptBR })}
              amount={appointments[0].status}
              category={appointments[0].tema}
            />*/}
          </View>
        
        </View>
        {/* Gráfico de Linhas */}
        {/*<View>
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


        </View>*/}

      </ScrollView>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    //paddingHorizontal: 24,
    marginHorizontal: 24,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAll: {
    borderBottomWidth: 1,
    borderBottomColor: "#007AFF",

    color: "#007AFF",
    fontWeight: "500",
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    
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
  card: {
    
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 24,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    paddingBottom: 24,
    textAlign: 'center',
    fontSize: 18,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 2,
   // marginTop: 0,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    fontSize: 16,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 5,
  },
  appointmentItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  appointmentDate: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  appointmentText: {
    color: '#666',
    marginTop: 3,
  },
  appointmentStatus: {
    color: '#6200ee',
    marginTop: 5,
    fontWeight: '500',
  },
  seeAllButton: {
   // marginTop: 2,
    padding: 14,
    
  },
  seeAllText: {
    color: '#6200ee',
    textAlign: 'right',
    fontWeight: '500',
  },
  seAllButton: {
    flexDirection: 'row',
  },
  seaAllButton: {
padding: 5,
  },
  icon: {
    marginRight: 5,
  },
  clearButton: {
    marginLeft: 5,
  },
});