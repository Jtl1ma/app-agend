import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const AppointmentCard = ({ appointment, onCancelSuccess }) => {
  const navigation = useNavigation();
  
 const getStatusStyles = () => {
    const styles = {
      Confirmado: { bg: '#e6f7ee', text: '#10b981', icon: 'check-circle' },
      Pendente: { bg: '#fef3c7', text: '#d97706', icon: 'pending' },
      Cancelado: { bg: '#fee2e2', text: '#ef4444', icon: 'cancel' },
    };
    return styles[appointment.status] || { bg: '#e5e7eb', text: '#6b7280', icon: 'help' };
  };

  const statusStyles = getStatusStyles();

  const handleReschedule = () => {
    navigation.navigate('Home', { 
      appointmentToReschedule: appointment 
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Agendamento',
      `Tem certeza que deseja cancelar ${appointment.service}?`,
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim',
          onPress: () => {
            // Simulação de chamada à API
            setTimeout(() => {
              onCancelSuccess(appointment.id);
              Alert.alert('Sucesso', 'Agendamento cancelado com sucesso');
            }, 500);
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.service}>{appointment.service}</Text>
        
        <View style={[styles.statusContainer, { backgroundColor: statusStyles.bg }]}>
          <MaterialIcons 
            name={statusStyles.icon} 
            size={16} 
            color={statusStyles.text} 
            style={styles.statusIcon}
          />
          <Text style={[styles.statusText, { color: statusStyles.text }]}>
            {appointment.status}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <MaterialIcons name="person" size={16} color="#4b5563" />
          <Text style={styles.detailText}>{appointment.professional}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="calendar-today" size={16} color="#4b5563" />
          <Text style={styles.detailText}>
            {new Date(appointment.date).toLocaleDateString('pt-BR', {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialIcons name="access-time" size={16} color="#4b5563" />
          <Text style={styles.detailText}>{appointment.time}</Text>
        </View>
      </View>

      {appointment.status !== 'Cancelado' && (
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
            onPress={handleCancel}
          >
            <MaterialIcons name="close" size={16} color="#b91c1c" />
            <Text style={[styles.actionText, { color: '#b91c1c' }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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