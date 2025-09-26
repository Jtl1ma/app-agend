import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  Platform, KeyboardAvoidingView, ScrollView,  ActivityIndicator, Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AppointmentsContext } from '../context/appointmentsContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import icons from "../consts/icons.js";



const EditCard = () => {
  const { appointments } = useContext(AppointmentsContext);
//const [selectedAppointment, setSelectedAppointment] = useState(null);
const [statusFilter, setStatusFilter] = useState('Pendente');
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmado': return 'green';
      case 'pendente': return 'yello';
      case 'cancelado': return 'red';
      default: return 'orange';
    }
  };

  // Atualiza campo do formulário
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 return (
      <KeyboardAvoidingView
           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
           style={styles.container}
         >
 
     <ScrollView contentContainerStyle={styles.scrollContainer}>

     <View style={styles.banner}>
        <Image source={appointments.id == "M" ? icons.cliente : icons.clientefeliz} />
        <Text style={styles.text}>Cliente: {appointments.client} </Text>
        <Text style={styles.text}>Contato: {appointments.contato} </Text>
    </View>

 {appointments.map(app => (
 
      <View style={styles.card}
      key={app.id}
    >
       {/* Formulário de edição */}
       {app.id && ( 
       
         <View style={styles.formSection}>
           <Text style={styles.sectionTitle}>
             {editMode ? 'Editar Agendamento' : 'Detalhes do Agendamento'}
           </Text>
           
           <Text style={styles.dateText}>
           Agendado pela vendedora:  {app.atendente}
           </Text>
 
           {editMode ? (
                        
             <>
               <Text style={styles.label}>Cliente</Text>
               <TextInput
                 style={styles.input}
                 value={app.client}
                 onChangeText={(text) => handleChange('client', text)}
               />
 
               <Text style={styles.label}>Contato</Text>
               <TextInput
                 style={styles.input}
                 value={app.contato}
                 onChangeText={(text) => handleChange('contato', text)}
                 keyboardType="phone-pad"
               />
 
               <Text style={styles.label}>Tema</Text>
               <TextInput
                 style={styles.input}
                 value={app.tema}
                 onChangeText={(text) => handleChange('tema', text)}
               />
               <Text style={styles.label}>Modelo</Text>
               <TextInput
                 style={styles.input}
                 value={app.modelo}
                 onChangeText={(text) => handleChange('modelo', text)}
               />
               <Text style={styles.label}>Valor</Text>
               <TextInput
                 style={styles.input}
                 value={app.valor}
                 onChangeText={(text) => handleChange('valor', formatCurrency(text))}
                 keyboardType="numeric"
               />
               <Text style={styles.label}>Sinal</Text>
               <TextInput
                 style={styles.input}
                 value={app.sinal_entrada}
                 onChangeText={(text) => handleChange('sinal_entrada', formatCurrency(text))}
                 keyboardType="numeric"
               />
 
               <Text style={styles.label}>Resta pagar</Text>
               <TextInput
                 style={styles.input}
                 value={app.resta_pagar}
                 onChangeText={(text) => handleChange('resta_pagar', formatCurrency(text))}
                 keyboardType="numeric"
               />
               <Text style={styles.label}>Local do evento</Text>
               <TextInput
                 style={styles.input}
                 value={app.local_evento}
                 onChangeText={(text) => handleChange('local_evento', text)}
                 
               />
               <Text style={styles.label}>Observação</Text>
               <TextInput
                 style={[styles.input, { height: 80 }]}
                 value={app.observacao}
                 onChangeText={(text) => handleChange('observacao', text)}
                 multiline
               />
 
               <Text style={styles.label}>Data do Evento</Text>
               <TextInput
                 style={styles.input}
                 value={app.data_evento}
                 onChangeText={(text) => handleChange('data_evento', text)}
                 placeholder="DD-MM-YYYY"
               />
 
               <Text style={styles.label}>Status</Text>
               <Picker selectedValue={statusFilter}
                // style={styles.input}
                 onValueChange={(itemValue) => { 
                   setStatusFilter('status', itemValue)}}
               >
                 <Picker.Item label="Pendente" value="pendente" />
                 <Picker.Item label="Confirmado" value="confirmado" />
                 <Picker.Item label="Cancelado" value="cancelado" />
                 <Picker.Item label="Concluído" value="concluido" />
               </Picker>
 
               <View style={styles.buttonGroup}>
                 <TouchableOpacity 
                   style={[styles.button, styles.saveButton]}
                   onPress={() => {Alert.alert('Salvando alterações...'); setEditMode(false);}}
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
               <Text style={styles.detailText}>Cliente: {app.client}</Text>
               <Text style={styles.detailText}>Contato: {app.contato}</Text>
               <Text style={styles.detailText}>Tema: {app.tema}</Text>
               <Text style={styles.detailText}>Data do Evento:
                 {app.data_evento && format(parseISO(app.data_evento), "PPPp", { locale: ptBR })}
 
               </Text>
               <Text style={[styles.detailText, { color: getStatusColor(app.status) }]}>
                 Status: {statusFilter}
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
        </View>
          ))}
          
     </ScrollView>
     </KeyboardAvoidingView>
   );
 };
 
 const styles = StyleSheet.create({
  
   container: {
     flex: 1,
   //  padding: 15,
     backgroundColor: '#dbeafe',
   },
   banner: {
        alignItems: "center",
        backgroundColor: "blue",
     // justifyContent: "center",
        paddingTop: 12,
        paddingBottom: 25
    },
    text : {
       // textAlign: TEXT.align,
       color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 8
    },
   scrollContainer: {
   //  padding: 20,
    // paddingBottom: 40,
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
     height: 35,
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
     color: '#fff',
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
 
  export default EditCard;