"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

type AudioPlayerProps = {
  audioUrl: string;
  title?: string;
};

export default function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = (parseFloat(e.target.value) / 100) * audio.duration;
    audio.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
      setIsPlaying(false);
    };
  }, []);

  return (
    <motion.div
      className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl shadow-sm flex flex-col gap-3"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {title && <h3 className="font-semibold text-lg">{title}</h3>}

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="bg-black text-white rounded-full p-2 hover:bg-zinc-900"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
        />
      </div>
    </motion.div>
  );
}

<AudioPlayer
  audioUrl="https://your-supabase-audio-url.mp3"
  title="Episode #1 – Exploring the AI Frontier"
/>
