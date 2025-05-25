import FormPage from '@/pages/FormPage';
import DefaultPage from '../pages/DefaultPage';
import AdFeedPage from '@/pages/AdFeedPage.tsx';

export const privateRoutes = [
  { path: '/defaultpage', component: DefaultPage },
  { path: '/adform', component: FormPage },
  { path: '/adfeed', component: AdFeedPage },
];

export const publicRoutes = [{ path: '/defaultpage', component: DefaultPage }];
