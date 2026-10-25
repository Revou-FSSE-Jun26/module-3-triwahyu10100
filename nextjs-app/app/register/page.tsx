import type { Metadata } from "next";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Daftar — RevoShop" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Daftar Akun Baru</h1>
      <RegisterForm />
    </div>
  );
}
