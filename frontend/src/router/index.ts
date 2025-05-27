import DefaultPage from '../pages/DefaultPage';
import { AdFeedPage } from '@/pages/AdFeedPage.tsx';
import { FormPage } from '@/pages/FormPage.tsx';
import { AdPage } from '@/pages/AdPage.tsx';

export const privateRoutes = [
  { path: '/defaultpage', component: DefaultPage },
  { path: '/adform', component: FormPage },
  { path: '/adfeed', component: AdFeedPage },
  { path: '/ad', component: AdPage },
];

export const publicRoutes = [{ path: '/defaultpage', component: DefaultPage }];
