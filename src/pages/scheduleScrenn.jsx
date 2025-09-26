import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AppointmentsContext } from '../../src/context/appointmentsContext';
import { MaterialIcons } from '@expo/vector-icons';
import {ptBR} from '../consts/locale';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import { atendentes } from '../consts/atendentes';//vai vim da rota get('/agente');

LocaleConfig.locales["pt-br"] = ptBR;
LocaleConfig.defaultLocale = "pt-br";

const ScheduleScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    client: "",
    contato: "",
    tema: "",
    modelo: "",
    valor: "",
    sinal_entrada: "",
    resta_pagar: "",
    status: "",
    atendente: "",
    local_evento: "",
    observacao: "",
    
  });
  const [selectedDate, setSelectedDate] = useState('');
  
  const { addAppointment, atendentesList } = useContext(AppointmentsContext);
  
  

  const formatCurrency = (value) => {
    if (!value) return '';
    // Remove todos os caracteres não numéricos
    let cleanedValue = String(value).replace(/\D/g, '');
    
    // Converte para número e formata como moeda
    let number = Number(cleanedValue) / 100;
    
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  };
//Atualiza os campos
  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const {control, reset, formState: { errors }} = useForm({
      defaultValues: {
        atendente_name: "",
        status: "Pendente"
      }
  });
  
  useEffect(() => {
  reset({
    atendente_name: form.atendente,
    status: form.status
  });
}, [form.atendente, form.status, reset]);


  const verifyCurrency = () => {

    // Converte os valores para número
  const valor = Number(String(form.valor).replace(/\D/g, '')) / 100;
  const sinal = Number(String(form.sinal_entrada).replace(/\D/g, '')) / 100;
  //const resta = Number(String(form.resta_pagar).replace(/\D/g, '')) / 100;

      if (sinal < valor) {
        setForm(prev => ({ 
          ...prev, 
          resta_pagar: (valor - sinal).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          status: 'Pendente'
         }));
        
      } else if (sinal === valor) {
        setForm(prev => ({ 
          ...prev, resta_pagar: formatCurrency(0.00), 
          status: 'Confirmado' 
        }));
       
      } else if (selectedDate < new Date()) {
        setForm(prev => ({ 
          ...prev, status: 'Concluído' 
        }));

      }
      return true;
  };
useEffect(() => {
  verifyCurrency();
}, [form.valor, form.sinal_entrada, selectedDate]);

  const handleSchedule = () => {
    

    if (!selectedDate) {
      Alert.alert('Atenção', 'Selecione uma data para o agendamento');
      return;
    }

    const requiredFields = ['client', 'contato', 'tema', 'modelo', 'valor'];
    const missingFields = requiredFields.filter(field => !form[field]);

    if (missingFields.length > 0) {
      Alert.alert(
        'Campos obrigatórios', 
        `Preencha os seguintes campos: ${missingFields.join(' , ')}`
      );
      return;
    }
    
    
    
    const newAppointment = {
      ...form,
      data_evento: selectedDate,
      
    //  status: 'Confirmado' || 'Pendente' || 'Cancelado' || 'Concluído',
    status: verifyCurrency() ? form.status : 'Cancelado',  
    id: Date.now().toString()
    };

    addAppointment(newAppointment);
    
    Alert.alert(
      'Agendamento Confirmado',
      `Serviço agendado para ${new Date(selectedDate).toLocaleDateString('pt-BR')}`,
      [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('serviceAppointment') 
        }
      ]
    );
