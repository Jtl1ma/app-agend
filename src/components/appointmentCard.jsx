import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppointmentsContext } from "../context/appointmentsContext.jsx";
import React, { useContext, useState } from "react";
import EditCard from './editCard.jsx';



const AppointmentCard = ({ onCancelSuccess }) => {
  const { filteredAppointments } = useContext(AppointmentsContext);
  const navigation = useNavigation();
  
 const getStatusStyles = () => {
    const styles = {
      Confirmado: { bg: '#e6f7ee', text: '#10b981', icon: 'check-circle' },
      Pendente: { bg: '#fef3c7', text: '#d97706', icon: 'pending' },
      Cancelado: { bg: '#fee2e2', text: '#ef4444', icon: 'cancel' },
    };
    return styles[filteredAppointments[0].status] || { bg: '#e5e7eb', text: '#6b7280', icon: 'help' };
  };

  const statusStyles = getStatusStyles();

  const handleReschedule = () => {
     navigation.navigate('EditCard');
     
  };
    
  

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Agendamento',
      `Tem certeza que deseja cancelar ${filteredAppointments[0].id}?`,
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim',
          onPress: () => {
            // Simulação de chamada à API
            setTimeout(() => {
              onCancelSuccess(filteredAppointments[0].id);
              Alert.alert('Sucesso', 'Agendamento cancelado com sucesso');
            }, 500);
          } 
        }
      ]
    );
  };

  return (
    <>
    
    {filteredAppointments.map(app => (
 
      <View style={styles.card}
      key={app.id}
    >
      
      <View style={styles.cardHeader}>
        <Text style={styles.service}>{app.service}</Text>
        
        <View style={[styles.statusContainer, { backgroundColor: statusStyles.bg }]}>
          <MaterialIcons 
            name={statusStyles.icon} 
            size={16} 
            color={statusStyles.text} 
            style={styles.statusIcon}
          />
          <Text style={[styles.statusText, { color: statusStyles.text }]}>
            {app.status}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <MaterialIcons name="note" size={16} color="#4b5563" />
          <Text style={styles.detailText}>Tema: {app.tema}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="calendar-today" size={16} color="#4b5563" />
          <Text style={styles.detailText}>Data do evento: 
            {new Date(app.data_evento).toLocaleDateString('pt-BR', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="format-color-text" size={16} color="#4b5563" />
          <Text style={styles.detailText}>Modelo: {app.modelo}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="add-home" size={16} color="#4b5563" />
          <Text style={styles.detailText}>Valor: R$ {app.valor}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="add-home" size={16} color="#4b5563" />
          <Text style={styles.detailText}>Sinal: R$ {app.sinal_entrada}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="history" size={16} color="#4b5563" />
          <Text style={styles.detailText}>Resta pagar: R$ {app.resta_pagar}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="person" size={16} color="#4b5563" />
          <Text style={styles.detailText}>Agendado pela vendedora: {app.atendente}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="location-pin" size={16} color="#4b5563" />
          <Text style={styles.detailText}>Local do evento: {app.local_evento}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="source" size={16} color="#4b5563" />
          <Text style={styles.detailText}>Obs.: {app.observacao}</Text>
        </View>
      </View>

      

      {app.status !== 'Cancelado' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rescheduleButton]}
            onPress={handleReschedule}
          >
            <MaterialIcons name="schedule" size={16} color="#1d4ed8" />
            <Text style={[styles.actionText, { color: '#1d4ed8' }]}>Reagendar</Text>
          </TouchableOpacity>
                    
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={()=> navigation.navigate('EditCard')}
          >
            <MaterialIcons name="close" size={16} color="#b91c1c" />
            <Text style={[styles.actionText, { color: '#b91c1c' }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/*<FlatList data={filteredAppointments}
         keyExtractor={(serv) => serv.id} 
            showsVerticalScrollIndicator={false}
            renderItem={(item)=>{
                return  <EditCard  />
            }} />*/}
    </View>
  )
    )} 
    </>

  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  service: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  rescheduleButton: {
    backgroundColor: '#dbeafe',
  },
  cancelButton: {
    backgroundColor: '#fee2e2',
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AppointmentCard;