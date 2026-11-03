"use client";

import React, { useRef, useState } from "react";
import { Play, Volume2, VolumeX, Sparkles, Flame, Droplets } from "lucide-react";

export default function VideoReels() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const video3Ref = useRef<HTMLVideoElement>(null);

  const [playing1, setPlaying1] = useState(true);
  const [playing2, setPlaying2] = useState(true);
  const [playing3, setPlaying3] = useState(true);

  const [muted1, setMuted1] = useState(true);
  const [muted2, setMuted2] = useState(true);
  const [muted3, setMuted3] = useState(true);

  const togglePlay1 = () => {
    if (video1Ref.current) {
      if (playing1) {
        video1Ref.current.pause();
      } else {
        video1Ref.current.play();
      }
      setPlaying1(!playing1);
    }
  };

  const togglePlay2 = () => {
    if (video2Ref.current) {
      if (playing2) {
        video2Ref.current.pause();
      } else {
        video2Ref.current.play();
      }
      setPlaying2(!playing2);
    }
  };

  const togglePlay3 = () => {
    if (video3Ref.current) {
      if (playing3) {
        video3Ref.current.pause();
      } else {
        video3Ref.current.play();
      }
      setPlaying3(!playing3);
    }
  };

  const toggleMute1 = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video1Ref.current) {
      video1Ref.current.muted = !muted1;
      setMuted1(!muted1);
    }
  };

  const toggleMute2 = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video2Ref.current) {
      video2Ref.current.muted = !muted2;
      setMuted2(!muted2);
    }
  };

  const toggleMute3 = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video3Ref.current) {
      video3Ref.current.muted = !muted3;
      setMuted3(!muted3);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black via-zinc-950 to-black border-b border-zinc-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900/80 border border-gold/30 text-gold text-xs tracking-[0.25em] uppercase font-medium">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>LIFESTYLE, SILLAGE & ATELIER REELS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Witness The <span className="gold-gradient-text italic">Aura.</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-light">
            Feel the projection, elegance, and magnetic aura in authentic motion. Captured with real connoisseurs and master atelier craftsmanship.
          </p>
        </div>

        {/* 3-Column Vertical Video Reels Grid (aspect-[9/16]) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Reel Card 1: Signature Aura */}
          <div
            onClick={togglePlay1}
            className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-950 border-2 border-zinc-800 hover:border-gold/70 transition-all duration-500 shadow-2xl cursor-pointer"
          >
            {/* HTML5 Video */}
            <video
              ref={video1Ref}
              src="/branding/video-reel-signature.mp4"
              poster="/branding/titan-aura.jpg"
              autoPlay
              loop
              muted={muted1}
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/30 pointer-events-none" />

            {/* Top Badges & Sound Toggle */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-gold/40 text-[10px] font-semibold tracking-wider text-gold flex items-center gap-1.5 shadow-lg">
                <Flame className="w-3 h-3 text-gold" />
                <span>SIGNATURE REEL</span>
              </span>

              <button
                onClick={toggleMute1}
                className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-gold hover:border-gold/50 transition-all shadow-lg"
                aria-label="Toggle mute"
              >
                {muted1 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Center Play/Pause Indicator (Shown when paused) */}
            {!playing1 && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
                <div className="w-14 h-14 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-gold-glow animate-pulse">
                  <Play className="w-6 h-6 fill-black ml-1" />
                </div>
              </div>
            )}

            {/* Frosted Glass Bottom Overlay Card */}
            <div className="absolute bottom-4 left-3 right-3 p-4 rounded-2xl glass-zinc border border-white/10 group-hover:border-gold/40 transition-colors duration-300 z-20 backdrop-blur-xl">
              <div className="text-[9px] uppercase tracking-[0.25em] text-gold font-semibold flex items-center gap-1">
                <span>BEAST MODE SILLAGE</span>
                <span>•</span>
                <span>TITAN AURA</span>
              </div>
              <h3 className="text-base font-serif font-bold text-white mt-1">
                Strength in Every Scent
              </h3>
              <p className="text-[11px] text-zinc-300 line-clamp-2 mt-1 font-light">
                Infused with French oils for a room-commanding presence that stays with you through dawn and dusk.
              </p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
                <span className="text-gold font-medium">35% Extrait Oil</span>
                <span>•</span>
                <span>14h Longevity</span>
                <span>•</span>
                <span className="text-white font-semibold">₹349</span>
              </div>
            </div>
          </div>

          {/* Reel Card 2: Lifestyle & Allure */}
          <div
            onClick={togglePlay2}
            className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-950 border-2 border-zinc-800 hover:border-gold/70 transition-all duration-500 shadow-2xl cursor-pointer"
          >
            {/* HTML5 Video */}
            <video
              ref={video2Ref}
              src="/branding/video-reel-lifestyle.mp4"
              poster="/branding/hero-model.jpg"
              autoPlay
              loop
              muted={muted2}
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/30 pointer-events-none" />

            {/* Top Badges & Sound Toggle */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-gold/40 text-[10px] font-semibold tracking-wider text-gold flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3 h-3 text-gold" />
                <span>LIFESTYLE MOTION</span>
              </span>

              <button
                onClick={toggleMute2}
                className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-gold hover:border-gold/50 transition-all shadow-lg"
                aria-label="Toggle mute"
              >
                {muted2 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Center Play/Pause Indicator (Shown when paused) */}
            {!playing2 && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
                <div className="w-14 h-14 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-gold-glow animate-pulse">
                  <Play className="w-6 h-6 fill-black ml-1" />
                </div>
              </div>
            )}

            {/* Frosted Glass Bottom Overlay Card */}
            <div className="absolute bottom-4 left-3 right-3 p-4 rounded-2xl glass-zinc border border-white/10 group-hover:border-gold/40 transition-colors duration-300 z-20 backdrop-blur-xl">
              <div className="text-[9px] uppercase tracking-[0.25em] text-gold font-semibold flex items-center gap-1">
                <span>HAUTE PARFUMERIE</span>
                <span>•</span>
                <span>MIDNIGHT OUD</span>
              </div>
              <h3 className="text-base font-serif font-bold text-white mt-1">
                A Fragrance Beyond Time
              </h3>
              <p className="text-[11px] text-zinc-300 line-clamp-2 mt-1 font-light">
                Dark Persian saffron and royal oud resin created to make you the magnetic center of any evening.
              </p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
                <span className="text-gold font-medium">Velvet Sillage</span>
                <span>•</span>
                <span>Compliment Magnet</span>
                <span>•</span>
                <span className="text-white font-semibold">₹349</span>
              </div>
            </div>
          </div>

          {/* Reel Card 3: The Atelier & Craftsmanship */}
          <div
            onClick={togglePlay3}
            className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-950 border-2 border-zinc-800 hover:border-gold/70 transition-all duration-500 shadow-2xl cursor-pointer"
          >
            {/* HTML5 Video */}
            <video
              ref={video3Ref}
              src="/branding/video-reel-atelier.mp4"
              poster="/branding/rush-7.jpg"
              autoPlay
              loop
              muted={muted3}
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/30 pointer-events-none" />

            {/* Top Badges & Sound Toggle */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-gold/40 text-[10px] font-semibold tracking-wider text-gold flex items-center gap-1.5 shadow-lg">
                <Droplets className="w-3 h-3 text-gold" />
                <span>ATELIER CRAFT</span>
              </span>

              <button
                onClick={toggleMute3}
                className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-gold hover:border-gold/50 transition-all shadow-lg"
                aria-label="Toggle mute"
              >
                {muted3 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Center Play/Pause Indicator (Shown when paused) */}
            {!playing3 && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
                <div className="w-14 h-14 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-gold-glow animate-pulse">
                  <Play className="w-6 h-6 fill-black ml-1" />
                </div>
              </div>
            )}

            {/* Frosted Glass Bottom Overlay Card */}
            <div className="absolute bottom-4 left-3 right-3 p-4 rounded-2xl glass-zinc border border-white/10 group-hover:border-gold/40 transition-colors duration-300 z-20 backdrop-blur-xl">
              <div className="text-[9px] uppercase tracking-[0.25em] text-gold font-semibold flex items-center gap-1">
                <span>FRENCH OIL FORMULATION</span>
                <span>•</span>
                <span>ATELIER</span>
              </div>
              <h3 className="text-base font-serif font-bold text-white mt-1">
                Pure Extrait Pouring
              </h3>
              <p className="text-[11px] text-zinc-300 line-clamp-2 mt-1 font-light">
                Obsessive artisanal maceration and manual bottling of every flacon to preserve volatile natural top notes.
              </p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
                <span className="text-gold font-medium">Artisanal Batch</span>
                <span>•</span>
                <span>High Sillage</span>
                <span>•</span>
                <span className="text-white font-semibold">Discovery (₹399)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
