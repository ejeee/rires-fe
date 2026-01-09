"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth-service";
import { Loader2, Command } from "lucide-react";
import type { UserType } from "@/types/auth";
import { cn } from "@/lib/utils";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Username dan password wajib diisi",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(credentials);

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_type", response.data.user_type);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        toast({
          title: "Login Berhasil",
          description: `Selamat datang, ${getUserName(response.data.user_type, response.data.user)}`,
        });

        const redirectPaths: Record<UserType, string> = {
          admin: "/dashboard",
          mahasiswa: "/dashboard",
          reviewer: "/dashboard",
        };

        router.push(redirectPaths[response.data.user_type]);
      }
    } catch (error: any) {
      console.error("Login error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat login. Silakan coba lagi.";

      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserName = (userType: UserType, user: any) => {
    if (userType === "admin") return user.nama_user;
    if (userType === "mahasiswa") return user.nama;
    if (userType === "reviewer") return user.nama;
    return "User";
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {/* Mobile Logo */}
      <div className="flex items-center justify-center gap-2 lg:hidden">
        <Command className="h-6 w-6" />
        <span className="text-lg font-medium">Student RIRES</span>
      </div>

      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Login ke akun Anda
        </h1>
        <p className="text-sm text-muted-foreground">
          Masukkan username dan password untuk login
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username / NIM / Email UMM</Label>
          <Input
            id="username"
            type="text"
            placeholder="username@umm.ac.id"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Masukkan password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Dengan login, Anda menyetujui{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-primary">
          Syarat Layanan
        </Link>{" "}
        dan{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-primary">
          Kebijakan Privasi
        </Link>
        .
      </p>
    </div>
  );
}