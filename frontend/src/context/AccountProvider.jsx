import React, { useReducer, useEffect } from 'react';
import AccountContext from './AccountContext';
import accountReducer from './AccountReducer';
import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '../services/main.api';

const AccountProvider = ({ children }) => {
  const initialState = {
    accounts: [], // Estado inicial vacío
  };

  const [state, dispatch] = useReducer(accountReducer, initialState);

  // Usa React Query para cargar las cuentas al inicio
  const { data: accounts, isSuccess } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });

  // Efecto para actualizar el estado global cuando se cargan las cuentas
  useEffect(() => {
    if (isSuccess && accounts) {
      dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
    }
  }, [isSuccess, accounts]);

  return (
    <AccountContext.Provider value={{ state, dispatch }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
