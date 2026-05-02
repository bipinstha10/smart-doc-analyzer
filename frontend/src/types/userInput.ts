export type User = {
  id: number;
  name: string;
  phone: string;
  email: string;
  password: string;
};

export interface UserListResponse {
  data: User[];
  status: number;
  message: string;
}

export interface UserResponse {
  id: number;
  email: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: UserResponse;
}

export type UserInput = {
  id: number;
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type UserLoginInput = {
  email: string;
  password: string;
};
