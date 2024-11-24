"use client";

import { useState } from 'react';
import PlaylistSelector from '@/components/playlist/playlist-selector';
import PlaylistEditor from '@/components/playlist/playlist-editor';

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState([{ id: 1, name: 'Jazz', tracks: [] },{ id: 2, name: 'Disco', tracks: [] }]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const handleSelectPlaylist = playlist => {
    setSelectedPlaylist(playlist);
  };

  return (
    <div className="container mx-auto">
      <PlaylistSelector playlists={playlists} setPlaylists={setPlaylists} />
      {/* {selectedPlaylist && <PlaylistEditor playlist={selectedPlaylist} />} */}
    </div>
  );
}
