import { RouteObject } from 'react-router-dom';
import Forgot from '../views/auth/forgot';
import Login from '../views/auth/login'
import Reset from '../views/auth/reset';

const routes: RouteObject[] = [
  { path: '/auth', element: <Login /> },
  { path: '/auth/login', element: <Login /> },
  { path: '/auth/forgot', element: <Forgot /> },
  { path: '/auth/reset', element: <Reset /> },
];

export default routes;
