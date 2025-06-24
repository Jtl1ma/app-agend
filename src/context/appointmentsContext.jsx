//import { id } from 'date-fns/locale';
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import axios from "axios";

export const AppointmentsContext = createContext();

export function AppointmentsProvider(props) {
  const [appointments, setAppointments] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
 // const [loadMoreAppointment, setLoadMoreAppointment] = useState();
  const [loadAppointments, setLoadAppointments] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const pageSize = 10;

 const loadAppointment = useCallback(async(pageNumber = 1, isRefresh = false)=>{
    if ((loadingMore && !isRefresh) || (refreshing && isRefresh)) return;

    isRefresh ? setRefreshing(true) : setLoadingMore(true);

    try {
      const params = {
        page: pageNumber,
        limit: pageSize,
        // outros parametros de filtro podem ser add aqui  
      };
      
      const response = await axios.get('https://test-api.loca.lt/agendamentos/pag', { params });
      const newAppointments = response.data.agendamentos || [];
      const totalCount = response.data.totals || 0;
      /*const totalPag = response.data.totalPages || 0;
      const totalDay = response.data.totalsDia || 0;
      const totalMonth = response.data.totalsMes || 0;*/
     
      /*
      prev_page: parseInt(page as string) - 1 >= 1 ? parseInt(page as string) - 1 : false,
                // URL da próxima página
                next_page: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
                // Última página
                lastPage,
                totals, // Total de itens encontrados
                totalsDia: totalAgendDia.rows[0].count,
                totalsMes: totalAgendMes.rows[0].count,
               
                totalPages: Math.ceil(totals / parseInt(limit as string)),
                faturamento: , 
      */

      if (isRefresh || pageNumber === 1) {
        setAppointments(newAppointments);
      }else {
        setAppointments(prev => [...prev, ...newAppointments]);
      }

      setHasMore(pageNumber * pageSize < totalCount);
      setPage(pageNumber);
      
      // Atualiza o cursor se sua API usar essa abordagem
     /* if (response.data.nextCursor) {
        setCursor(response.data.nextCursor);
      }*/

    } catch (error) {
      console.error('Erro ao buscar agendametos:', error);
      Alert.alert('Erro', 'Não foi possivel carregar os dados');
    } finally {
      isRefresh ? setRefreshing(false) : setLoadingMore(false);
    }
  }, [loadingMore, refreshing]);
  
 
  // Carregar mais itens (proxima pag)
 /*const loadMoreAppointment = useCallback(async () => {
  await loadAppointments(page + 1);

 }, [page, loadAppointments]);*/

 // Atualiza a lista (refresh)
 const refreshAppointments = useCallback(async ()=> {
  await loadAppointments(1, true);
 }, [loadAppointments]);
 
 // Carregar a primeira pag ao iniciar
 const initializeAppointments = useCallback(async ()=> {
  if (appointments.length === 0) {
    await loadAppointments(1);
  }
 }, [appointments.length, loadAppointments]);

 // Adiciona um novo agendamento
 const addAppointment = async (newAppointment) => {
  try {
   // const res = await axios.post('https://test-api.loca.lt/agendamento', newAppointment);
   // setAppointments(prev => [res.data, ...prev]);
   // return res.data;
   setAppointments([...appointments, {
      ...newAppointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }]);
Alert.alert('Sucesso', 'Agendamento adicionado com sucesso!');
    return newAppointment;
  } catch (error) {
    console.error('Erro ao adicionar agendameto:', error);
    throw error;
  }
};

 const fetchAppointments = async ({ status, client, tema, dia, mes,limit = 5, page = 1 }) => {
    try {
    const params = new URLSearchParams({ limit, status, client, tema, dia, mes, page });
    const response = await axios.get(`/https://test-api.loca.lt/agendamentos/pag?${params}`);
  
      if (response.status !== 200) {
        throw new Error('Erro ao buscar agendamentos');
      }

      const data = response.data;
      const totalCount = Number(response.headers['x-total-count']);

      if (pageNumber === 1) {
        setAppointments(data);
      } else {
        setAppointments(prev => [...prev, ...data]);
      }

      setHasMore(pageNumber * pageSize < totalCount);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
    return response.data;
  };

  const loadMore = () => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAppointments(nextPage);
    }
  }; 

/*  const fetchAppointments = async () => {
    if (loading) {
      return <p>Loading...</p>;
    }
    
    if (error) {
      return <p className="error">{error.message}</p>;
    }
    if (!user) return;
    setLoading(true);
    try {
      // Simulação de chamada à API
      const mockAppointments = [
      
    {
      "id": 1,
      "date": "2023-06-15T10:00:00",
      "service": "Consulta Médica",
      "status": "Confirmado",
      "client": "Maria",
      "contato": "11999999999",
      "modelo": "Simples",
      "tema": "Saúde",
      "valor": "300.00",
      "sinal": "100.00",
      "resta": "200.00",
      "atendente": "João",
      "local": "Clínica A",
      "observacao": "Chegar 15 minutos antes"
},  
      
      ];
      setAppointments(mockAppointments);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possivel carregar os dados!');
    } finally {
      setLoading(false)
    }
  setAppointments([]);
  }*/

  // Cancelar agendamento  
  const cancelAppointment = async(id) => {
    try {
      await axios.delete(`https://test-api.loca.lt/agendamento/${id}`);
      setAppointments(prev => prev.filter(app => app.id !== id));
      Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
      console.log('Agendamento cancelado com sucesso:', id);
    } catch (error) {
      console.error('Erro ao buscar agendametos:', error);
      Alert.alert('Erro', 'Não foi possivel cancelar o agendamento');
      throw error;      
    }
  };
  // Atualizar agendamento existente
  const updateAppointment = useCallback(async (id, updatedData) => {
    try {
      const response = await axios.patch(`https://test-api.loca.lt/update/agenda/${id}`, updatedData);
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, ...response.data } : app));
      console.log('Agendamento atualizado com sucesso:', response.data);
      
      /*const updatedAppointments = appointments.map(app => 
        app.id === id ? { ...app, ...updatedData, updatedAt: new Date().toISOString() } : app
      );*/
     // setAppointments(updatedAppointments);
     // await saveAppointments(updatedAppointments);
     
      return response.data;
    } catch (err) {
      console.error('Failed to update agendamento:', err);
      Alert.alert('Erro', 'Não foi possível atualizar o agendamento');
      throw err;
    }
  }, []);

  // Busca um agendamento por ID
  const getAppointmentById = useCallback((id) => {
    return appointments.find(app => app.id === id);
  }, [appointments]);

  // Filtra agendamentos por status
  const filterAppointmentsByStatus = useCallback((status) => {
    return appointments.filter(app => app.status === status);
  }, [appointments]);

// Deletar um agendamento 
 /* const deleteAppointment = async (id) => {
    setLoading(true);
    try {
      setAppointments(prev => prev.filter(app => app.id !== id));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAppointment();
    }
  }, [user]);*/
  useEffect(() => {
     loadAppointment();
  }, []);

  return (
    <AppointmentsContext.Provider 
      value={{ 
        appointments,
        setAppointments,
        loadingMore, 
        refreshing, 
        hasMore, 
        page, 
        addAppointment, 
        cancelAppointment, 
        updateAppointment, 
        getAppointmentById, 
        filterAppointmentsByStatus, 
        refreshAppointments, 
        initializeAppointments
      }}>
      {props.children}
    </AppointmentsContext.Provider>
  );
}
/*export function useAppointments() {
  return useContext(AppointmentsContext);
}
//export default AppointmentsProvider;*/