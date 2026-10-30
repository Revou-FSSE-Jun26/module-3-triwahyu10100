import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { resolveAuthenticatedUser } from "@/lib/require-admin";
import { fetchFromApi } from "@/lib/api";
import { Container } from "@/components/layout/Container";
import { AccountForm } from "@/components/AccountForm";
import type { User } from "@/lib/types";

export const metadata: Metadata = { title: "Akun Saya — RevoShop" };

export default async function AccountPage() {
  // middleware.ts sudah mengharuskan login untuk /account — redirect() di
  // sini hanya jaring pengaman kalau fungsi ini dipanggil tanpa lewat
  // middleware (misal saat testing).
  const authUser = await resolveAuthenticatedUser();
  if (!authUser) redirect("/login");

  // GET /users/<id> adalah endpoint publik (lihat user_routes.py's
  // get_user()) — tidak butuh Authorization header untuk pembacaan ini.
  const user = await fetchFromApi<User>(`/users/${authUser.id}`);

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-h1">Akun Saya</h1>
        <div className="mt-6 max-w-lg">
          <AccountForm user={user} />
        </div>
      </div>
    </Container>
  );
}
