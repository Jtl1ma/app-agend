import React, { useState, useContext } from 'react';
import { Alert, Image, View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/authContext';
import icons from '../consts/icons';
//import { useAuth } from '../context/authContext';
//import api from '../services/api';
//import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useContext(AuthContext);

  const handleLogin = async () => {
    await login(email, password);
     navigation.replace('Main');
   /* try {
          const res = await axios.post('https://test-api.loca.lt/login',
             { email, password });
          if (res.data) {
            Alert.alert(res.data);
          }
          //const { token, dados } = res.data;
        } catch (error) {
          console.error('Erro ao fazer login:', error);
          throw new Error('Login falhou');      
        }*/
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewImg}>
      <Image source={icons.logo} style={styles.logo} />
      </View>
      <Text style={styles.title}>Agendamento</Text>
      <Text style={styles.texte}>Digite seu E-mail:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.texte}>Digite seu Senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <Button title="Entrar" onPress={handleLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000'
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    color: '#fff',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  logo: {
    width: 240,
    height: 180,
    marginBottom: 30,
    paddingBottom: 25
  },
  viewImg: {
    marginBottom: 40,
    alignItems: 'center',
    
  },
  texte: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  } 
});

export default LoginScreen;