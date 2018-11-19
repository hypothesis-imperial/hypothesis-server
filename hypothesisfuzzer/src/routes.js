import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import('./views/Dashboard'),
  loading: Loading,
});

const Homepage = Loadable({
  loader: () => import('./views/Homepage'),
  loading: Loading,
});

const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/homepage', exact: true, component: Homepage },
  { path: '/dashboard/:id', exact: true, name: 'Dashboard', component: Dashboard },
];

export default routes;
