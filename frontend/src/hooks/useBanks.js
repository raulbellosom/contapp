import { useContext } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import BankContext from '../context/BankContext';
import {
  getBanks,
  createBank,
  updateBank,
  deleteBank,
  getBankById,
} from '../services/main.api';
import Notifies from '../components/Notifies/Notifies';

export const useBanks = () => {
  const { state, dispatch } = useContext(BankContext);
  const queryClient = useQueryClient();

  // Obtener todos los bancos
  const fetchBanks = useQuery({
    queryKey: ['banks'],
    queryFn: getBanks,
    onSuccess: (data) => {
      dispatch({ type: 'SET_BANKS', payload: data });
    },
  });

  // Obtener un banco por id
  const fetchBankById = async (id) => {
    return await getBankById(id);
  };

  // Crear un banco
  const createNewBank = useMutation({
    mutationFn: createBank,
    onSuccess: (newBank) => {
      dispatch({ type: 'ADD_BANK', payload: newBank });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      Notifies('success', 'Banco creado correctamente');
    },
    onError: (error) => {
      Notifies('error', 'Error al crear el banco');
    },
  });

  // Actualizar un banco
  const modifyBank = useMutation({
    mutationFn: updateBank,
    onSuccess: (updatedBank) => {
      dispatch({ type: 'UPDATE_BANK', payload: updatedBank });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      Notifies('success', 'Banco actualizado correctamente');
    },
    onError: (error) => {
      Notifies('error', 'Error al actualizar el banco');
    },
  });

  // Eliminar un banco
  const removeBank = useMutation({
    mutationFn: deleteBank,
    onSuccess: (id) => {
      dispatch({ type: 'DELETE_BANK', payload: id });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      Notifies('success', 'Banco eliminado correctamente');
    },
    onError: (error) => {
      Notifies('error', 'Error al eliminar el banco');
    },
  });

  return {
    banks: state.banks,
    fetchBanks,
    fetchBankById,
    createNewBank,
    modifyBank,
    removeBank,
  };
};
