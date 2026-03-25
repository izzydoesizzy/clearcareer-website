"use client";

import { useState } from "react";

interface YouTubeFacadeProps {
  videoId: string;
  title?: string;
}

export default function YouTubeFacade({
  videoId,
  title = "Video",
}: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div
        className="relative aspect-video overflow-hidden rounded-2xl shadow-xl"
        data-animate="scale-up"
      >
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    );
  }

  return (
    <div
      className="relative aspect-video cursor-pointer overflow-hidden rounded-2xl shadow-xl"
      data-animate="scale-up"
      onClick={() => setPlaying(true)}
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        className="h-full w-full object-cover opacity-80"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-navy/20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue/90 shadow-lg shadow-blue/30 transition-transform hover:scale-110">
          <svg
            className="ml-1 h-6 w-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
