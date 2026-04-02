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
  data: User;
  status: number;
  message: string;
}

export type UserInput = {
  id: number;
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type UserLoginResponse = {
  status: number;
  message: string;
};
export type UserLoginInput = {
  email: string;
  password: string;
};
