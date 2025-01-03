import React from 'react';
import AuthProvider from './AuthProvider';
import UserProvider from './UserProvider';
import LoadingProvider from './LoadingProvider';
import RoleProvider from './RoleProvider';
import PermissionProvider from './PermissionProvider';
import AccountProvider from './AccountProvider';
import BankProvider from './BankProvider';
import TransactionProvider from './TransactionProvider';
import CategoryProvider from './CategoryProvider';

const SecurityProvider = ({ children }) => (
  <AuthProvider>
    <RoleProvider>
      <PermissionProvider>{children}</PermissionProvider>
    </RoleProvider>
  </AuthProvider>
);

const DataProvider = ({ children }) => (
  <UserProvider>
    <AccountProvider>
      <BankProvider>
        <CategoryProvider>
          <TransactionProvider>{children}</TransactionProvider>
        </CategoryProvider>
      </BankProvider>
    </AccountProvider>
  </UserProvider>
);

const AppProvider = ({ children }) => (
  <LoadingProvider>
    <SecurityProvider>
      <DataProvider>{children}</DataProvider>
    </SecurityProvider>
  </LoadingProvider>
);

export default AppProvider;
