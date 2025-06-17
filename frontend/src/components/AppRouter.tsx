import DefaultPage from '@/pages/DefaultPage';
import { Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '../router/index';
import { useAuthStore } from '@/store/authStore';

const AppRouter = () => {
  const isAuth = useAuthStore((state) => state.isAuth);

  return isAuth ? (
    <Routes>
      {privateRoutes.map((route) => (
        <Route Component={route.component} path={route.path} />
      ))}
      <Route path="*" element={<DefaultPage />} />
    </Routes>
  ) : (
    <Routes>
      {publicRoutes.map((route) => (
        <Route Component={route.component} path={route.path} />
      ))}
      <Route path="*" element={<DefaultPage />} />
    </Routes>
  );
};

export default AppRouter;
