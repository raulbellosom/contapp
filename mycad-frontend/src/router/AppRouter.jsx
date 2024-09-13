import React, { Suspense, lazy, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LoadingModal from '../components/loadingModal/LoadingModal';
import Sidebar from '../components/sidebar/Sidebar';
import Login from '../pages/login/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import Vehicles from '../pages/vehicles/Vehicles';
import NotFound from '../pages/notFound/NotFound';
import CreateVehicle from '../pages/vehicles/CreateVehicle';
import UpdateVehicle from '../pages/vehicles/UpdateVehicle';
import ViewVehicle from '../pages/vehicles/ViewVehicle';
import Catalogs from '../pages/vehicles/catalogs/Catalogs';
import Account from '../pages/account/Account';

import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  const { user } = useContext(AuthContext);

  return (
    // <div className="min-h-dvh h-screen overflow-hidden w-full">
    <>
      <Router>
        <Suspense fallback={<LoadingModal loading={true} />}>
          {user ? <AuthorizedRoute user={user} /> : <UnauthorizedRoute />}
        </Suspense>
      </Router>
    </>
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
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/vehicles/create" element={<CreateVehicle />} />
                  <Route
                    path="/vehicles/edit/:id"
                    element={<UpdateVehicle />}
                  />
                  <Route path="/vehicles/view/:id" element={<ViewVehicle />} />
                  <Route path="/catalogs" element={<Catalogs />} />
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
