import 'react-native-gesture-handler';
import { AuthProvider } from './src/context/authContext';
import { AppointmentsProvider } from './src/context/appointmentsContext';
import AppNavigator from './src/services/appNavigator'


export default function App() {
  return (
    <AuthProvider>
      <AppointmentsProvider>
        <AppNavigator />
      </AppointmentsProvider>
    </AuthProvider>
  );
}