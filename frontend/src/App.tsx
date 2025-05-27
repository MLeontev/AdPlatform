import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import '@/styles/App.css';
import { DataProvider } from '@/components/DataProvider.tsx';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider.tsx';
import { ThemeModeToggle } from '@/components/ThemeModToggle.tsx';

function App() {
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
