'use client';

import { useEffect, useState } from 'react';
import InviteFormModal from '@/src/app/components/invites/InviteFormModal';
import Button from '@/src/app/components/ui/Button';

type Invite = {
  id: number;
  email: string;
  role: string;
  created_by_name: string;
  created_by_email: string;
  created_at: string;
  expires_at: string;
  used: boolean;
};

export default function InvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await fetch('/api/invites');
        const data = await res.json();
        setInvites(data);
      } catch (error) {
        console.error('Error fetching invites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, []);

  return (
    <div className="p-6 bg-[var(--topbar-bg)] min-h-screen">
      <h1 className="mb-6 text-2xl font-bold text-[var(--text-color)]">Invite Management</h1>
      <div className="flex justify-end mb-5">
        <Button
          onClick={() => setShowModal(true)}
          className="w-fit"
          size="md"
          variant="primary"
        >
          + Create Invite
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading invites...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-md bg-[var(--topbar-bg)] shadow-md border border-[var(--hover-bg)]">
            <thead className="bg-[#00347B] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Role</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Created By</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Created At</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Expires At</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invites.map((invite) => (
                <tr key={invite.id} className="hover:bg-[var(--hover-bg)]">
                  <td className="px-4 py-2 text-sm text-[var(--content-text-color)]">{invite.email}</td>
                  <td className="px-4 py-2 text-sm text-[var(--content-text-color)]">{invite.role}</td>
                  <td className="px-4 py-2 text-sm text-[var(--content-text-color)]">
                    {invite.created_by_name}
                    <br />
                    <span className="text-xs text-gray-500">{invite.created_by_email}</span>
                  </td>
                  <td className="px-4 py-2 text-sm text-[var(--content-text-color)]">
                    {new Date(invite.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-[var(--content-text-color)]">
                    {new Date(invite.expires_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm font-medium">
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        invite.used
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {invite.used ? 'Used' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {invites.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-sm text-gray-500"
                  >
                    No invites found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <InviteFormModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
