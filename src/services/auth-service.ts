import { apiClient } from "@/lib/api";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export const authService = {
  /**
   * Login - Backend akan auto-detect role dari username
   * @param credentials - username dan password
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Deteksi format username untuk endpoint yang tepat
    const username = credentials.username;
    let endpoint = "/auth/login/admin"; // default

    // Cek format email UMM
    if (username.includes("@umm.ac.id")) {
      endpoint = "/auth/login/pegawai";
    }
    // Cek format NIM (angka semua, biasanya 15 digit)
    else if (/^\d+$/.test(username)) {
      endpoint = "/auth/login/mahasiswa";
    }

    const response = await apiClient.post<LoginResponse>(endpoint, credentials);
    return response.data;
  },

  /**
   * Get current user info
   */
  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  /**
   * Logout (client-side)
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user");
  },
};