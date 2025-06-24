import React, { useState, useEffect, useContext } from 'react';
import { FlatList, Platform, KeyboardAvoidingView, ScrollView, Text, StyleSheet, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { AppointmentsContext } from '../context/appointmentsContext';
import { Picker } from "@react-native-picker/picker";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const UpdateAppointments = ({ route, navigation }) => {
  const { 
    appointments, 
    refreshing, 
    refreshAppointments, 
    updateAppointment, 
    loadingMore, 
    hasMore,
    loadMoreAppointment,
    filterAppointmentsByStatus,
    getAppointmentById,
    cancelAppointment,
  } = useContext(AppointmentsContext);

  // Verifica se o contexto está disponível
  if (!AppointmentsContext) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Erro: Contexto não disponível</Text>
      </View>
    );
  }

  // Estados do componente
  const [searchId, setSearchId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    client: '',
    contato: '',
    tema: '',
    data_evento: '',
    modelo: '',
    valor: '',
    sinal_entrada: '',
    resta_pagar: '',
    status: 'pendente',
    atendente: '',
    local_evento: '',
    observacao: ''
  });

  // Carrega o agendamento se vier por parâmetro
  useEffect(() => {
    if (route.params?.appointmentId) {
      const appointment = getAppointmentById(route.params.appointmentId);
      if (appointment) {
        setSelectedAppointment(appointment);
        setFormData({
          client: appointment.client,
          contato: appointment.contato,
          tema: appointment.tema,
          data_evento: appointment.data_evento,
          modelo: appointment.modelo,
          valor: appointment.valor,
          sinal_entrada: appointment.sinal_entrada,
          resta_pagar: appointment.resta_pagar,
          status: appointment.status || 'pendente',
          atendente: appointment.atendente,
          local_evento: appointment.local_evento,
          observacao: appointment.observacao
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
    
    // Aplica busca por client, tema ou data
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(app => 
        (app.client && app.client.toLowerCase().includes(term)) ||
        (app.tema && app.tema.toLowerCase().includes(term)) || 
        (app.data_evento && app.data_evento.toLowerCase().includes(term))
      );
    }
    setFilteredAppointments(result);
  }, [appointments, searchTerm, statusFilter]);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      loadMoreAppointment();
    }
  };
// Faz o Refresh
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
        data_evento: appt.data_evento,
        modelo: appt.modelo,
        valor: appt.valor,
        sinal_entrada: appt.sinal_entrada,
        resta_pagar: appt.resta_pagar,
        status: appt.status || 'pendente' || 'confirmado' || 'cancelado',
        atendente: appt.atendente,
        local_evento: appt.local_evento,
        observacao: appt.observacao
      });
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

  const formatCurrency = (value) => {
    // Remove todos os caracteres não numéricos
    let cleanedValue = value.replace(/\D/g, '');
    
    // Converte para número e formata como moeda
    let number = Number(cleanedValue) / 100;
    
    
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
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
    if (!selectedAppointment) return;
    
    try {
      await updateAppointment(selectedAppointment.id, formData);
      Alert.alert('Sucesso', 'Agendamento atualizado com sucesso');
      setEditMode(false);
      refreshAppointments();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o agendamento');
    }
  };

  const renderAppointmentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => {
        setSelectedAppointment(item);
        setFormData({
          client: item.client,
          contato: item.contato,
          tema: item.tema,
          data_evento: item.data_evento,
          modelo: item.modelo,
          valor: item.valor,
          sinal_entrada: item.sinal_entrada,
          resta_pagar: item.resta_pagar,
          status: item.status || 'pendente' || 'confirmado' || 'cancelado',
          atendente: item.atendente,
          local_evento: item.local_evento,
          observacao: item.observacao
        });
        setEditMode(false);
      }}
    >
      <Text style={styles.itemTitle}>{item.tema}</Text>
      <Text style={styles.itemClient}>{item.client}</Text>
      <Text style={styles.itemDate}>
        {item.data_evento ? format(new Date(item.data_evento), "PPPPp", { locale: ptBR }) : 'Data não informada'}
      </Text>
      <Text style={[styles.itemStatus, { color: getStatusColor(item.status) }]}>
        {item.status || 'pendente' || 'confirmado' || 'cancelado'}
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
     <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >

    <ScrollView contentContainerStyle={styles.scrollContainer}>

    {/*<View style={styles.container}>*/}
      {/* Seção de busca */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Buscar Agendamentos</Text>
        {/*<View style={styles.searchRow}>*/}

          <TextInput
          style={[styles.searchInput, { marginTop: 0 }]}
          placeholder="Buscar por tema, cliente ou data..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

         {/* <TextInput
            style={styles.searchInput}
            placeholder="Digite o ID"
            value={searchId}
            onChangeText={setSearchId}
            keyboardType="numeric"
          /> 
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleFilterByStatus}
          >
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>*/}
        {/*</View>*/}
        </View>
        
        
      {/*</View>*/}

      {/* Seção de filtro */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Filtrar por Status</Text>
        <View style={styles.filterRow}>
          <Picker
            selectedValue={statusFilter}
            style={styles.picker}
            onValueChange={setStatusFilter}
          >
            <Picker.Item label="Todos" value="all" />
            <Picker.Item label="Pendente" value="pendente" />
            <Picker.Item label="Confirmado" value="confirmado" />
            <Picker.Item label="Cancelado" value="cancelado" />
            <Picker.Item label="Concluído" value="concluido" />
          </Picker>
          <TouchableOpacity style={styles.filterButton} 
            onPress={handleFilterByStatus}>
            <Text style={styles.buttonText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
        {/*
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
        */}
      </View>

      {/* Lista de agendamentos */}
      <View style={styles.listContainer}>
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAppointmentItem}
          //onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
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
            {editMode ? 'Editar Agendamento' : 'Detalhes do Agendamento'}
          </Text>
          
          <Text style={styles.dateText}>
          Agendado pela vendedora:  {selectedAppointment.atendente}
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
                onChangeText={(text) => handleChange('valor', formatCurrency(text))}
                keyboardType="numeric"
              />
              <Text style={styles.label}>Sinal</Text>
              <TextInput
                style={styles.input}
                value={formData.sinal_entrada}
                onChangeText={(text) => handleChange('sinal_entrada', formatCurrency(text))}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Resta pagar</Text>
              <TextInput
                style={styles.input}
                value={formData.resta_pagar}
                onChangeText={(text) => handleChange('resta_pagar', formatCurrency(text))}
                keyboardType="numeric"
              />
              <Text style={styles.label}>Local do evento</Text>
              <TextInput
                style={styles.input}
                value={formData.local_evento}
                onChangeText={(text) => handleChange('local_evento', text)}
                
              />
              <Text style={styles.label}>Observação</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={formData.observacao}
                onChangeText={(text) => handleChange('observacao', text)}
                multiline
              />

              <Text style={styles.label}>Data do Evento</Text>
              <TextInput
                style={styles.input}
                value={formData.data_evento}
                onChangeText={(text) => handleChange('data_evento', text)}
                placeholder="DD-MM-YYYY"
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

              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>Salvar Alterações</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setEditMode(false)}
                >
                  <Text style={styles.buttonText}>Cancelar Atualizações</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.detailText}>Cliente: {selectedAppointment.client}</Text>
              <Text style={styles.detailText}>Contato: {selectedAppointment.contato}</Text>
              <Text style={styles.detailText}>Tema: {selectedAppointment.tema}</Text>
              <Text style={styles.detailText}>Data do Evento:
                {selectedAppointment.data_evento && format(parseISO(selectedAppointment.data_evento), "PPPp", { locale: ptBR })}

              </Text>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  searchSection: {
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  filterSection: {
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  formSection: {
    marginBottom: 15,
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
   // flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 5,
    height: 35
  },
  picker: {
    flex: 1,
   // height: 30,
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    marginLeft: 10,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    backgroundColor: '#28a745'
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#28a745',
    flex: 1,
    marginRight: 5,
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

export default UpdateAppointments;