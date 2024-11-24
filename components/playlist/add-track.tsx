import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function AddTrack({ onAddTrack }) {
    const handleFileChange = event => {
      const files = event.target.files;
      if (files.length > 0) {
        onAddTrack(files[0]); // Envoyer le fichier pour traitement
      }
    };
  
    return (
      <div className="mt-4">
        <Label>
          Ajouter un morceau
          <Input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
        </Label>
      </div>
    );
  }
  