console.log(selectedDate);
    // Reset form
    setForm({
      client: "",
      contato: "",
      tema: "",
      modelo: "",
      valor: "",
      sinal_entrada: "",
      resta_pagar: "",
      status: "Pendente",
      atendente: "",
      local_evento: "",
      observacao: "",
    });
    setSelectedDate('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Novo Agendamento</Text>
        
        <View style={styles.section}>
          
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
            
            markedDates={{
              [selectedDate]: { selected: true, marked: true, selectedColor: '#3b82f6' },
              
            }}
            minDate={new Date().toISOString()} //.split('T')[0] Disable past dates
            style={{ borderRadius: 10, marginBottom: 20 }}
            theme={{
              todayTextColor: '#ff0000',
              selectedDayBackgroundColor: '#3b82f6',
              arrowColor: '#3b82f6',
              monthTextColor: '#3b82f6',
              textDayFontFamily: 'Roboto',
              textMonthFontFamily: 'Roboto',
            }}
            locale={'pt-br'}  
           />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados do Cliente</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do Cliente *"
            placeholderTextColor="#999"
            value={form.client}
            onChangeText={(text) => handleChange('client', text)}
            autoCapitalize="none"            
          />
          <TextInput
            style={styles.input}
            placeholder="Contato *"
            placeholderTextColor="#999"
            value={form.contato}
            onChangeText={(text) => handleChange('contato', text)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes do Agendamento</Text>
         <Text style={{textAlign: 'center', marginBottom: 5, fontWeight: '600', color: '#3b82f6'  }}>
           Selecione o Atendente!</Text>

        <Controller control={control}
            name="atendente_name"
            render={({ field: { onChange, value } }) => (
                           
    <Picker selectedValue={value}
      style={styles.picker}
      itemStyle={styles.pickerItem}
      onValueChange={(itemValue) => {
        onChange(itemValue); // Atualiza o valor do Controller
        handleChange('atendente', itemValue); // Atualiza o estado local
      }}
      mode="dropdown"
      dropdownIconColor="#3b82f6"
      prompt="Selecione o Atendente"
    >
      {atendentes?.filter(a => a && a.id).map((atendente) => (
  <Picker.Item
    key={atendente.id}
    value={atendente.name}
    label={atendente.name}
  />
))}

    </Picker>
  )}
  rules={{ required: 'Atendente é obrigatório' }}
/>
{errors.atendente_name && (
  <Text style={{ color: 'red' }}>
    {errors.atendente_name.message}
  </Text>
)}          
          <TextInput
            style={styles.input}
            placeholder="Tema *"
            placeholderTextColor="#999"
            value={form.tema}
            onChangeText={(text) => handleChange('tema', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Modelo *"
            placeholderTextColor="#999"
            value={form.modelo}
            onChangeText={(text) => handleChange('modelo', text)}
          />

        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financeiro</Text>
          <TextInput
            style={styles.input}
            placeholder="Valor Total *"
            placeholderTextColor="#999"
            value={form.valor}
            onChangeText={(text) => handleChange('valor', formatCurrency(text))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Sinal de Entrada *"
            placeholderTextColor="#999"
            value={form.sinal_entrada}
            onChangeText={(text) => handleChange('sinal_entrada', formatCurrency(text))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Resta Pagar *"
            placeholderTextColor="#999"
            value={form.resta_pagar}
            onChangeText={(text) => handleChange('resta_pagar', formatCurrency(text))}
            keyboardType="numeric"
          />

          {/* Status e Atendente dinamucamente*/}
          <Text style={{textAlign: 'center', marginBottom: 5, fontWeight: '600', color: '#3b82f6' }}>
            Status do Agendamento
          </Text>
          <TextInput
              style={styles.input}
              placeholder="Status *"
              placeholderTextColor="#999"
              value={form.status || 'Cancelado'}
              editable={false}
            />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outras Informações</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Local do Evento *"
            placeholderTextColor="#999"
            value={form.local_evento}
            onChangeText={(text) => handleChange('local_evento', text)}
           // autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Observações *"
            placeholderTextColor="#999"
            value={form.observacao}
            onChangeText={(text) => handleChange('observacao', text)}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSchedule}
          disabled={!selectedDate}
        >
          <MaterialIcons name="event-available" size={24} color="white" />
          <Text style={styles.buttonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    label: { marginTop: 10, fontWeight: "bold" },
   // paddingLeft: 20,
   // paddingRight: 20,
  },
  scrollContainer: {
    padding: 25,
   // paddingBottom: 40,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    //padding: 5,
   // shadowColor: '#000',
   // shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 10,
   
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#3b82f6',
    borderBottomColor: '#e9ecef',
  },
  input: {
    fontWeight: '600',
    height: 50,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 15,
    backgroundColor: '#f8f9fa',
        
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  picker: {
      backgroundColor: '#f8f9fa',
      paddingHorizontal: 32,
      borderWidth: 1,
      borderColor: '#e9ecef',
      borderRadius: 8,
      marginBottom: 12,
      height: 130,
      justifyContent: 'center', 
   },  
   pickerItem: {
     fontSize: 14,
      fontWeight: '600',
      color: '#000',
   },
});

export default ScheduleScreen;