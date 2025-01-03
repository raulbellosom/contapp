import React, { Suspense, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import LoadingModal from '../components/loadingModal/LoadingModal';
import Sidebar from '../components/sidebar/Sidebar';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/login/Login';
import Profile from '../pages/profile/Profile';
import Users from '../pages/users/Users';
import NotFound from '../pages/notFound/NotFound';
import Roles from '../pages/roles/Roles';
import Dashboard from '../pages/dashboard/Dashboard';
import Account from '../pages/account/Account';
import Banks from '../pages/bank/Banks';
import Transaction from '../pages/transaction/Transaction';
import Category from '../pages/category/Category';

const AppRouter = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoadingModal loading={true} />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingModal loading={true} />}>
        {user ? <AuthorizedRoute user={user} /> : <UnauthorizedRoute />}
      </Suspense>
    </Router>
  );
};

const AuthorizedRoute = ({ user }) => {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <>
            <Sidebar>
              <Routes>
                <Route element={<ProtectedRoute user={user} />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/profile-settings" element={<Profile />} />
                  <Route path="/roles" element={<Roles />} />
                  <Route path="/accounts" element={<Account />} />
                  <Route path="/banks" element={<Banks />} />
                  <Route path="/categories" element={<Category />} />
                  <Route path="/transactions" element={<Transaction />} />
                  <Route
                    path="/login"
                    element={
                      <>
                        <Navigate to={'/'} replace={true} />
                      </>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Sidebar>
          </>
        }
      />
    </Routes>
  );
};

const UnauthorizedRoute = () => {
  return (
    <Routes>
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRouter;
