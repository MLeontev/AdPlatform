import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import '@/styles/App.css';
import { DataProvider } from '@/components/DataProvider.tsx';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider.tsx';
import { ThemeModeToggle } from '@/components/ThemeModToggle.tsx';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import { refreshToken } from './api/auth';

function App() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const result = await refreshToken();
      if (result) {
        setAuthData(result);
      } else {
        logout();
      }
    };

    init();
  }, []);

  return (
    <>
      <div className="App max-w-[1920px] m-auto">
        <DataProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark h-[100px]">
              <ThemeModeToggle />
            </nav>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </ThemeProvider>
        </DataProvider>
        <Toaster />
      </div>
    </>
  );
}

export default App;
