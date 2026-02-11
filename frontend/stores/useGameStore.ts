import { create } from 'zustand';
import { Progress } from '@/types';
import api from '@/lib/api';

interface GameState {
    progress: Progress | null;
    isLoading: boolean;
    fetchProgress: () => Promise<void>;
    updateValentine: (answer: boolean) => Promise<void>;
    updateQuiz: (score: number) => Promise<void>;
    updateGameScore: (gameId: string, state: any) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
    progress: null,
    isLoading: false,

    fetchProgress: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get('/progress');
            set({ progress: data, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch progress', error);
            set({ isLoading: false });
        }
    },

    updateValentine: async (answer) => {
        try {
            // Optimistic update could go here, but for now wait for server
            const { data } = await api.patch('/progress/valentine', { answer });
            // Refresh full progress to ensure sync
            await get().fetchProgress();
        } catch (error) {
            console.error('Failed to update valentine status', error);
        }
    },

    updateQuiz: async (score) => {
        try {
            await api.patch('/progress/quiz', { score });
            await get().fetchProgress();
        } catch (error) {
            console.error('Failed to update quiz score', error);
        }
    },

    updateGameScore: async (gameId, state) => {
        try {
            await api.post(`/progress/game/\${gameId}\
            `, state);
            await get().fetchProgress();
        } catch (error) {
            console.error('Failed to update game score', error);
        }
    }
}));
