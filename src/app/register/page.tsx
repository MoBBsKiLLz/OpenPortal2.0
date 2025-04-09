'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Something went wrong.');
    } else {
      router.push('/login'); // redirect after successful registration
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md"
      >
        <h1 className="text-2xl font-semibold text-gray-800">Register</h1>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {['first_name', 'last_name', 'email', 'phone_number', 'password'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace('_', ' ')}
            </label>
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              name={field}
              required
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
