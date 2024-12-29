import { useContext } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import BankContext from '../context/BankContext';
import {
  getBanks,
  createBank,
  updateBank,
  deleteBank,
} from '../services/main.api';

export const useBanks = () => {
  const { state, dispatch } = useContext(BankContext);
  const queryClient = useQueryClient();

  const banks = state.banks;

  // Crear un banco
  const createNewBank = useMutation({
    mutationFn: createBank,
    onSuccess: (newBank) => {
      dispatch({ type: 'ADD_BANK', payload: newBank });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
    },
  });

  // Actualizar un banco
  const modifyBank = useMutation({
    mutationFn: updateBank,
    onSuccess: (updatedBank) => {
      dispatch({ type: 'UPDATE_BANK', payload: updatedBank });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
    },
  });

  // Eliminar un banco
  const removeBank = useMutation({
    mutationFn: deleteBank,
    onSuccess: (id) => {
      dispatch({ type: 'DELETE_BANK', payload: id });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
    },
  });

  return {
    banks,
    createNewBank,
    modifyBank,
    removeBank,
  };
};
