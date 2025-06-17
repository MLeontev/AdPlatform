import { AdFeedPage } from '@/pages/AdFeedPage.tsx';
import { AdPage } from '@/pages/AdPage.tsx';
import UserProfilePage from '@/pages/UserProfilePage.tsx';
//import DefaultPage from '@/pages/DefaultPage';
import { FormPage } from '@/pages/FormPage.tsx';
import { LoginPage } from '@/pages/LoginPage.tsx';
import { RegisterPage } from '@/pages/RegisterPage.tsx';

export const privateRoutes = [
  // { path: '/defaultpage', component: DefaultPage },
  { path: '/adform', component: FormPage },
  { path: '/adfeed', component: AdFeedPage },
  { path: '/ad', component: AdPage },
  { path: '/user', component: UserProfilePage },
];

export const publicRoutes = [
  // { path: '/defaultpage', component: DefaultPage },
  { path: '/adfeed', component: AdFeedPage },
  { path: '/ad', component: AdPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
];
