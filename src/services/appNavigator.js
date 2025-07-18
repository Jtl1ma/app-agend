import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LayoutDashboard } from "lucide-react-native";
//import AppointmentCard from '../components/appointmentCard';

// Screens telas
import EditCard from '../components/editCard';
import HomeScreen from "../pages/homeScreen";
import ScheduleScreen from "../pages/scheduleScrenn";
import AppointmentsScreen from "../pages/appointmentsScreen";
import ProfileScreen from "../pages/profileScreen";
import LoginScreen from "../pages/loginScreen";
import ServiceAppointmentScreen from "../pages/serviceAppointmentScreen";
import UpdateAppointments from "../pages/updateAppointments";
import MenuScreen from "../pages/menuAppointScreen";
import Dashboard from "../pages/dashboard";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Painel') {
            iconName = focused ? 'apps-sharp' : 'apps-sharp';
          } else if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Agendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Agendamentos') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Atualizar') {
            iconName = focused ? 'document' : 'document-text-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'menu' : 'menu-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Painel" component={Dashboard} />
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Agendar" component={ScheduleScreen} />
      <Tab.Screen name="Atualizar" component={UpdateAppointments} />
      <Tab.Screen name="Agendamentos" component={AppointmentsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      
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
        
        <Stack.Screen name="serviceAppointment" component={ServiceAppointmentScreen} 
         options={{
            headerTitle: "Serviço Agendado",
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "blue"
            }
        }}/>
<Stack.Screen 
          name="EditCard" 
          component={EditCard} 
         options={{
            headerTitle: "***Agendado***",
            headerTitleAlign: "center",
           // headerShadowVisible: false,
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: "blue"
            }
        }}/>

      </Stack.Navigator>
        </NavigationContainer>
    );
}