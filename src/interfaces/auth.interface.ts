// interface IAuthUser: kieu du lieu cua user
export interface IAuthUser {
  department: string;
  email: string;
  fullName: string;
  id: string;
  role: SystemRole;
  avatarUrl: string;
}

export interface ILoginResponse {
  accessToken: string;
  department: string;
  email: string;
  fullName: string;
  id: string;
  role: SystemRole
  // expiration: string; 
  avatarUrl: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
  otp: string;
}

export interface IChangePasswordResponse {
  is_success: boolean;
  message?: string;
  reason?: string;
  status_code?: number;
  data?: {
    attemptsLeft: number;
  };
  attemptsLeft?: number;
}

export interface IResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IResetPasswordResponse {
  is_success: boolean;
  message?: string;
  reason?: string;
  status_code?: number;
  data?: {
    attemptsLeft: number;
  };
  attemptsLeft?: number; 
}
export enum SystemRole {
  ADMIN = 'Admin',
  APPROVER = 'Approver',
  STAFF = 'Staff',
  FINANCE = 'Finance'
}

