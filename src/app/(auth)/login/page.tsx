import { Command } from "lucide-react";
import { LoginForm } from "@/_components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-100 p-10">
        <div className="flex items-center gap-2 text-lg font-medium">
          <Command className="h-6 w-6" />
          <span>Student RIRES</span>
        </div>

        <blockquote className="space-y-2">
          <p className="text-lg">
            &ldquo;Sistem ini sangat membantu dalam pengelolaan PKM, PPK ORMAWA, dan P2MW
            dengan lebih efisien dan terstruktur.&rdquo;
          </p>
          <footer className="text-sm text-zinc-600">- Tim PKM UMM</footer>
        </blockquote>
      </div>

      {/* Right Side - Login Form Container */}
      <div className="flex items-center justify-center py-12 px-4">
        {/* Panggil Component LoginForm di sini */}
        <LoginForm className="mx-auto w-[350px]" />
      </div>
    </div>
  );
}