'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../../components/ui/Button';

interface Props {
  onClose: () => void;
}

export default function InviteFormModal({ onClose }: Props) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'Account Manager',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/invite', {
      method: 'POST',
      body: JSON.stringify({ ...formData, created_by: 1 }), // TODO: Replace with session user ID
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      alert('Invite sent!');
      onClose();
      window.location.reload();
    } else {
      alert('Failed to send invite.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#00347B]/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold text-[#00347B] mb-4">Create New Invite</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-700"
            >
              <option value="Account Manager">Account Manager</option>
              <option value="Regional Manager">Regional Manager</option>
              <option value="Facility Manager">Facility Manager</option>
            </select>
          </div>

          <Button type="submit">Send Invite</Button>
        </form>
      </div>
    </div>
  );
}
