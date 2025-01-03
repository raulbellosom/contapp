import { useContext } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import TransactionContext from '../context/TransactionContext';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
} from '../services/main.api';
import Notifies from '../components/Notifies/Notifies';

export const useTransactions = () => {
  const { state, dispatch } = useContext(TransactionContext);
  const queryClient = useQueryClient();

  // Obtener todas las transacciones
  const fetchTransactions = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    onSuccess: (data) => {
      dispatch({ type: 'SET_TRANSACTIONS', payload: data });
    },
    onError: (error) => {
      Notifies('error', 'Error al obtener las transacciones');
    },
  });

  // Obtener una transacción por ID
  const fetchTransactionById = async (id) => {
    return await getTransactionById(id);
  };

  // Crear una transacción
  const createNewTransaction = useMutation({
    mutationFn: createTransaction,
    onSuccess: (newTransaction) => {
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      Notifies('success', 'Transacción creada correctamente');
    },
    onError: (error) => {
      Notifies('error', 'Error al crear la transacción');
    },
  });

  // Actualizar una transacción
  const modifyTransaction = useMutation({
    mutationFn: updateTransaction,
    onSuccess: (updatedTransaction) => {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      Notifies('success', 'Transacción actualizada correctamente');
    },
    onError: (error) => {
      Notifies('error', 'Error al actualizar la transacción');
    },
  });

  // Eliminar una transacción
  const removeTransaction = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: (id) => {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      Notifies('success', 'Transacción eliminada correctamente');
    },
    onError: (error) => {
      Notifies('error', 'Error al eliminar la transacción');
    },
  });

  return {
    transactions: state.transactions,
    fetchTransactions,
    fetchTransactionById,
    createNewTransaction,
    modifyTransaction,
    removeTransaction,
  };
};
