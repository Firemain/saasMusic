import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Plus, Volume2, ZoomIn, ZoomOut, Save, Trash2 } from 'lucide-react';
import Waveform from './WaveForm';

// Fonction utilitaire pour formater le temps
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioTimelineEditor = () => {
  // États principaux
  interface Clip {
    id: number;
    name: string;
    start: number;
    duration: number;
    color: string;
    url: string;
  }
  
  interface Track {
    id: number;
    name: string;
    clips: Clip[];
    volume: number;
    muted: boolean;
  }
  
  const [tracks, setTracks] = useState<Track[]>([
    { id: 1, name: "Mix IA", clips: [], volume: 1, muted: false },
    { id: 2, name: "Effets sonores", clips: [], volume: 1, muted: false }
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [snap, setSnap] = useState(true);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  
  // Refs
  const timelineRef = useRef<HTMLDivElement>(null);
  const audioNodes = useRef(new Map());
  const dragRef = useRef<{ offsetX: number; width: number } | null>(null);
  
  // États pour le drag & drop
  const [draggedClip, setDraggedClip] = useState<{ clip: Clip; trackId: number } | null>(null);

  // Calculer la durée maximale
  const maxDuration = Math.max(...tracks.flatMap(track => track.clips.map(clip => clip.start + clip.duration)), 60);

  // Initialisation du Web Audio API
  useEffect(() => {
    const ctx = new (window.AudioContext || window.AudioContext)();
    setAudioContext(ctx);
    
    return () => {
      ctx.close();
    };
  }, []);

  // Gestion de la lecture audio
  useEffect(() => {
    if (!audioContext) return;

    if (isPlaying) {
      audioContext.resume();
      tracks.forEach(track => {
        track.clips.forEach(clip => {
          const audioNode = audioNodes.current.get(clip.id);
          if (audioNode && currentTime >= clip.start && currentTime <= clip.start + clip.duration) {
            if (!audioNode.isPlaying) {
              const source = audioContext.createBufferSource();
              source.buffer = audioNode.buffer;
              const gainNode = audioContext.createGain();
              gainNode.gain.value = track.volume;
              source.connect(gainNode);
              if (audioContext) {
                gainNode.connect(audioContext.destination);
              }
              source.start(0, currentTime - clip.start);
              audioNode.isPlaying = true;
              audioNode.source = source;
            }
          }
        });
      });
    } else {
      audioContext.suspend();
      audioNodes.current.forEach(node => {
        if (node.source) {
          node.source.stop();
          node.isPlaying = false;
        }
      });
    }
  }, [isPlaying, currentTime, tracks, audioContext]);

  // Gestion du temps et de la lecture
  useEffect(() => {
    let animationFrame;
    const updateTime = () => {
      if (isPlaying) {
        setCurrentTime(prev => {
          const newTime = prev + 0.016; // ~60fps
          return newTime;
        });
        animationFrame = requestAnimationFrame(updateTime);
      }
    };
    
    if (isPlaying) {
      animationFrame = requestAnimationFrame(updateTime);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying]);

  // Chargement d'un fichier audio
  const handleFileUpload = async (trackId, file) => {
    if (!audioContext) return;

    const url = URL.createObjectURL(file); // Create a URL for the blob
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const newClip = {
        id: Math.random(),
        name: file.name,
        start: currentTime,
        duration: audioBuffer.duration,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        url: url // Save the URL for the waveform visualization
    };
    
    audioNodes.current.set(newClip.id, {
        buffer: audioBuffer,
        isPlaying: false
    });

    // Update the track with new clip and URL for visualization
    setTracks(tracks.map(track => {
        if (track.id === trackId) {
            return {
                ...track,
                clips: [...track.clips, newClip]
            };
        }
        return track;
    }));
};

  // Gestion du drag & drop
  const handleDragStart = (e, clip, trackId) => {
    setDraggedClip({ clip, trackId });
    const rect = e.target.getBoundingClientRect();
    dragRef.current = {
      offsetX: e.clientX - rect.left,
      width: rect.width
    };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!draggedClip || !timelineRef.current) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const clipWidth = dragRef.current ? dragRef.current.width : 0;
    if (!dragRef.current) return;
    let newStart = ((e.clientX - timelineRect.left - dragRef.current.offsetX) / timelineRect.width) * 60 * zoom;
    
    // Snap to grid (1 second intervals)
    if (snap) {
      newStart = Math.round(newStart);
    }
    
    setTracks(tracks.map(track => {
      if (track.id === draggedClip.trackId) {
        return {
          ...track,
          clips: track.clips.map(clip => {
            if (clip.id === draggedClip.clip.id) {
              return { ...clip, start: Math.max(0, newStart) };
            }
            return clip;
          })
        };
      }
      return track;
    }));
  };

  const handleDragEnd = () => {
    setDraggedClip(null);
  }; 

  const handleTimelineClick = (event) => {
    if (!timelineRef.current) return;
    const bounds = timelineRef.current.getBoundingClientRect();
    const position = (event.clientX - bounds.left) / bounds.width;
    const newCurrentTime = position * maxDuration;
  
    // Update currentTime state
    setCurrentTime(newCurrentTime);
  
    // Restart playback from new currentTime if playing
    if (isPlaying) {
      restartPlaybackAt(newCurrentTime);
    }
  };

  const restartPlaybackAt = (time) => {
    // Stop all currently playing audio nodes
    audioNodes.current.forEach((node, id) => {
      if (node.source) {
        node.source.stop();
        node.isPlaying = false;
      }
    });
  
    // Start playing applicable clips from the new time
    tracks.forEach(track => {
      track.clips.forEach(clip => {
        if (time >= clip.start && time < clip.start + clip.duration) {
          const audioNode = audioNodes.current.get(clip.id);
          if (!audioNode.isPlaying && audioContext) {
            const source = audioContext.createBufferSource();
            source.buffer = audioNode.buffer;
            const gainNode = audioContext.createGain();
            gainNode.gain.value = track.volume;
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            source.start(0, time - clip.start);
            audioNode.isPlaying = true;
            audioNode.source = source;
          }
        }
      });
    });
  };  

  const mainTrackUrl = tracks.find(track => track.id === 1)?.clips[0]?.name;

  return (
    <div className="w-full max-w-6xl p-6 bg-gray-900 rounded-lg shadow-xl">
      {/* Barre d'outils principale */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? 
              <Pause className="text-white" size={24} /> : 
              <Play className="text-white" size={24} />
            }
          </button>
          
          <div className="text-white text-xl font-mono">
            {formatTime(currentTime)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={snap}
              onChange={e => setSnap(e.target.checked)}
              className="form-checkbox size-4"
            />
            Snap to Grid
          </label>
          
          <button 
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 flex items-center gap-2"
          >
            <Save className="text-white" size={20} />
            <span className="text-white">Export</span>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex">
        {/* Headers des tracks */}
        <div className="w-48 shrink-0">
          {/* Espace pour aligner avec la règle temporelle */}
          <div className="h-8 border-b border-gray-700 bg-gray-850" />
          
          {/* Headers des tracks */}
          {tracks.map(track => (
            <div 
              key={track.id}
              className="p-3 border-r border-b border-gray-700 bg-gray-850 flex flex-col gap-2 h-32"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{track.name}</span>
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'audio/*';
                    input.onchange = e => {
                      const target = e.target as HTMLInputElement;
                      if (target && target.files) {
                        handleFileUpload(track.id, target.files[0]);
                      }
                    };
                    input.click();
                  }}
                  className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                >
                  <Plus className="text-white" size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <Volume2 className="text-gray-400" size={16} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={track.volume}
                  onChange={e => setTracks(tracks.map(t => 
                    t.id === track.id ? { ...t, volume: parseFloat(e.target.value) } : t
                  ))}
                  className="flex-1"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Timeline et contenu */}
        <div 
          ref={timelineRef}
          className="relative flex-1 border border-gray-700 bg-gray-800 rounded-lg overflow-hidden"
          onClick={handleTimelineClick}
        >
          {/* Règle temporelle améliorée */}
        <div className="h-8 flex relative">
         
        </div>

          {/* Curseur de lecture */}
          <div 
            className="absolute inset-y-0 w-1 bg-red-500 pointer-events-none z-50"
            style={{ left: `${(currentTime / maxDuration) * 100}%` }}
          />

          {/* Zones des clips */}
          {tracks.map(track => (
            <div 
              key={track.id}
              className="relative h-32 border-b border-gray-700"
              onDragOver={handleDragOver}
            >
              {track.clips.map(clip => (
                <div
                  key={clip.id}
                  draggable
                  onDragStart={e => handleDragStart(e, clip, track.id)}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-y-2 rounded-md flex flex-col cursor-move group"
                  style={{
                    left: `${(clip.start / maxDuration) * 100}%`,
                    width: `${(clip.duration / maxDuration) * 100}%`,
                    backgroundColor: clip.color
                  }}
                >

                  {/* Nom du clip */}
                  <div className="px-2 py-1 text-xs text-white truncate">
                    {clip.name || 'Untitled Clip'}
                  </div>
                  
                  {/* Durée du clip */}
                  <div className="px-2 text-xs text-white/70">
                    {formatTime(clip.duration)}
                  </div>

                  {mainTrackUrl && <Waveform url={clip.url} />}
                  
                  {/* Bouton de suppression */}
                  <button
                    onClick={() => setTracks(tracks.map(t => 
                      t.id === track.id 
                        ? { ...t, clips: t.clips.filter(c => c.id !== clip.id) }
                        : t
                    ))}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="text-white" size={12} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioTimelineEditor;