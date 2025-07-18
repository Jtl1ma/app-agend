import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppointmentsContext } from '../context/appointmentsContext';
import { format, set, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
//import AppointmentCard from '../components/appointmentCard';

const AppointmentsScreen = ({ navigation }) => {
   const { appointments, cancelAppointment, hasMore, loadingMore } = useContext(AppointmentsContext);
   const [currentPage, setCurrentPage] = useState(1);
   const [refreshing, setRefreshing] = useState(false);
 
 /* useEffect(() => {
    // Simulação de busca de agendamentos
    setTimeout(() => {
      setAppointments([
        {
          id: '1',
          date: '2023-06-15',
          time: '10:00',
          service: 'Consulta Médica',
          status: 'Confirmado',
        },
        {
          id: '2',
          date: '2023-06-20',
          time: '14:30',
          service: 'Exame de Sangue',
          status: 'Pendente',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando agendamentos...</Text>
      </View>
    );
  }*/
 // useEffect(()=> {
   // loadMoreAppointment(currentPage); //Carrega a primeira pag ao iniciar
 // }, [currentPage]);

  const handleEdit = async ({item}) => {
    //navigation.replace('Edit');
    navigation.navigate('serviceAppointment', {id:item.id});
  };
    const renderAppointment = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.nameClient}>Cliente: {item.client}</Text>
        <Text style={styles.nameClient}>Contato: {item.contato}</Text>
        <Text style={styles.nameClient}>Tema: {item.tema}</Text>
        <Text style={styles.cardDate}>
          Data do evento: {format(new Date(item.data_evento), "PPPP", { locale: ptBR })}
        </Text>
        <Text style={styles.cardService}>Modelo: {item.modelo}</Text>
        <Text style={styles.cardService}>Valor: {item.valor}</Text>
        <Text style={styles.cardService}>Sinal: {item.sinal_entrada}</Text>
        <Text style={styles.cardService}>Resta pagar: {item.resta_pagar}</Text>
        <Text style={styles.cardStatus}>Status: {item.status}</Text>
        <Text style={styles.cardStatus}>Atendente: {item.atendente}</Text>
        <Text style={styles.cardStatus}>Local: {item.local_evento}</Text>
        <Text style={styles.cardStatus}>OBS: {item.observacao}</Text>



        {/*<View style={styles.Buttons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleEdit()}
          >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => cancelAppointment(item.id)}
          >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        </View>*/}
      </View>
    )};
  
    

    const handleLoadMore = () => {
      if (hasMore && !loadingMore) {
        //loadMoreAppointment();
        setCurrentPage(prev => prev + 1);
      }
    };
    const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    // Você precisará modificar seu context para aceitar um refresh
     loadMoreAppointment(1, true).then(() => setRefreshing(false));
    //setRefreshing(false); // Remova esta linha quando implementar o refresh real
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#999" />
      </View>
    );
  };

  const renderPaginationControls = () => {
    if (appointments.length === 0) return null;
    
    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <Text style={styles.paginationText}>Anterior</Text>
        </TouchableOpacity>
        
        <Text style={styles.pageNumber}>Página {currentPage}</Text>
        
        <TouchableOpacity 
          style={[styles.paginationButton, !hasMore && styles.disabledButton]}
          onPress={() => setCurrentPage(prev => prev + 1)}
          disabled={!hasMore}
        >
          <Text style={styles.paginationText}>Próxima</Text>
        </TouchableOpacity>
      </View>
    );
  };

    //---------------------------------//-------------------------------//
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todos Agendamentos</Text>
      
      {appointments.length === 0 && !loadingMore ? (
        <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
      ) : (
        <>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAppointment}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          />
          {renderPaginationControls()}
          </>
      )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nameClient: { fontSize: 14, marginBottom: 5},
  cardDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardService: {
    fontSize: 14,
    marginBottom: 5,
  },
  cardStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  Buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    
  },

  cancelButton: {
    paddingBlock: 5,
    paddingHorizontal: 45,
    backgroundColor: '#6200ee',
     borderRadius: 8,
    marginHorizontal: 20,
    },

  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    
  },
  editButtonText: {
    fontSize: 16,
    color: 'white',
  },
  paginationContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  paginationText: {
  backgroundColor: '#f5f5f5',
  fontSize: 16,
  padding: 12,
  margin: 3,
  borderRadius: 6  
  },
  pageNumber: {
    backgroundColor: '#c5c5c5',
    fontSize: 16,
    padding: 12,
    margin: 3,
    borderRadius: 6
  },
  paginationButton: {
    justifyContent: 'flex-end',
  }

});

export default AppointmentsScreen;