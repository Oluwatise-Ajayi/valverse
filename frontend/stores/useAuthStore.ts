import { create } from 'zustand';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Initial load

    login: (token, user) => {
        localStorage.setItem('token', token);
        set({ user, isAuthenticated: true, isLoading: false });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false, isLoading: false });
    },

    fetchUser: async () => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                set({ user: null, isAuthenticated: false, isLoading: false });
                return;
            }

            const { data } = await api.get('/auth/me');
            set({ user: data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch user', error);
            localStorage.removeItem('token');
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));
