export interface User {
    id: string;
    email: string;
    profile?: Profile;
    progress?: Progress;
}

export interface Profile {
    id: string;
    nickname?: string;
    avatarUrl?: string;
}

export interface Progress {
    id: string;
    valentineAnswer: boolean;
    quizCompleted: boolean;
    quizScore: number;
    gameStates: Record<string, any>;
    unlockedMedia: Unlock[];
}

export interface Unlock {
    id: string;
    mediaId: string;
    media?: Media;
    unlockedAt: string;
}

export interface Media {
    id: string;
    title: string;
    type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'TEXT';
    url: string;
    requiredGame: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}
