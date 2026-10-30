"use client";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import type { User } from "@/lib/types";

export interface AccountFormProps {
  user: User;
}

const ROLE_LABEL: Record<User["role"], string> = {
  customer: "Pelanggan",
  admin: "Admin",
};

export function AccountForm({ user }: AccountFormProps) {
  // Hanya tiga field ini yang ada di UserUpdateSchema
  // (backend/app/schemas.py) — email dan password sengaja tidak
  // dimasukkan ke form ini, lihat docstring update_user() di
  // backend/app/routes/user_routes.py.
  const [username, setUsername] = useState(user.username ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [address, setAddress] = useState(user.address ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim() || null,
          phone: phone.trim() || null,
          address: address.trim() || null,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(body?.error ?? "Gagal menyimpan perubahan profil.");
      toast.success("Profil berhasil diperbarui.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan perubahan profil.";
      toast.error(`Gagal: ${message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <dl className="space-y-2 text-caption">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Email</dt>
          <dd className="text-foreground">{user.email}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Peran</dt>
          <dd className="text-foreground">{ROLE_LABEL[user.role]}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Bergabung sejak</dt>
          <dd className="text-foreground">
            {new Date(user.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </dd>
        </div>
      </dl>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="username"
            className="block text-caption font-medium text-foreground">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted transition-colors motion-safe:duration-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-caption font-medium text-foreground">
            Nomor Telepon
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted transition-colors motion-safe:duration-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-caption font-medium text-foreground">
            Alamat
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted transition-colors motion-safe:duration-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-colors motion-safe:duration-base hover:bg-accent/90 disabled:opacity-60">
          {submitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
