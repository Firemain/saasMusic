import { useState } from 'react';
import { Button } from "@/components/ui/button"; // Utilise ton Button personnalisé
import { Modal } from "@/components/ui/modal"; // Assure-toi que tu as un composant Modal
import Link from 'next/link';

export default function PlaylistSelector({ playlists, setPlaylists }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewPlaylistName('');
  };

  const handleAddPlaylist = () => {
    if (newPlaylistName.trim() !== '') {
      const newPlaylist = {
        id: playlists.length + 1, // Simplistic approach for unique ID
        name: newPlaylistName
      };
      setPlaylists([...playlists, newPlaylist]);
      handleCloseModal();
    }
  };

  return (
    <div className="shadow-md rounded p-4">
      <h2 className="text-lg font-bold mb-4">Sélectionner une Playlist</h2>
        {playlists.map(playlist => ( 
        <Link href={`/dashboard/playlist/${playlist.id}`} key={playlist.id}>
            <Button variant="outline" key={playlist.id} className="py-2 mx-4">
                {playlist.name}
            </Button>  
        </Link>
        ))}
      <Button variant="default" onClick={handleOpenModal}>Créer une nouvelle playlist</Button>

      {modalOpen && (
        <Modal onClose={handleCloseModal}>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-4">Nouvelle Playlist</h3>
            <input
              type="text"
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              placeholder="Nom de la playlist"
              className="p-2 border rounded w-full mb-4"
            />
            <Button variant="default" onClick={handleAddPlaylist}>Ajouter</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
