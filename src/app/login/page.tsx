"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // Form state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission and attempt login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use NextAuth credentials provider to sign in
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    // Display error if login failed
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      // Redirect to protected route on successful login
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative h-screen w-full bg-[url('/images/heroimage.png')] bg-cover bg-center">
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-[#00347B]/70"></div>

      {/* Form container (above background) */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-6 rounded-lg bg-white bg-opacity-90 p-8 shadow-md backdrop-blur"
        >
          <h1 className="text-2xl font-semibold text-[#00347B]">Login</h1>

          {/* Error message display */}
          {error && (
            <div className="rounded bg-red-100 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-[#00347B]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#00347B] focus:outline-none focus:ring-1 focus:ring-[#00347B]"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-[#00347B]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#00347B] focus:outline-none focus:ring-1 focus:ring-[#00347B]"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full rounded bg-[#00347B] px-4 py-2 text-white hover:bg-[#FED602] hover:text-[#00347B]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
