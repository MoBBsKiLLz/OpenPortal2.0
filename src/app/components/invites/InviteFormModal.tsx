"use client";

import { useState, useEffect, useMemo } from "react";
import Select, { components, OptionProps, GroupBase } from "react-select";
import Button from "@/src/app/components/ui/Button";
import { Role, Account, Facility } from "@/src/types";
import { singleSelectStyles, multiSelectStyles } from "@/lib/reactSelectStyles";

// Type used for options in react-select
interface OptionType {
  label: string;
  value: number | string;
}

// Props for the modal component
interface InviteFormModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

// Custom checkbox option for multi-select dropdowns
const CheckboxOption = <T extends OptionType>(
  props: OptionProps<T, true, GroupBase<T>>
) => (
  <components.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      onChange={() => {}} // Prevent checkbox click from overriding selection behavior
      className="mr-2"
    />
    <label>{props.label}</label>
  </components.Option>
);

export default function InviteFormModal({ onClose, onSuccess }: InviteFormModalProps) {
  // State definitions
  const [roles, setRoles] = useState<Role[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<OptionType[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<OptionType[]>([]);
  const [role, setRole] = useState<OptionType | null>(null);
  const [formData, setFormData] = useState({ email: "" });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Fetch available roles when component mounts
  useEffect(() => {
    fetch("/api/roles")
      .then((res) => res.json())
      .then(setRoles);
  }, []);

  // Fetch accounts if role requires them and not already loaded
  useEffect(() => {
    if (!role) return;

    const name = roles.find((r) => r.role_id === role.value)?.role_name;
    const needsAccounts = [
      "Account Manager",
      "Regional Manager",
      "Facility Manager",
    ].includes(name || "");

    if (needsAccounts && accounts.length === 0) {
      fetch("/api/accounts")
        .then((res) => res.json())
        .then(setAccounts);
    }
  }, [role, roles, accounts.length]);

  // Fetch facilities based on selected accounts
  useEffect(() => {
    if (selectedAccounts.length === 0) return;

    const accountIds = selectedAccounts.map((a) => a.value);

    fetch("/api/facilities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountIds }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch facilities");
        }
        return res.json();
      })
      .then(setFacilities)
      .catch((error) => {
        console.error("Error fetching facilities:", error);
      });
  }, [selectedAccounts]);

  // Memoized helper to get current role name
  const roleName = useMemo(
    () => roles.find((r) => r.role_id === role?.value)?.role_name || "",
    [role, roles]
  );

  // Boolean for facility manager role check
  const isFacilityManager = roleName === "Facility Manager";

  // Facility dropdown options, filtered by selected accounts
  const facilityOptions: OptionType[] = useMemo(() => {
    const filtered = facilities.filter((f) =>
      selectedAccounts.some((a) => a.value === f.account_id)
    );
    return [
      { label: "Select All Facilities", value: -1 },
      ...filtered.map((f) => ({
        label: f.facility_name,
        value: f.facility_id,
      })),
    ];
  }, [facilities, selectedAccounts]);

  // If "Select All Facilities" is selected, select all actual facilities
  useEffect(() => {
    if (selectedFacilities.some((opt) => opt.value === -1)) {
      setSelectedFacilities(facilityOptions.filter((opt) => opt.value !== -1));
    }
  }, [selectedFacilities, facilityOptions]);

  // Get current user ID on component mount
  useEffect(() => {
    fetch("/api/user")
      .then(res => res.json())
      .then(data => setCurrentUserId(data.id))
      .catch(err => console.error("Failed to fetch current user", err));
  }, []);

  // Handle invite submission
  const handleSubmit = async () => {
    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        role: role?.label,
        account_ids: selectedAccounts.map((a) => a.value),
        facility_ids: selectedFacilities.map((f) => f.value),
        created_by: currentUserId,
      }),
    });

    if (res.ok) {
      onClose();
      onSuccess?.();
    } else {
      console.error(await res.json());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-[var(--topbar-bg)] text-black dark:text-[var(--text-color)] rounded-lg p-6 w-full max-w-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create Invite</h2>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Role Selector */}
        <div className="mb-4">
          <label className="block mb-1">Role</label>
          <Select<OptionType, false>
            value={role}
            onChange={(option) => {
              setRole(option);
              setSelectedAccounts([]);
              setSelectedFacilities([]);
            }}
            options={roles.map((r) => ({
              label: r.role_name,
              value: r.role_id,
            }))}
            styles={singleSelectStyles}
            className="text-sm"
          />
        </div>

        {/* Accounts Selector */}
        {["Account Manager", "Regional Manager", "Facility Manager"].includes(
          roleName
        ) && (
          <div className="mb-4">
            <label className="block mb-1">Accounts</label>
            {isFacilityManager ? (
              // Single account select for Facility Manager
              <Select<OptionType, false>
                value={selectedAccounts[0] || null}
                onChange={(opt) => setSelectedAccounts(opt ? [opt] : [])}
                options={accounts.map((a) => ({
                  label: a.account_name,
                  value: a.account_id,
                }))}
                styles={singleSelectStyles}
                className="text-sm"
              />
            ) : (
              // Multi-select for other roles
              <Select<OptionType, true>
                value={selectedAccounts}
                onChange={(opts) => setSelectedAccounts([...(opts || [])])}
                options={accounts.map((a) => ({
                  label: a.account_name,
                  value: a.account_id,
                }))}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option: CheckboxOption }}
                styles={multiSelectStyles}
                className="text-sm"
              />
            )}
          </div>
        )}

        {/* Facilities Selector */}
        {["Regional Manager", "Facility Manager"].includes(roleName) &&
          selectedAccounts.length > 0 && (
            <div className="mb-4">
              <label className="block mb-1">Facilities</label>
              <Select
                value={selectedFacilities}
                onChange={(opts) => setSelectedFacilities([...(opts || [])])}
                options={facilityOptions}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option: CheckboxOption }}
                styles={multiSelectStyles}
                className="text-sm"
              />
            </div>
          )}

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Send Invite
          </Button>
        </div>
      </div>
    </div>
  );
}
