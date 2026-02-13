"use client";

import { useEffect, useRef } from "react";
import { useMusicStore } from "@/stores/useMusicStore";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying, currentTrack, volume, setPlaying } = useMusicStore();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
          setPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, setPlaying]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = `/music/${encodeURIComponent(currentTrack)}`;
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
          setPlaying(false);
        });
      }
    }
  }, [currentTrack]);

  return (
    <audio
      ref={audioRef}
      loop
      onEnded={() => {
        // Optional: play next track logic here if desired
      }}
    />
  );
}
