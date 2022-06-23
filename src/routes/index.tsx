import { Navigate, RouteObject } from 'react-router-dom';
import AppLayout from '../components/layouts/app';
import AuthLayout from '../components/layouts/auth';
import AppRouter from './app';
import AuthRouter from './auth';

const routes = (isLogedIn: boolean) => {
  const items: RouteObject[] = [
    {
      path: '/app',
      element: isLogedIn ? <AppLayout /> : <Navigate to='/auth/login' state={{}} />,
      children: [...AppRouter],
    },
    {
      path: '/auth',
      element: !isLogedIn ? <AuthLayout /> : <Navigate to='/app' state={{}} />,
      children: [...AuthRouter],
    },
    {
      path: '*',
      element: <Navigate to='/app' />,
      children: [],
    },
  ];
  return items;
};

export default routes;
