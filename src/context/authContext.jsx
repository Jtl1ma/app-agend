import React, { createContext, useState } from 'react';
import api from '../services/api';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
   

  //Função login (simular autenticação)
  const login = async()=> {
   /* try {
      const res = await api.post('/login', { email, password });
      if (res.data) {
        Alert.alert(res.data);
      }
      //const { token, dados } = res.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Login falhou');      
    }*/
  
    //setLoading(true);
    // Simulação de login
    setTimeout(async() => {
      setUser({
        id: '1',
        name: 'Usuário Teste',
        email,
        password,
        token: 'fake-jwt-token',
        });
    // const res =   await axios.post(`https://test-api.loca.lt/login`, {email, password});
      //const { token, dados } = res.data;
      setLoading(false);
    },1000);

  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

/*export function useAuth() {
  return useContext(AuthContext);
}*/