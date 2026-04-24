export interface User {
  id: number;
  username: string;
  role: string;
  realName?: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  realName: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: string;
  realName?: string;
  phone?: string;
  email?: string;
}
