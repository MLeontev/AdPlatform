import { login } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { LoginDto } from '@/types/DTOs/loginDto';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>();

  const onSubmit = async (data: LoginDto) => {
    const result = await login(data);
    if (result) {
      setAuthData(result);
      navigate('/');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start justify-between w-fit h-fit p-6 rounded-lg border shadow-md mx-auto mt-10"
    >
      <Label className="text-2xl font-bold mb-6 ml-[10px]">Вход</Label>

      <Label className="ml-[10px]">Email</Label>
      <Input
        className="m-[10px] w-[300px]"
        type="email"
        placeholder="example@mail.com"
        {...register('login', {
          required: 'Email обязателен',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Введите корректный email',
          },
        })}
      />
      {errors.login && (
        <p className="text-red-500 ml-[10px] text-sm">{errors.login.message}</p>
      )}

      <Label className="ml-[10px]">Пароль</Label>
      <Input
        className="m-[10px] w-[300px]"
        type="password"
        placeholder="Ваш пароль"
        {...register('password', {
          required: 'Пароль обязателен',
          minLength: {
            value: 6,
            message: 'Минимум 6 символов',
          },
        })}
      />
      {errors.password && (
        <p className="text-red-500 ml-[10px] text-sm">
          {errors.password.message}
        </p>
      )}

      <Button type="submit" className="m-[10px] w-[300px]">
        Войти
      </Button>

      {error && <p className="text-red-500 ml-[10px] text-sm mt-2">{error}</p>}

      <div className="flex justify-center mt-4 w-full">
        <p className="text-gray-700">
          Нет аккаунта —{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            зарегистрируйтесь
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
