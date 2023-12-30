import { Suspense, lazy } from 'react';
import { useRoutes, Navigate, Outlet } from 'react-router';

import PrivateRoute from './components/privateRoute';
import DashboardLayout from '../common/layouts/dashboard';

const LoginPage = lazy(() => import('../pages/Login'));
const RegisterPage = lazy(() => import('../pages/Register'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));
const HomePage = lazy(() => import('../pages/Home'));
const ProjectPage = lazy(() => import('../pages/Project'));
const ProjectCreatePage = lazy(() => import('../pages/Project/ProjectCreate'));
const ProjectEditPage = lazy(() => import('../pages/Project/ProjectEdit'));
const ProjectDetailPage = lazy(() => import('../pages/Project/ProjectDetail'));
const TaskCreatePage = lazy(() => import('../pages/Task/TaskCreate'));
const TaskEditPage = lazy(() => import('../pages/Task/TaskEdit'));
const TaskDetailPage = lazy(() => import('../pages/Task'));
const InvitePage = lazy(() => import('../pages/Invite'));

function Router() {
  const routes = useRoutes([
    {
      element: (
        <PrivateRoute>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </PrivateRoute>
      ),
      children: [
        { element: <HomePage />, index: true },
        {
          path: 'project',
          children: [
            { element: <ProjectPage />, index: true },
            { path: 'create', element: <ProjectCreatePage /> },
            { path: ':id', element: <ProjectDetailPage /> },
            { path: ':id/invite', element: <InvitePage /> },
            { path: ':id/edit', element: <ProjectEditPage /> },
            { path: ':id/task/create', element: <TaskCreatePage /> },
            { path: ':id/task/:task_id', element: <TaskDetailPage /> },
            { path: ':id/task/:task_id/edit', element: <TaskEditPage /> },
          ],
        },
      ],
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
