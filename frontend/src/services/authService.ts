import { request } from '../utils/request';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

export interface UserResponse {
  id: string;
  username: string;
  createTime: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await request.post<AuthResponse>('/api/v1/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<UserResponse> => {
    const response = await request.post<UserResponse>('/api/v1/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem('mobius_token');
    if (token) {
      await request.post('/api/v1/auth/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    localStorage.removeItem('mobius_token');
  },
};
