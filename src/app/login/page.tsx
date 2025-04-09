'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/dashboard'); // Replace with your protected route
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow-md"
      >
        <h1 className="text-2xl font-semibold text-gray-800">Login</h1>

        {error && (
          <div className="rounded bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
