import { FlatList, Image, Text, View, StyleSheet } from "react-native";
import { AppointmentsContext } from "../context/appointmentsContext.jsx";
import { useContext } from "react";
import AppointmentCard from "../components/appointmentCard.jsx";
import icons from "../consts/icons.js";
import EditCard from "../components/editCard.jsx";


function Servico(props) {

    const { filteredAppointments } = useContext(AppointmentsContext);
  
    const idApp = props.route.params.id;
    const clientApp = props.route.params.client;
    const contApp = props.route.params.contato;

      
    return( <View style={styles.container}>
     
    <View style={styles.banner}>
        <Image source={idApp == "M" ? icons.cliente : icons.clientefeliz} />
        <Text style={styles.text}>Cliente: {clientApp} </Text>
        <Text style={styles.text}>Contato: {contApp} </Text>
    </View>

        <FlatList data={filteredAppointments}
         keyExtractor={(serv) => serv.id} 
            showsVerticalScrollIndicator={false}
            renderItem={(item)=>{
                return  <AppointmentCard   />
            }} />
        </View>
    )
    
}
const styles = StyleSheet.create({
 
  container: {
    flex: 1,
   // padding: 15,
    backgroundColor: '#f5f5f5',
  },
   banner: {
        alignItems: "center",
        backgroundColor: "blue",
        justifyContent: "center",
        paddingTop: 12,
        paddingBottom: 25
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
  text : {
       // textAlign: TEXT.align,
       color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 8
    }
});

export default Servico;