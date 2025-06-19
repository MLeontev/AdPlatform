import { AuthResult } from '@/types/DTOs/authResult';
import { LoginDto } from '@/types/DTOs/loginDto';
import { RegisterDto } from '@/types/DTOs/registerDto';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import api from './axios';

export const login = async (authData: LoginDto): Promise<AuthResult | null> => {
  try {
    const response = await api.post('/api/user/login', authData);
    toast('✅ Успешный вход');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const message = axiosError.response?.data || axiosError.message;
    toast.error(message as string);
    return null;
  }
};

export const reg = async (regData: RegisterDto): Promise<AuthResult | null> => {
  try {
    const response = await api.post('/api/user/register', regData);
    toast('✅ Регистрация прошла успешно');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const message = axiosError.response?.data || axiosError.message;
    toast.error(message as string);
    return null;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    await api.post('/api/user/logout');

    toast('✅ Успешный выход');
    return true;
  } catch {
    toast('❌ Не удалось выйти из аккаунта');
    return false;
  }
};

export const refreshToken = async (): Promise<AuthResult | null> => {
  try {
    const response = await axios.post<AuthResult>(
      '/api/user/refresh-token',
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      if (axiosError.response.status === 400) {
        toast('Сессия истекла. Пожалуйста, войдите снова');
      } else {
        toast(`Ошибка обновления токена: ${axiosError.response.status}`);
      }
    } else {
      toast('Сетевая ошибка при обновлении токена');
    }

    return null;
  }
};
