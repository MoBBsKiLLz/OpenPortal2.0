'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/src/app/components/ui/Button';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <ActualForm />
    </Suspense>
  );
}

function ActualForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: '',
  });

  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = searchParams.get('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('No registration token found.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/invite/${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Invalid or expired invitation.');
        } else {
          setFormData((prev) => ({
            ...prev,
            email: data.email,
            role: data.role,
          }));
          setTokenValid(true);
        }
      } catch (err) {
        setError('An error occurred while validating the token.');
        console.error('[TOKEN_VALIDATION_ERROR]', err);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ ...formData, token }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Something went wrong.');
    } else {
      router.push('/login');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="relative h-screen w-full bg-[url('/images/heroimage.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-[#00347B]/70" />
      <div className="relative z-10 flex h-full items-center justify-center md:justify-start md:ml-[15%] px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 rounded-lg bg-white bg-opacity-90 p-8 shadow-md backdrop-blur"
        >
          <h1 className="text-2xl font-semibold text-[#00347B]">Register</h1>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Email (locked) */}
          <div>
            <label className="block text-sm font-medium text-[#00347B]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="mt-1 w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-800 shadow-sm cursor-not-allowed"
            />
          </div>

          {/* Role (locked) */}
          <div>
            <label className="block text-sm font-medium text-[#00347B]">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              readOnly
              className="mt-1 w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-800 shadow-sm cursor-not-allowed"
            />
          </div>

          {/* Remaining fields */}
          {['first_name', 'last_name', 'phone_number', 'password'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-[#00347B] capitalize">
                {field.replace('_', ' ')}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                required
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#00347B] focus:outline-none focus:ring-1 focus:ring-[#00347B]"
              />
            </div>
          ))}

          <Button type="submit" disabled={!tokenValid}>
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}
