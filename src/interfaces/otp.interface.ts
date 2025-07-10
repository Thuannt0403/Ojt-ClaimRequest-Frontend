import { ApiResponse } from './apiresponse.interface';

// Request interfaces
export interface SendOtpEmailRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  newPassword: string;
}

// Response interfaces - Using ApiResponse with null data type
// If specific data is returned by these endpoints, replace null with appropriate interfaces
export interface SendOtpEmailResponse {
  is_success: boolean;
  message: string;
  data?: any;
}

export type VerifyOtpResponse = ApiResponse<null>;