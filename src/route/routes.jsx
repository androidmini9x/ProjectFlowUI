import { lazy } from 'react';
import { useRoutes, Navigate } from 'react-router';

const LoginPage = lazy(() => import('../pages/Login/index'));
const NotFoundPage = lazy(() => import('../pages/NotFound/index'));

function Router() {
  const routes = useRoutes([
    {
      path: 'login',
      element: <LoginPage />,
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
