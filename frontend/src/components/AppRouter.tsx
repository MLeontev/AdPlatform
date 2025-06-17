import { useAuthStore } from '@/store/authStore';
import { Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '../router/index';
import AdFeed from './AdFeed';
import { Layout } from './Layout';

const AppRouter = () => {
  const isAuth = useAuthStore((state) => state.isAuth);

  return (
    <Routes>
      <Route element={<Layout />}>
        {isAuth
          ? privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))
          : publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}
        <Route path="*" element={<AdFeed />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
