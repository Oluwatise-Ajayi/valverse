
export interface StoryOption {
    id: string;
    label: string;
}

export interface StoryNode {
    id: string;
    chapter: number;
    scene: number;
    text: string;
    choices: StoryOption[];
}

export interface PlayerStats {
    trust: number;
    closeness: number;
    security: number;
    desire: number;
}

export interface StoryState {
    node: StoryNode;
    state: PlayerStats;
}
