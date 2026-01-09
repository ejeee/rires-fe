export type UserType = "admin" | "mahasiswa" | "reviewer";

export interface LoginRequest {
  username: string;
  password: string;
}

// Admin User
export interface AdminUser {
  id: number;
  nama_user: string;
  username: string;
  level_user: number;
  status: number;
}

// Mahasiswa User
export interface MahasiswaUser {
  nim: string;
  nama: string;
  prodi: string;
  fakultas: string;
}

// Reviewer User
export interface ReviewerUser {
  id: number;
  nama: string;
  email: string;
}

// Login Response
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user_type: UserType;
    user: AdminUser | MahasiswaUser | ReviewerUser;
    expires_in: number;
  };
}

// Error Response
export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}