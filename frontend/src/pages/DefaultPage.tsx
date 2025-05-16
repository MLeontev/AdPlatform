import { useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function DefaultPage() {
  const [count, setCount] = useState(0);

  const [message, setMessage] = useState('');

  const handleFetch = async () => {
    try {
      const response = await fetch('/api/test');
      if (!response.ok) throw new Error('Ошибка запроса');
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      if (error instanceof Error) {
        setMessage('Ошибка: ' + error.message);
      } else {
        setMessage('Неизвестная ошибка');
      }
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <Button onClick={handleFetch}>Сделать fetch на /api/test</Button>
        {message && <p>Ответ: {message}</p>}
        <Link to="/adform">
          <Button>Форма объявления</Button>
        </Link>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default DefaultPage;
