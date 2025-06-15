import { DataProvider } from '@/components/DataProvider.tsx';
import { ThemeModeToggle } from '@/components/ThemeModToggle.tsx';
import { ThemeProvider } from '@/components/ThemeProvider.tsx';
import '@/styles/App.css';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { refreshToken } from './api/auth';
import AppRouter from './components/AppRouter';
import { useAuthStore } from './store/authStore';

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
