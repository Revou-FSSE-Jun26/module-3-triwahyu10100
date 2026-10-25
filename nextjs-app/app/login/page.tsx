import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Masuk — RevoShop" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Masuk ke Akun Anda</h1>
      <LoginForm />
    </div>
  );
}
