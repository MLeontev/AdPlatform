import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AuthResult } from '@/types/DTOs/authResult';

type AuthStoreState = {
  id: number | null;
  isAuth: boolean;
  accessToken: string | null;
};

type AuthStoreActions = {
  setAuthData: (authData: AuthResult) => void;
  logout: () => void;
};

type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    id: null,
    isAuth: false,
    accessToken: null,

    setAuthData: (authData: AuthResult) => {
      const { id, accessToken } = authData;
      localStorage.setItem('token', authData.accessToken);
      set({
        id: id,
        isAuth: true,
        accessToken,
      });
    },

    logout: () => {
      localStorage.removeItem('token');
      set({
        id: null,
        isAuth: false,
        accessToken: null,
      });
    },
  }))
);