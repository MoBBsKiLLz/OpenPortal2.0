'use client';

import { useRouter } from 'next/navigation';
import Button from '@/src/app/components/ui/Button';

type SettingsClientProps = {
  user: {
    email: string;
    role: string;
  } | null;
};

export default function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter();

  return (
    <div className="p-6 bg-[var(--topbar-bg)] min-h-screen">
      <h1 className="mb-6 text-2xl font-bold text-[var(--text-color)]">Settings</h1>

      <div className="rounded-md bg-[var(--topbar-bg)] shadow-md p-6 space-y-6 border border-[var(--hover-bg)]">
        {/* Account Info Section */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-color)] mb-2">Account Info</h2>
        </section>

        {/* Display-only Account Fields */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-[var(--text-color)] mb-1 block">Email</label>
            <p className="text-[var(--content-text-color)] text-sm">{user?.email}</p>
          </div>

          <div>
            <label className="text-sm font-bold text-[var(--text-color)] mb-1 block">Role</label>
            <p className="text-[var(--content-text-color)] text-sm">{user?.role}</p>
          </div>
        </section>

        {/* Action Button */}
        <div className="flex justify-start pt-4">
          <Button
            className="w-fit"
            size="md"
            variant="primary"
            onClick={() => router.push('/change-password')}
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}
