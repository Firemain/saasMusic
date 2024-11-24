"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, Plus, Upload, Volume2, VolumeX } from "lucide-react";

export default function AudioEditor() {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4F46E5",
        progressColor: "#818CF8",
        cursorColor: "#C7D2FE",
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: 50,
        barGap: 2,
      });

      wavesurfer.current.on("play", () => setIsPlaying(true));
      wavesurfer.current.on("pause", () => setIsPlaying(false));

      return () => {
        wavesurfer.current?.destroy();
      };
    }
  }, []);

  const handlePlayPause = () => {
    wavesurfer.current?.playPause();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && wavesurfer.current) {
      try {
        await wavesurfer.current.loadBlob(file);
        toast({
          title: "Fichier chargé avec succès",
          description: `${file.name} est prêt à être édité`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger le fichier audio",
        });
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    wavesurfer.current?.setVolume(newVolume);
  };

  const toggleMute = () => {
    if (wavesurfer.current) {
      if (isMuted) {
        wavesurfer.current.setVolume(volume);
      } else {
        wavesurfer.current.setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  };

  const handleAddTrack = () => {
    toast({
      title: "Bientôt disponible",
      description: "La fonction d'ajout de piste sera disponible prochainement",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-primary">Éditeur Audio</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleAddTrack}>
              <Plus className="mr-2 size-4" />
              Ajouter une piste
            </Button>
            <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
              <Upload className="mr-2 size-4" />
              Charger un fichier
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-xl">
          <div ref={waveformRef} className="mb-6" />
          
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              className="size-12"
            >
              {isPlaying ? (
                <Pause className="size-6" />
              ) : (
                <Play className="size-6" />
              )}
            </Button>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="size-8"
              >
                {isMuted ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </Button>
              <Slider
                defaultValue={[1]}
                max={1}
                step={0.1}
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}