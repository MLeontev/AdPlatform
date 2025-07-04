import { reg } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { RegisterDto } from '@/types/DTOs/registerDto';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>();

  const onSubmit = async (data: RegisterDto) => {
    const result = await reg(data);
    if (result) {
      setAuthData(result);
      navigate('/');
    } else {
      setError('Ошибка регистрации');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start justify-between w-fit h-fit p-6 rounded-lg border shadow-md mx-auto mt-10"
    >
      <Label className="text-2xl font-bold mb-6 ml-[10px]">Регистрация</Label>

      <Label className="ml-[10px]">Имя</Label>
      <Input
        className="m-[10px] w-[300px]"
        {...register('name', {
          required: 'Имя обязательно',
          minLength: { value: 2, message: 'Минимум 2 символа' },
          maxLength: { value: 50, message: 'Максимум 50 символов' },
        })}
        placeholder="Имя"
      />
      {errors.name && (
        <p className="text-red-500 ml-[10px] text-sm">{errors.name.message}</p>
      )}

      <Label className="ml-[10px]">Фамилия</Label>
      <Input
        className="m-[10px] w-[300px]"
        {...register('surname', {
          required: 'Фамилия обязательна',
          minLength: { value: 2, message: 'Минимум 2 символа' },
          maxLength: { value: 50, message: 'Максимум 50 символов' },
        })}
        placeholder="Фамилия"
      />
      {errors.surname && (
        <p className="text-red-500 ml-[10px] text-sm">
          {errors.surname.message}
        </p>
      )}

      <Label className="ml-[10px]">Email</Label>
      <Input
        className="m-[10px] w-[300px]"
        type="email"
        {...register('email', {
          required: 'Email обязателен',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Введите корректный email',
          },
        })}
        placeholder="example@mail.com"
      />
      {errors.email && (
        <p className="text-red-500 ml-[10px] text-sm">{errors.email.message}</p>
      )}

      <Label className="ml-[10px]">Телефон</Label>
      <Input
        className="m-[10px] w-[300px]"
        type="tel"
        {...register('phone', {
          required: 'Телефон обязателен',
          pattern: {
            value: /^\+?[0-9\s\-()]{7,20}$/,
            message: 'Введите корректный номер телефона',
          },
        })}
        placeholder="+7 (999) 999-99-99"
      />
      {errors.phone && (
        <p className="text-red-500 ml-[10px] text-sm">{errors.phone.message}</p>
      )}

      <Label className="ml-[10px]">Пароль</Label>
      <Input
        className="m-[10px] w-[300px]"
        type="password"
        {...register('password', {
          required: 'Пароль обязателен',
          minLength: { value: 6, message: 'Минимум 6 символов' },
          maxLength: { value: 100, message: 'Максимум 100 символов' },
        })}
        placeholder="Ваш пароль"
      />
      {errors.password && (
        <p className="text-red-500 ml-[10px] text-sm">
          {errors.password.message}
        </p>
      )}

      <Button type="submit" className="m-[10px] w-[300px]">
        Зарегистрироваться
      </Button>

      {error && <p className="text-red-500 ml-[10px] text-sm mt-2">{error}</p>}

      <div className="flex justify-center mt-4 w-full">
        <p className="text-gray-700">
          Уже есть аккаунт —{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            войдите
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
