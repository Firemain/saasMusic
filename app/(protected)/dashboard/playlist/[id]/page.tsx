"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal'; // Supposons que vous avez un composant Modal
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table'; // Ajustez le chemin d'importation selon vos besoins
import EditTrackForm from '@/components/playlist/edit-track'; // Ajustez le chemin d'importation selon vos besoins 
import { Label } from '@/components/ui/label';
import { useParams } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

function PlaylistPage({ params }: Props) {
  type Track = {
    id: number;
    title: string;
    artist: string;
    bpm: string;
    key: string;
  };

  const id = useParams<{ id: string; }>().id;
  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Gestion de l'ajout des fichiers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const newTracks = files.map((file, index) => ({
      id: tracks.length + index,
      title: file.name,
      artist: 'Unknown',
      bpm: '120',
      key: 'C Major'
    }));
    setTracks([...tracks, ...newTracks]);
  };

  const openEditModal = (track) => {
    setSelectedTrack(track);
    setIsModalOpen(true);
  };

  const handleEditTrack = (editedTrack) => {
    const updatedTracks = tracks.map(track => track.id === editedTrack.id ? editedTrack : track);
    setTracks(updatedTracks);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Playlist: {id}</h1>
        <Label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
          Ajouter des musiques
          <input type="file" multiple accept="audio/*" onChange={handleFileUpload} className="hidden" />
        </Label>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>BPM</TableCell>
            <TableCell>Key</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks.map(track => (
            <TableRow key={track.id}>
              <TableCell>{track.title}</TableCell>
              <TableCell>{track.artist}</TableCell>
              <TableCell>{track.bpm}</TableCell>
              <TableCell>{track.key}</TableCell>
              <TableCell>
                <Button onClick={() => openEditModal(track)}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isModalOpen && selectedTrack && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <EditTrackForm track={selectedTrack} onSave={handleEditTrack} />
        </Modal>
      )}
    </div>
  );
}

export default PlaylistPage;
