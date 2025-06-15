import axios, { AxiosError } from 'axios';
import { AuthResult } from '@/types/DTOs/authResult';
import { LoginDto } from '@/types/DTOs/loginDto';
import { toast } from 'sonner';
import {RegisterDto} from "@/types/DTOs/registerDto"
import { useAuthStore } from '@/store/authStore';
import api from './axios';

export const login = async (authData: LoginDto): Promise<string | null> => {
  try {
    const response = await api.post('/api/user/login', {
      email: authData.email,
      password: authData.password,
    });
    
    const data = response.data as AuthResult;
    const setAuthData = useAuthStore((state) => state.setAuthData);
    setAuthData(data);

    toast('✅ Успешный вход');
    return null;
  } catch (error) {
    const axiosError = error as AxiosError;

    toast(axiosError.message);
    return axiosError.message;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    await api.post('/api/user/logout');

    toast('✅ Успешный выход');
    return true;
  } catch (error) {
    toast('❌ Не удалось выйти из аккаунта');
    return false;
  }
};

export const reg = async (regData: RegisterDto): Promise<string | null> => {
  try {
    const response = await api.post('/api/user/register', {
      email: regData.email,
      password: regData.password,
      name: regData.name,
      surname: regData.surname,
      phone: regData.phone
    });

    const data = response.data as AuthResult;
    const setAuthData = useAuthStore((state) => state.setAuthData);
    setAuthData(data);

    toast('✅ Успешный вход');
    return null;
  } catch (error) {
    const axiosError = error as AxiosError;

    toast(axiosError.message);
    return axiosError.message;
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
          'Content-Type': 'application/json'
        }
      }
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
