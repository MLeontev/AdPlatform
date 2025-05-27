import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import '@/styles/App.css';
import { DataProvider } from '@/components/DataProvider.tsx';

function App() {
  return (
    <>
      <div className="App max-w-[1920px] m-auto">
        <DataProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </DataProvider>
      </div>
    </>
  );
}

export default App;
