import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AccountContext from '../context/AccountContext';
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
} from '../services/main.api';
import Notifies from '../components/Notifies/Notifies';

export const useAccounts = () => {
  const { state, dispatch } = useContext(AccountContext);
  const queryClient = useQueryClient();

  // Fetch all accounts
  const fetchAccounts = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
    onSuccess: (data) => {
      dispatch({ type: 'SET_ACCOUNTS', payload: data });
    },
  });

  // Fetch a single account
  const fetchAccountById = async (id) => {
    return await getAccountById(id);
  };

  // Create a new account
  const createNewAccount = useMutation({
    mutationFn: createAccount,
    onSuccess: (newAccount) => {
      dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      Notifies('success', 'Cuenta creada correctamente');
    },
    onError: (error) => {
      Notifies('error', 'Error al crear la cuenta');
    },
  });

  // Update an account
  const modifyAccount = useMutation({
    mutationFn: updateAccount,
    onSuccess: (updatedAccount) => {
      dispatch({ type: 'UPDATE_ACCOUNT', payload: updatedAccount });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      Notifies('success', 'Cuenta actualizada correctamente');
    },
    onError: (error) => {
      Notifies('error', 'Error al actualizar la cuenta');
    },
  });

  // Delete an account
  const removeAccount = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (id) => {
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      Notifies('success', 'Cuenta eliminada correctamente');
    },
    onError: (error) => {
      Notifies('error', 'Error al eliminar la cuenta');
    },
  });

  return {
    accounts: state.accounts,
    fetchAccounts,
    fetchAccountById,
    createNewAccount,
    modifyAccount,
    removeAccount,
  };
};
