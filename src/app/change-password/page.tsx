'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/src/app/components/ui/Button';

export default function ChangePasswordPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to change password.');
      } else {
        setSuccess('Password updated successfully.');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        router.push('/login');
      }
    } catch (err) {
      console.error('[CHANGE_PASSWORD_ERROR]', err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="relative h-screen w-full bg-[url('/images/heroimage.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-[#00347B]/70" />
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 rounded-lg bg-white bg-opacity-90 p-8 shadow-md backdrop-blur"
        >
          <h1 className="text-2xl font-semibold text-[#00347B]">Change Password</h1>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div>
            <label className="block text-sm font-medium text-[#00347B]">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              required
              value={formData.currentPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#00347B] focus:outline-none focus:ring-1 focus:ring-[#00347B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#00347B]">New Password</label>
            <input
              type="password"
              name="newPassword"
              required
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#00347B] focus:outline-none focus:ring-1 focus:ring-[#00347B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#00347B]">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#00347B] focus:outline-none focus:ring-1 focus:ring-[#00347B]"
            />
          </div>

          <Button type="submit">Update Password</Button>
        </form>
      </div>
    </div>
  );
}
