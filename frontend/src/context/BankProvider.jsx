import React, { useReducer, useEffect } from 'react';
import BankContext from './BankContext';
import bankReducer from './BankReducer';
import { useQuery } from '@tanstack/react-query';
import { getBanks } from '../services/main.api';

const BankProvider = ({ children }) => {
  const initialState = {
    banks: [],
  };

  const [state, dispatch] = useReducer(bankReducer, initialState);

  const { data: banks, isSuccess } = useQuery({
    queryKey: ['banks'],
    queryFn: getBanks,
  });

  useEffect(() => {
    if (isSuccess && banks) {
      dispatch({ type: 'SET_BANKS', payload: banks });
    }
  }, [isSuccess, banks]);

  return (
    <BankContext.Provider value={{ state, dispatch }}>
      {children}
    </BankContext.Provider>
  );
};

export default BankProvider;
