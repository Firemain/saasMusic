"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assurez-vous que les chemins sont corrects
import { Input } from '@/components/ui/input'; // Assurez-vous que les chemins sont corrects
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'; // Assurez-vous que les chemins sont corrects
import AudioEditor from '@/components/playlist/audio-editor';
import AudioEditorPro from '@/components/AudioEditor/AudioEditor';

function MixPage() {
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [bpm, setBpm] = useState('');
  const [key, setKey] = useState('');
  const [duration, setDuration] = useState('');

  const playlists = [
    { id: '1', name: 'Chill Vibes' },
    { id: '2', name: 'Workout Energy' },
  ];

  const keys = [
    { value: 'C', label: 'C Major' },
    { value: 'G', label: 'G Major' },
  ];

  const durations = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 heure' },
  ];

  const handleGenerateMix = () => {
    console.log(`Generating mix with: Playlist ${selectedPlaylist}, ${bpm} BPM, Key of ${key}, Duration ${duration} minutes`);
    // Ajouter la logique pour générer le mix
  };

  return (
    <div className="container mx-auto p-4 overflow-hidden">
      <h1 className="text-xl font-bold mb-4">Créer un Mix</h1>
      <div className="mb-4">
        <Select onValueChange={(value) => setSelectedPlaylist(playlists.find(playlist => playlist.id === value)?.name || '')}>
          <SelectTrigger aria-label="Select a playlist">
            <SelectValue placeholder="Select a playlist" />
          </SelectTrigger>
          <SelectContent>
            {playlists.map(playlist => (
              <SelectItem key={playlist.id} value={playlist.id}>
                {playlist.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Input
          type="number"
          value={bpm}
          onChange={e => setBpm(e.target.value)}
          placeholder="Enter BPM"
        />
      </div>
      <div className="mb-4">
        <Select onValueChange={(value) => setKey(keys.find(k => k.value === value)?.label || '')}>
          <SelectTrigger aria-label="Select a key">
            <SelectValue placeholder="Select a key" />
          </SelectTrigger>
          <SelectContent>
            {keys.map(k => (
              <SelectItem key={k.value} value={k.value}>
                {k.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Select onValueChange={(value) => setDuration(durations.find(d => d.value === value)?.label || '')}>
          <SelectTrigger aria-label="Select duration">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {durations.map(d => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleGenerateMix}>Générer le Mix</Button>

      <AudioEditorPro></AudioEditorPro>
    </div>
  );
}

export default MixPage;
