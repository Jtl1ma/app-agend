import React, { useState, useEffect, useContext } from 'react';
import { FlatList, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator,  } from 'react-native';
import { AppointmentsContext } from '../context/appointmentsContext';
import { Picker } from "@react-native-picker/picker";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const EditAppointmentScreen = ({ route, navigation }) => {
 // const { appointmentId } = route.params;
 // const context = useContext(AppointmentsContext);
  const {
     appointments, refreshing, refreshAppointments,
     updateAppointment, loadingMore, hasMore,
    getAppointmentById, loadMoreAppointment, filterAppointmentsByStatus } = useContext(AppointmentsContext);

  //Verifica se o contexto esta disponivel
  if (!AppointmentsContext) {
    //Alert.alert('Erro: Contexto não disponivel');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Erro: Contexto não disponivel</Text>
      </View>
    );
  }
// Estados do formulário
 // const [appointment, setAppointment] = useState(null);
 // const [loading, setLoading] = useState(true);
 // const [filter, setFilter] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [editMode, setEditMode] = useState('');
  
  const [formData, setFormData] = useState({
    client: '',
    contato: '',
    tema: '',
    date: '',
    modelo: '',
    valor: '',
    sinal: '',
    resta: '',
    status: 'pendente',
    atendente: '',
    local: '',
    observacao: ''
  });

  // Carrega o agendamento se vier por parâmetro
  useEffect(() => {
    if (route.params?.appointmentId) {
      const appoint = getAppointmentById(route.params.appointmentId);
      if (appoint) {
        setSelectedAppointment(appoint);
        setFormData({
            client: appoint.client,
            contato: appoint.contato,
            tema: appoint.tema,
            date: appoint.date,
            modelo: appoint.modelo,
            valor: appoint.valor,
            sinal: appoint.sinal,
            resta: appoint.resta,
            status: appoint.status || 'pendente',
            atendente: appoint.atendente,
            local: appoint.local,
            observacao: appoint.observacao
          });
      }
    }
  }, [route.params]);

    // Filtra e busca agendamentos
  useEffect(() => {
    let result = appointments;
    
    // Aplica filtro por status
    if (statusFilter !== 'all') {
      result = filterAppointmentsByStatus(statusFilter);
    }
    
    // Aplica busca por tema, cliente ou data
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(app => 
        (app.client && app.client.toLowerCase().includes(term)) ||
        (app.tema && app.tema.toLowerCase().includes(term)) || 
        (app.date && app.date.toLowerCase().includes(term)) 
      );
    }
    
    setFilteredAppointments(result);
  }, [appointments, searchTerm, statusFilter]);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      loadMoreAppointment();
    }
  };

  const handleRefresh = () => {
    refreshAppointments();
  };


  // Busca agendamento por ID
  const handleSearchById = () => {
    if (!searchId.trim()) return;
    
    const appt = getAppointmentById(searchId);
    if (appt) {
      setSelectedAppointment(appt);
      setFormData({
        client: appt.client,
        contato: appt.contato,
        tema: appt.tema,
        date: appt.date,
        modelo: appt.modelo,
        valor: appt.valor,
        sinal: appt.sinal,
        resta: appt.resta,
        status: appt.status || 'pendente',
        atendente: appt.atendente,
        local: appt.local,
        observacao: appt.observacao
      });
     // navigation.push('EditAppointment', { appointmentId: 1 });
    } else {
      Alert.alert('Não encontrado', 'Nenhum agendamento encontrado com este ID');
    }
  };

  // Filtra agendamentos por status
  const handleFilterByStatus = () => {
    if (statusFilter === 'all') {
      setFilteredAppointments([]);
    } else {
      const filtered = filterAppointmentsByStatus(statusFilter);
      setFilteredAppointments(filtered);
    }
  };

  // Atualiza campo do formulário
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submete as alterações
  const handleSubmit = async () => {
    if(!selectedAppointment) return;
    try {
      await updateAppointment(selectedAppointment.id, formData);
      Alert.alert('Sucesso', 'Agendamento atualizado com sucesso');
     setEditMode(false);
     refreshAppointments();
      // navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o agendamento');
    }
  };

/*  if (!loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!appointments) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Agendamento não encontrado</Text>
      </View>
    );
  }  */

  const renderAppointmentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => {
        setSelectedAppointment(item);
        setFormData({
          client: item.client,
          tema: item.tema,
          modelo: item.modelo,
          date: item.date,
          status: item.status || 'pendente',
          valor: item.valor,
          sinal: item.sinal,
          resta: item.resta,
          atendente: item.atendente,
          local: item.local,
          observacao: item.observacao
        });
        setEditMode(false);
      }}
    >
      <Text style={styles.itemTitle}>{item.tema}</Text>
      <Text style={styles.itemClient}>{item.client}</Text>
      <Text style={styles.itemDate}>
        {item.date ? format(new Date(item.date), "PPPPp", { locale: ptBR }) : 'Data não informada'}
      </Text>
      <Text style={[styles.itemStatus, { color: getStatusColor(item.status) }]}>
        {item.status || 'pendente'}
      </Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmado': return 'green';
      case 'cancelado': return 'red';
      default: return 'orange';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Seção de busca */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Buscar Agendamento</Text>
        {/*<View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Digite o ID"
            value={searchId}
            onChangeText={setSearchId}
            keyboardType="numeric"
          />
          <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearchById}
          >
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>
        </View>*/}
      </View>
<TextInput
          style={styles.searchInput}
          placeholder="Buscar por cliente, tema ou data..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

      {/* Seção de filtro */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Filtrar por Status</Text>
        <View style={styles.filterRow}>
          <Picker
            selectedValue={statusFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setStatusFilter(itemValue)}
          >
            <Picker.Item label="Todos" value="all" />
            <Picker.Item label="Pendente" value="pendente" />
            <Picker.Item label="Confirmado" value="confirmado" />
            <Picker.Item label="Cancelado" value="cancelado" />
            <Picker.Item label="Concluído" value="concluido" />
          </Picker>
          <TouchableOpacity style={styles.filterButton} 
          onPress={handleFilterByStatus}
          >
            <Text style={styles.buttonText}>Filtrar</Text>
          </TouchableOpacity>
        </View>

        {filteredAppointments.length > 0 && (
          <View style={styles.filterResults}>
            <Text style={styles.resultsTitle}>Resultados do Filtro:</Text>
            {filteredAppointments.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.filterItem}
                onPress={() => navigation.push('EditAppointment', { appointmentId: '1' })}
              >
                <Text>#Dados Encontrados: {item.id} - {item.client} ({item.status})</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {/* Lista de agendamentos */}
            <View style={styles.listContainer}>
              <FlatList
                data={filteredAppointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderAppointmentItem}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListFooterComponent={loadingMore ? <ActivityIndicator size="small" /> : null}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            </View>

      {/* Formulário de edição */}
      {selectedAppointment && (
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>
          {editMode ? 'Editar Agendamento' : 'Detalhes do agendamento'}
          {/* #{appointments.id}}*/}
          </Text>
        
        <Text style={styles.dateText}>
          Criado em: {selectedAppointment.date && format(parseISO(selectedAppointment.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
        </Text>

         {editMode ? (
          <>
        <Text style={styles.label}>Cliente</Text>
        <TextInput
          style={styles.input}
          value={formData.client}
          onChangeText={(text) => handleChange('client', text)}
        />

        <Text style={styles.label}>Contato</Text>
        <TextInput
          style={styles.input}
          value={formData.contato}
          onChangeText={(text) => handleChange('contato', text)}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Tema</Text>
        <TextInput
          style={styles.input}
          value={formData.tema}
          onChangeText={(text) => handleChange('tema', text)}
        />

        <Text style={styles.label}>Data do Evento</Text>
        <TextInput
          style={styles.input}
          value={formData.date}
          onChangeText={(text) => handleChange('date', text)}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Modelo</Text>
        <TextInput
          style={styles.input}
          value={formData.modelo}
          onChangeText={(text) => handleChange('modelo', text)}
        />

        <Text style={styles.label}>Valor</Text>
        <TextInput
          style={styles.input}
          value={formData.valor}
          onChangeText={(text) => handleChange('valor', text)}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Sinal</Text>
        <TextInput
          style={styles.input}
          value={formData.sinal}
          onChangeText={(text) => handleChange('sinal', text)}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Resta Pagar</Text>
        <TextInput
          style={styles.input}
          value={formData.resta}
          onChangeText={(text) => handleChange('resta', text)}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Status</Text>
        <Picker
          selectedValue={formData.status}
          style={styles.input}
          onValueChange={(itemValue) => handleChange('status', itemValue)}
        >
          <Picker.Item label="Pendente" value="pendente" />
          <Picker.Item label="Confirmado" value="confirmado" />
          <Picker.Item label="Cancelado" value="cancelado" />
          <Picker.Item label="Concluído" value="concluido" />
        </Picker>

        <Text style={styles.label}>Atendente</Text>
        <TextInput
          style={styles.input}
          value={formData.atendente}
          onChangeText={(text) => handleChange('atendente', text)}
        />

        <Text style={styles.label}>Local</Text>
        <TextInput
          style={styles.input}
          value={formData.local}
          onChangeText={(text) => handleChange('local', text)}
        />

        <Text style={styles.label}>Observação</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={formData.observacao}
          onChangeText={(text) => handleChange('observacao', text)}
          multiline
        />
        <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.button, styles.submitButton]} 
        onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
         style={[styles.button, styles.cancelButton]} 
        onPress={()=> setEditMode(false)}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </>
         ) : (
          <>
           <Text style={styles.detailText}>Cliente: {selectedAppointment.client}</Text>
          <Text style={styles.detailText}>Contato: {selectedAppointment.contato}</Text>
          <Text style={styles.detailText}>Tema: {selectedAppointment.tema}</Text>
          <Text style={styles.detailText}>Data: {selectedAppointment.date}</Text>
          <Text style={[styles.detailText, { color: getStatusColor(selectedAppointment.status) }]}>
            Status: {selectedAppointment.status}
          </Text>
                        
            <TouchableOpacity 
             style={[styles.button, styles.editButton]}
              onPress={() => setEditMode(true)}
            >
            <Text style={styles.buttonText}>Editar</Text>
           </TouchableOpacity>
          </>
)}
</View>
)}
</ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  searchSection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  filterSection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  formSection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  listContainer: {
    flex: 1,
    marginBottom: 15,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterResults: {
    marginTop: 10,
  },
  resultsTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filterItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
    buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    flex: 1,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#007bff',
    marginTop: 15,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemClient: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default EditAppointmentScreen;