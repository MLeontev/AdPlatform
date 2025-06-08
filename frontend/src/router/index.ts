import DefaultPage from '../pages/DefaultPage';
import { AdFeedPage } from '@/pages/AdFeedPage.tsx';
import { FormPage } from '@/pages/FormPage.tsx';
import { AdPage } from '@/pages/AdPage.tsx';
import { LoginPage } from '@/pages/LoginPage.tsx';
import { AuthPage } from '@/pages/AuthPage.tsx';

export const privateRoutes = [
  { path: '/defaultpage', component: DefaultPage },
  { path: '/adform', component: FormPage },
  { path: '/adfeed', component: AdFeedPage },
  { path: '/ad', component: AdPage },
  { path: '/login', component: LoginPage },
  { path: '/auth', component: AuthPage },
];

export const publicRoutes = [{ path: '/defaultpage', component: DefaultPage }];
