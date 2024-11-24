import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Ensure this is the correct import path
import { Input } from '@/components/ui/input'; // Ensure you have such a component, or replace with an equivalent
import { Form } from '@/components/ui/form'; // Ensure you have such a component, or replace with an equivalent

function EditTrackForm({ track, onSave }) {
  const [formData, setFormData] = useState({...track});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='p-4'>
      <label className="mb-2 block">Title</label>
      <Input
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="mb-4"
      />
      <label className="mb-2 block">Artist</label>
      <Input
        name="artist"
        value={formData.artist}
        onChange={handleChange}
        className="mb-4"
      />
      <label className="mb-2 block">BPM</label>
      <Input
        name="bpm"
        value={formData.bpm}
        onChange={handleChange}
        className="mb-4"
      />
      <label className="mb-2 block">Key</label>
      <Input
        name="key"
        value={formData.key}
        onChange={handleChange}
        className="mb-4"
      />
      <Button type="submit" className="mt-4">
        Save Changes
      </Button>
    </form>
  );
}

export default EditTrackForm;
