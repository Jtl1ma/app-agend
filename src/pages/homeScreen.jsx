import React, { useContext, useState, useEffect } from 'react';
import { 
  FlatList,
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Pressable,
  
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { format, set, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppointmentsContext } from '../context/appointmentsContext';
import axios from "axios";
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';



export default function HomeScreen({ navigation }) {
  const { 
    appointments,
    setAppointments,
    loadingMore, 
    isLoading, 
    refreshAppointments 
  } = useContext(AppointmentsContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isListening, setIsListening] = useState(false);
 // const [pesquisar, setPersquisar] = useState('');
 
 /*function onSpeechResults({ value }: SpeechResultsEvent) {
 
}*/

 useEffect(() => {
  Voice.onSpeechResults = onSpeechResults;  
  Voice.onSpeechStart = () => setIsListening(true);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = ({ value }) => {
  /*  const spokenText = event.value[0];
    setSearchTerm(spokenText);
    handleSearch(spokenText);
    */
   console.log('Speech results:', value);
   
  };
  const startVoiceRecognition = async () => {
    try {
      setSearchTerm('');
      setIsListening(true);
      await Voice.start('pt-br');
    } catch (error) {
      await Voice.stop();
      setIsListening(false);
      console.error('Error starting voice recognition:', error);
      Alert.alert('Erro ao iniciar reconhecimento de voz', error.message);
    }
  };

  // Filtra e busca agendamentos
  /*useEffect(() => {
   // getAppoints();
    let result = appointments;
  
    // Aplica busca por client, tema ou data
    if (searchTerm.length > 0) {
     // const term = searchTerm.toLowerCase();
      result = result.filter(app => 
        (app.client && app.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.tema && app.tema.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (app.atendente && app.atendente.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.data_evento && app.data_evento.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setSearchTerm(result);
  }, [appointments, searchTerm]);*/

  const getAppoints = async(newText) => {
    try {
      const response = await axios.get(`https://test-api.loca.lt/agenda`,{
        params: {
          search: newText || '',
          status: 'pendente', // ou 'confirmado', 'concluido', 'cancelado',
          client: newText || '',
          tema: newText || '',
      },
    });
      const { agendamentos } = response.data;
      setAppointments(agendamentos || []);
      setFilteredAppointments(agendamentos || []);
      
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



/*const handleChange = (name, value) => {
    setPersquisar(prev => ({ ...prev, [name]: value }));
  };*/

/*const handleSearch = (text) => {
  
  if (!text) {
    setFilteredAppointments([]); // Limpa os agendamentos filtrados
    setSearchTerm(''); // Limpa o termo de pesquisa
   // getAppoints(); // Limpa a pesquisa e recarrega os agendamentos
   return; }
  // Filtra os agendamentos com base no termo de pesquisa
  //setSearchTerm(text);
  //const search = searchTerm.toLowerCase();
   const filtered = appointments.filter(item =>{
  return (
    item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tema.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.data_evento.toLowerCase().includes(searchTerm.toLowerCase())) 
     });
  setSearchTerm(text);
setFilteredAppointments(filtered);
  getAppoints(); // Recarrega os agendamentos filtrados
};*/

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



 /* useEffect(()=>{
    handleSearch();
  },[]);*/

 const renderAppointmentItem = ({ item }) => (

    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => navigation.navigate('Update',{id: item.id})}
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
      default: return 'yellow'; // Pendente
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
      <Text style={styles.title}>Bem-vindo!</Text>
      
      <View style={styles.card}>
      <Text style={styles.cardTitle}>Próximos Agendamentos</Text>
        
        {upcomingAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum agendamento por enquanto!</Text>
            <Text style={styles.emptySubtext}>Toque no botão abaixo para agendar</Text>
          </View>
        ) : (
         upcomingAppointments.map(app => (
            <View key={app.id} style={styles.appointmentItem}>
              <TouchableOpacity onPress={()=> navigation.navigate('Update')}>
              <Text style={styles.appointmentText}>Cliente: {app.client}</Text>
              <Text style={styles.appointmentText}>Contato: {app.contato}</Text>
              <Text style={styles.appointmentText}>Tema: {app.tema}</Text>
              <Text style={styles.appointmentDate}>
                {format(new Date(app.data_evento), "PPPP", { locale: ptBR })} 
              </Text>
              <Text style={styles.appointmentText}>Local: {app.local_evento}</Text>
              <Text style={styles.appointmentStatus}>{app.status}</Text>
        </TouchableOpacity>
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
                
        <TextInput style={styles.input}
            placeholder="Campo de pesquisa!"
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={(newText) => {
              setSearchTerm(newText); 
              handleSearch(newText);
            }}
            keyboardType='default' 
            returnKeyType='search'
            autoCorrect={false}
            clearButtonMode='while-editing'            
            />
            <Pressable 
              style={styles.clearButton}
              onPress={() => {startVoiceRecognition();
               // setSearchTerm('');
               // setFilteredAppointments(appointments);
              }}>
              <Feather name="mic" size={24} color="#fff" />
            </Pressable>
            <Button
              title={isListening ? "Ouvindo" : "Buscar por voz"}
              onPress={isListening ? Voice.stop : startVoiceRecognition}
              color="#6200ee"
            />
            </View>
        </View>

 {/* Lista de agendamentos filtrados */}
            {filteredAppointments.length > 0 ? (
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

      <TouchableOpacity 
        style={styles.scheduleButton}
        onPress={handleNewAppointment}>
        <Text style={styles.scheduleButtonText}>
          <Ionicons name="add-circle-outline" size={18} />  Agendar Novo Cliente!
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
  },
 input: {
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 30,
    backgroundColor: '#f8f9fa',
   // height: 35,
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