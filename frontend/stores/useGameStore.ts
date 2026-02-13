import { create } from 'zustand';
import { Progress } from '@/types';
import api from '@/lib/api';

interface GameState {
    progress: Progress | null;
    isLoading: boolean;
    fetchProgress: () => Promise<void>;
    updateValentine: (answer: boolean) => Promise<void>;
    updateQuiz: (score: number) => Promise<void>;
    updateGameState: (gameId: string, state: any) => Promise<void>;
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
        // Optimistic update
        set((state) => {
            if (!state.progress) return state;
            return {
                progress: {
                    ...state.progress,
                    valentine: answer
                }
            };
        });

        try {
            await api.patch('/progress/valentine', { answer });
            // Background re-sync
            get().fetchProgress();
        } catch (error) {
            console.error('Failed to update valentine status', error);
            // Ideally revert state here on error
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

    updateGameState: async (gameId: string, state: any) => {
        try {
            await api.post(`/progress/game/${gameId}`, state);
            await get().fetchProgress();
        } catch (error) {
            console.error('Failed to update game state', error);
        }
    }
}));
