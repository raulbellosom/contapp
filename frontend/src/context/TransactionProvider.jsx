import React, { useReducer, useEffect } from 'react';
import TransactionContext from './TransactionContext';
import transactionReducer from './TransactionReducer';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../services/main.api';

export const TransactionProvider = ({ children }) => {
  const initialState = {
    transactions: [],
  };

  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const { data: transactions, isSuccess } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  useEffect(() => {
    if (isSuccess && transactions) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    }
  }, [isSuccess, transactions]);
  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
