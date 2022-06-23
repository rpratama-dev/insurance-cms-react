import { RouteObject } from 'react-router-dom';
import Resources from '../views/app/resources';
import Dashboard from '../views/app';

const routes: RouteObject[] = [
  {
    path: '/app',
    element: <Dashboard />,
    children: [],
  },
  {
    path: '/app/resources',
    element: <Resources />,
    children: [],
  },
];

export default routes;
