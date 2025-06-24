import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
//import AppointmentCard from '../components/appointmentCard';


// Screens telas
import HomeScreen from "../pages/homeScreen";
import ScheduleScreen from "../pages/scheduleScrenn";
import AppointmentsScreen from "../pages/appointmentsScreen";
import ProfileScreen from "../pages/profileScreen";
import LoginScreen from "../pages/loginScreen";
//import EditAppointmentScreen from "../pages/editAppointmentScreen";
import UpdateAppointments from "../pages/updateAppointments";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Agendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Agendamentos') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Update') {
            iconName = focused ? 'document' : 'document-text-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Agendar" component={ScheduleScreen} />
      <Tab.Screen name="Update" component={UpdateAppointments} />
      {/*<Tab.Screen name="Editar" component={EditAppointmentScreen} />*/}
      <Tab.Screen name="Agendamentos" component={AppointmentsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen 
          name="Main" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
        </NavigationContainer>
    );
}