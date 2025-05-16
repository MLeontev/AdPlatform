import FormPage from '@/pages/FormPage';
import DefaultPage from '../pages/DefaultPage';

export const privateRoutes = [
  { path: '/defaultpage', component: DefaultPage },
  { path: '/adform', component: FormPage },
];

export const publicRoutes = [{ path: '/defaultpage', component: DefaultPage }];
