import React, { useReducer } from 'react';
import AccountContext from './AccountContext';
import accountReducer from './AccountReducer';

const AccountProvider = ({ children }) => {
  const initialState = {
    accounts: [],
  };

  const [state, dispatch] = useReducer(accountReducer, initialState);

  return (
    <AccountContext.Provider value={{ state, dispatch }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
