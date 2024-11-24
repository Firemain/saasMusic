import TrackItem from "./track-item";
import AddTrack from "./add-track";

export default function PlaylistEditor({ playlist, onAddTrack }) {
    return (
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-lg font-bold mb-4">{playlist.name}</h2>
        {playlist.tracks.map(track => (
          <TrackItem key={track.id} track={track} />
        ))}
        <AddTrack onAddTrack={onAddTrack} />
      </div>
    );
  }
  