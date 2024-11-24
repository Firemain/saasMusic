export default function TrackItem({ track }) {
    return (
      <div className="flex justify-between items-center py-2">
        <span className="text-gray-700">{track.title}</span>
      </div>
    );
  }
  