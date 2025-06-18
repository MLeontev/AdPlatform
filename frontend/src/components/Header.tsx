import { useAuthStore } from '@/store/authStore';
import { Link, useLocation } from 'react-router-dom';
import { ThemeModeToggle } from './ThemeModToggle';
import { Button } from './ui/button';

const Header = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const userId = useAuthStore((state) => state.id);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-4">
            <Button
              asChild
              variant={location.pathname === '/adfeed' ? 'secondary' : 'ghost'}
            >
              <Link to="/adfeed">Лента объявлений</Link>
            </Button>
            {isAuth && (
              <Button
                asChild
                variant={
                  location.pathname === '/adform' ? 'secondary' : 'ghost'
                }
              >
                <Link to="/adform">Создать объявление</Link>
              </Button>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isAuth ? (
            <>
              <Button
                asChild
                variant={
                  location.pathname === '/login' ? 'secondary' : 'default'
                }
              >
                <Link to={`/profile?id=${userId}`}>Профиль</Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant={
                  location.pathname === '/login' ? 'secondary' : 'outline'
                }
              >
                <Link to="/login">Войти</Link>
              </Button>
              <Button
                asChild
                variant={
                  location.pathname === '/register' ? 'secondary' : 'default'
                }
              >
                <Link to="/register">Зарегистрироваться</Link>
              </Button>
            </>
          )}
          <ThemeModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
