import api from './axios';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'hr' | 'employee';
  department: string;
  phone_number: string;
  date_joined: string;
  is_active: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'hr' | 'employee';
  department: string;
  phone_number: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  new_password2: string;
}

export const authAPI = {
  login: (credentials: LoginCredentials) =>
    api.post('/auth/login/', credentials),

  register: (data: RegisterData) =>
    api.post('/auth/register/', data),

  logout: (refresh_token: string) =>
    api.post('/auth/logout/', { refresh_token }),

  refreshToken: (refresh: string) =>
    api.post('/auth/token/refresh/', { refresh }),

  getProfile: () =>
    api.get('/auth/profile/'),

  updateProfile: (data: Partial<User>) =>
    api.patch('/auth/profile/', data),

  changePassword: (data: ChangePasswordData) =>
    api.put('/auth/change-password/', data),

  getUsers: (params?: any) =>
    api.get('/auth/users/', { params }),
};
