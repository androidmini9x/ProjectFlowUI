import { Suspense, lazy } from 'react';
import { useRoutes, Navigate } from 'react-router';

import PrivateRoute from './components/privateRoute';
import DashboardLayout from '../common/layouts/dashboard';

const LoginPage = lazy(() => import('../pages/Login'));
const RegisterPage = lazy(() => import('../pages/Register'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

function Router() {
  const routes = useRoutes([
    {
      element: (
        <PrivateRoute>
          <DashboardLayout>
            <Suspense>
              <h1>Hello, World</h1>
            </Suspense>
          </DashboardLayout>
        </PrivateRoute>
      ),
      index: true,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: '404',
      element: <NotFoundPage />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

export default Router;
