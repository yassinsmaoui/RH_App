import axios from './axios';
import { User } from '../store/slices/authSlice';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export const authAPI = {
  login: (data: LoginRequest) => 
    axios.post<AuthResponse>('/auth/login/', data),
  
  register: (data: RegisterRequest) => 
    axios.post<AuthResponse>('/auth/register/', data),
  
  logout: () => 
    axios.post('/auth/logout/'),
  
  refreshToken: () => 
    axios.post<RefreshTokenResponse>('/auth/refresh/'),
  
  verifyToken: () => 
    axios.get<{ user: User }>('/auth/verify/'),
  
  forgotPassword: (email: string) => 
    axios.post('/auth/forgot-password/', { email }),
  
  resetPassword: (token: string, password: string) => 
    axios.post('/auth/reset-password/', { token, password }),
  
  verifyEmail: (token: string) => 
    axios.post('/auth/verify-email/', { token }),
  
  resendVerificationEmail: (email: string) => 
    axios.post('/auth/resend-verification/', { email }),
  
  changePassword: (currentPassword: string, newPassword: string) => 
    axios.post('/auth/change-password/', { 
      currentPassword, 
      newPassword 
    }),
  
  enable2FA: () => 
    axios.post<{ secret: string; qrCode: string }>('/auth/2fa/enable/'),
  
  disable2FA: (code: string) => 
    axios.post('/auth/2fa/disable/', { code }),
  
  verify2FA: (code: string) => 
    axios.post<AuthResponse>('/auth/2fa/verify/', { code }),
  
  updateProfile: (data: Partial<User>) => 
    axios.patch<{ user: User }>('/auth/profile/', data),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return axios.post<{ avatarUrl: string }>('/auth/avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteAccount: (password: string) => 
    axios.post('/auth/delete-account/', { password }),
  
  getSessions: () => 
    axios.get<{ sessions: any[] }>('/auth/sessions/'),
  
  revokeSession: (sessionId: string) => 
    axios.delete(`/auth/sessions/${sessionId}/`),
};

export default authAPI;
