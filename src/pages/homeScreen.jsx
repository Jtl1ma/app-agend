import React, { useContext, useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, TextInput, 
  ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppointmentsContext } from '../context/appointmentsContext';
import axios from "axios";



export default function HomeScreen({ navigation }) {
  const { appointments, setAppointments, filteredAppointments,
    setFilteredAppointments, loadingMore, isLoading, 
    refreshAppointments } = useContext(AppointmentsContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getAppoints = async() => {
    try {
      const response = await axios.get(`https://test-api.loca.lt/agendamentos/pag`);
      const { agendamentos } = response.data;
      setAppointments(agendamentos); 
    } catch (error) {
      if (error.response?.data.error) {
        Alert.alert('Erro: ' + error.response?.data.error);
        return;
      }
      Alert.alert('Erro ocorrido tente novamente mais tarde');
    }
  };
  useEffect(()=>{
    getAppoints();
  },[]);

  // Função para limpar o termo de pesquisa e os agendamentos filtrados
  const clearSearch = () => {
    setSearchTerm(''); // Limpa o termo de pesquisa
    setFilteredAppointments([]); // Limpa os agendamentos filtrados
  };
const handleSearch = (text) => {
  
  if (!text) {
    clearSearch(); // Limpa a pesquisa se o texto estiver vazio
      return;
  }
  // Filtra os agendamentos com base no termo de pesquisa
  
  const term = searchTerm.toLowerCase();
   const filtered = appointments.filter(item =>{
  return (
    item.client.toLowerCase().includes(term) ||
    item.tema.toLowerCase().includes(term) ||
    item.data_evento.toLowerCase().includes(term)) 
     });
     setFilteredAppointments(filtered);
     setSearchTerm(text);
  getAppoints(); // Recarrega os agendamentos filtrados
};

  const handleNewAppointment = () => {
    if (appointments.length >= 10) {
      Alert.alert(
        'Muitos agendamentos',
        'Você já tem muitos agendamentos. Deseja continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: navigation.navigate('Agendar') }
        ]
      );
    } else {
      navigation.navigate('Agendar');
    }
  };


 const renderAppointmentItem = ({ item }) => (

    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => navigation.navigate('serviceAppointment',{id: item.id, 
       client: item.client, contato: item.contato})}
    >
      <Text style={styles.itemTitle}>{item.tema}</Text>
      <Text style={styles.itemClient}>{item.client}</Text>
      <Text style={styles.itemDate}>
        {item.data_evento ? format(new Date(item.data_evento), "PPPPp", { locale: ptBR })
         : 'Data não informada'}
      </Text>
      <Text style={[styles.itemStatus, { color: getStatusColor(item.status) }]}>
        {item.status || 'pendente' || 'confirmado' || 'concluido' ||'cancelado'}
      </Text>
    </TouchableOpacity>
    
  );

const getStatusColor = (status) => {
    switch(status) {
      case 'confirmado': return 'green';
      case 'concluido': return 'blue';
      case 'cancelado': return 'red';
      default: return 'orange'; // Pendente
    }
  };

  if (isLoading && appointments.length === 0) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }
const upcomingAppointments = appointments.slice(0, 3);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={styles.container}
      refreshControl={<RefreshControl
          refreshing={isLoading}
          onRefresh={refreshAppointments}
      />}
    >
    {/*  <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subTitle}>Bem-vindo ao seu painel de controle!</Text>
*/}      

{ /* Card de agendamentos de Hoje */}

{ /* Card de agendamentos da semana */}


      <View style={styles.card}>
      <Text style={styles.cardTitle}>Agendamentos final de semana.</Text>
      <Text style={styles.detailText}>Total: ({ upcomingAppointments.length}) 
        {/*{upcomingAppointments[0]
       ? new Date(upcomingAppointments[0].data_evento).toLocaleDateString('pt-br', {
                   // weekday: 'short',
                   // day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) : ''}
*/}                </Text>
        
        {upcomingAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum agendamento por enquanto!</Text>
            <Text style={styles.emptySubtext}>Toque no botão para agendar</Text>
          </View>
        ) : (
         upcomingAppointments.map(app => (
              
            <View key={app.id} style={styles.appointmentItem}>
              
       <TouchableOpacity onPress={()=> navigation.navigate('serviceAppointment', { id: app.id, client: app.client, contato: app.contato })}>
              <Text style={styles.appointmentText}>Cliente: {app.client}</Text>
        </TouchableOpacity>
              <Text style={styles.appointmentText}>Contato: {app.contato}</Text>
              <Text style={styles.appointmentText}>Tema: {app.tema}</Text>
              <Text style={styles.appointmentDate}>
                {format(new Date(app.data_evento), "PPPP", { locale: ptBR })} 
              </Text>
              <Text style={styles.appointmentText}>Local: {app.local_evento}</Text>
              <Text style={styles.appointmentStatus}>{app.status}</Text>
            </View>
          ))
        )}
        
      <View style={styles.seAllButton}>
                 
        {appointments.length > 3 && (

          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('Agendamentos')}>
            <Text style={styles.seeAllText}>Ver todos ({appointments.length})</Text>
          </TouchableOpacity>
        )}
        {/*<Ionicons name='search' size={20} color='#999' style={styles.icon} />*/}
                
       {/* <TextInput style={styles.input}
            placeholder="Pesquisar aqui..."
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={handleSearch}
   // onSubmitEditing={() => getAppoints(searchTerm)}
           
            keyboardType='default' 
            autoCorrect={false}
            clearButtonMode='while-editing'            
            />
*/}           
            </View>
        </View>

         <Button title="Selecionar Data" onPress={() => setShowDatePicker(true)} />
      <Text>Data selecionada: {date.toLocaleDateString()}</Text>
      
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}

 {/* Lista de agendamentos filtrados */}
           {/* {filteredAppointments.length > 0 ? (
               
                <View style={styles.listContainer}>

                  <FlatList data={filteredAppointments}
                    keyExtractor={(item) => item.id}
                    renderItem={renderAppointmentItem} 
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={loadingMore ? <ActivityIndicator size="small" /> : null}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  />
              </View>
                ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={50} color="#ccc" />
                  <Text style={styles.emptyText}>Nenhum agendamento pesquisado!</Text>
                  <Text style={styles.emptySubtext}>Tente pesquisar por cliente, tema ou data</Text>
                  </View>
                  )}
*/}
      
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 0,
  
  },
  listContainer: {
    flex: 1,
    marginBottom: 15,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
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
  scheduleButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 10,
  //  alignItems: 'center',
  //  flexDirection: 'row',
   // justifyContent: 'center',
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 18,
  //  fontWeight: 'bold',
   // marginLeft: 5,
  },
 input: {
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 30,
    backgroundColor: '#f8f9fa',
    height: 35,
    width: 220
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
  }
});