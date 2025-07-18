//import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


const MenuScreen = ({ navigation }) => {
  
  
  
    return (
    <>
    <View style={styles.card}>
    <View style={styles.cardHeader}>
            
            <View style={[styles.statusContainer, { backgroundColor: "" }]}>
              <MaterialIcons name="content-paste-search" 
                size={16} color="#000" style={styles.statusIcon}
              />
              <Text style={[styles.statusText]}> Menu
              </Text>
            </View>
          </View>
    
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
                <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
              <MaterialIcons name="home" size={25} color="#4b5563" />
              <Text style={styles.detailText}>Inicio</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.detailRow}>
                <TouchableOpacity onPress={() => navigation.navigate('Agendar')}>
              <MaterialIcons name="calendar-today" size={25} color="#4b5563" />
              <Text style={styles.detailText}>Agendar</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.detailRow}>
                <TouchableOpacity onPress={() => navigation.navigate('Atualizar')}>
              <MaterialIcons name="search" size={25} color="#4b5563" />
              <Text style={styles.detailText}>Buscar</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.detailRow}>
                <TouchableOpacity onPress={() => navigation.navigate('Agendamentos')}>
              <MaterialIcons name="add-home" size={25} color="#4b5563" />
              <Text style={styles.detailText}>Agendamentos</Text>
                </TouchableOpacity>
            </View>
            
          </View>
          </View>
          </>
  );
};

const styles = StyleSheet.create({
  
    
  card: {
  
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
   // marginBottom: 12,
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
  
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
  flexDirection: 'row',
    marginRight: 4,
  },
  statusText: {
  flexDirection: 'row',
    fontSize: 13,
    fontWeight: '500',
  },
  detailsContainer: {
    //flexDirection: 'row',
   // marginBottom: 14,
   // paddingHorizontal:20
  },
  detailRow: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    
  },
  detailText: {
    flexDirection: 'row',
   // marginLeft: 30,
    fontSize: 14,
    color: '#4b5563',
    paddingHorizontal: 25,
    
  },
  
});

export default MenuScreen;