import { create } from 'zustand';

interface MusicState {
  isPlaying: boolean;
  currentTrack: string | null;
  volume: number;
  togglePlay: () => void;
  setPlaying: (isPlaying: boolean) => void;
  setTrack: (track: string) => void;
  setVolume: (volume: number) => void;
}

export const useMusicStore = create<MusicState>((set) => ({
  isPlaying: false,
  currentTrack: "Brymo-Ad-d-tun-(JustNaija.com).mp3", // Default track
  volume: 0.5,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setTrack: (track) => set({ currentTrack: track, isPlaying: true }), // Auto-play on track change
  setVolume: (volume) => set({ volume }),
}));

export const TRACKS = [
  { id: "Brymo-Ad-d-tun-(JustNaija.com).mp3", title: "Brymo - Adédotún" },
  { id: "Dave-Ft-Tems-Raindance.mp3", title: "Dave ft. Tems - Raindance" },
  { id: "Drake_-_Teenage_Fever_feat._Jennifer_Lopez_(mp3.pm).mp3", title: "Drake - Teenage Fever" },
  { id: "Future_ft._Drake_Tems_-_Wait_For_U_(mp3.pm).mp3", title: "Future ft. Drake & Tems - Wait For U" },
  { id: "HER_-_Best_Part_CeeNaija.com_.mp3", title: "H.E.R. - Best Part" },
  { id: "Justin_Bieber_feat._Quavo_-_Intentions_(mp3.pm).mp3", title: "Justin Bieber - Intentions" },
  { id: "Olivia-Dean-Man-I-Need.mp3", title: "Olivia Dean - Man I Need" },
  { id: "Tems-Love-Me-JeJe-(TrendyBeatz.com).mp3", title: "Tems - Love Me JeJe" },
];
