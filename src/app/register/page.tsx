"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from '@/src/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();

  // Form state for user registration fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  const [error, setError] = useState("");

  // Update form state on input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit registration data to backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    // Handle success or show error message
    if (!res.ok) {
      setError(data.message || "Something went wrong.");
    } else {
      // Redirect to login after successful registration
      router.push("/login");
    }
  };

  return (
    <div className="relative h-screen w-full bg-[url('/images/heroimage.png')] bg-cover bg-center">
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-[#00347B]/70"></div>

      {/* Form container (above background) */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 rounded-lg bg-white bg-opacity-90 p-8 shadow-md backdrop-blur"
        >
          <h1 className="text-2xl font-semibold text-[#00347B]">Register</h1>

          {/* Error message display */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Dynamically render form fields */}
          {["first_name", "last_name", "email", "phone_number", "password"].map(
            (field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-[#00347B] capitalize">
                  {field.replace("_", " ")}
                </label>
                <input
                  type={
                    field === "password"
                      ? "password"
                      : field === "email"
                      ? "email"
                      : "text"
                  }
                  name={field}
                  required
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-[#00347B] focus:outline-none focus:ring-1 focus:ring-[#00347B]"
                />
              </div>
            )
          )}

          {/* Submit button */}
          <Button type="submit">Create Account</Button>
        </form>
      </div>
    </div>
  );
}
