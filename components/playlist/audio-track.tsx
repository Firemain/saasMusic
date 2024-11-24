"use client";

import { useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { cn } from "@/lib/utils";

interface AudioTrackProps {
  name: string;
  onLoad?: (wavesurfer: WaveSurfer) => void;
  className?: string;
  isMainTrack?: boolean;
}

export default function AudioTrack({ name, onLoad, className, isMainTrack = false }: AudioTrackProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: isMainTrack ? "#4F46E5" : "#2DD4BF",
        progressColor: isMainTrack ? "#818CF8" : "#14B8A6",
        cursorColor: "#C7D2FE",
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: isMainTrack ? 128 : 64,
        barGap: 2,
      });

      if (onLoad) {
        onLoad(wavesurfer.current);
      }

      return () => {
        wavesurfer.current?.destroy();
      };
    }
  }, [onLoad, isMainTrack]);

  return (
    <div className={cn("rounded-lg bg-card p-4", className)}>
      <div className="flex items-center gap-4 mb-2">
        <h3 className="text-sm font-medium">{name}</h3>
      </div>
      <div ref={waveformRef} />
    </div>
  );
}