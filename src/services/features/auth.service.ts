import { ApiResponse } from '@/interfaces/apiresponse.interface';
import axiosInstance from '../constant/axiosInstance';
import { ILoginResponse, ILoginRequest, IChangePasswordRequest, IChangePasswordResponse, IResetPasswordRequest, IResetPasswordResponse } from '@/interfaces/auth.interface';

export const authService = {
  authEndpoint: '/auth',

  async login(credentials: ILoginRequest): Promise<ApiResponse<ILoginResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<ILoginResponse>>(`${this.authEndpoint}/login`, credentials);
      if (!response.data || !response.data.is_success || !response.data.data) {
        throw new Error(response.data?.reason || "Login failed");
      }
      
      const loginData = response.data.data as ILoginResponse;
      
      if (!loginData.accessToken || !loginData.refreshToken) {
        throw new Error("Invalid response: Missing accessToken or refreshToken");
      }
      
      this.setToken(loginData.accessToken);
      this.setRefreshToken(loginData.refreshToken);
      

      return response.data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.reason || "Network error occurred");
    }
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  setToken(token: string): void {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  },

  async refreshToken(): Promise<string | null> {
    try {
      console.log("refreshToken() called");
  
      const refreshToken = this.getRefreshToken();
  
      if (!refreshToken) {
        console.error("No refresh token available");
        return null;
      }
  
      const response = await axiosInstance.post<{ accessToken: string }>(
        `${this.authEndpoint}/refresh-token`,
        { refreshToken }
      );
  
      console.log("Refresh Token Response:", response.data);
      const newAccessToken = response.data.accessToken;
  
      if (!newAccessToken) {
        console.error("Invalid refresh response");
        return null;
      }
  
      this.setToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Refresh token request failed:", error);
      this.logout();
      return null;
    }
  },
  

  validateOtp: async function (data: { email: string, otp_code: string }): Promise<ApiResponse<any>> {
    try {
      const apiPayload = {
        email: data.email,
        otp: data.otp_code
      };
      
      const response = await axiosInstance.post<ApiResponse<any>>('otp/validate', apiPayload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async function (data: IChangePasswordRequest): Promise<IChangePasswordResponse> {
    try {
      const apiPayload = {
        email: data.email,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        otp: data.otp
      };
      
      const response = await axiosInstance.post<IChangePasswordResponse>(
        this.authEndpoint + '/change-password',
        apiPayload
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        return {
          is_success: false,
          message: apiError.reason || 'Password change failed',
          data: apiError.data || {},
          attemptsLeft: apiError.data?.attemptsLeft,
          reason: apiError.reason,
          status_code: apiError.status_code
        };
      }
      return {
        is_success: false,
        message: 'Network error occurred',
        data: {},
        reason: 'Network error'
      };
    }
  },

  resetPassword: async function (data: IResetPasswordRequest): Promise<IResetPasswordResponse> {
    try {
      const apiPayload = {
        email: data.email,
        newPassword: data.newPassword,
        otp: data.otp
      };
      
      const response = await axiosInstance.post<IResetPasswordResponse>(
        this.authEndpoint + '/forgot-password',
        apiPayload
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        return {
          is_success: false,
          message: apiError.reason || 'Password reset failed',
          data: apiError.data || {},
          attemptsLeft: apiError.data?.attemptsLeft,
          reason: apiError.reason,
          status_code: apiError.status_code
        };
      }
      return {
        is_success: false,
        message: 'Network error occurred',
        data: {},
        reason: 'Network error'
      };
    }
  },
  handleApiError<T>(error: any, defaultMessage: string): T {
    const apiError = error.response?.data as ApiResponse<any>;
    return {
      is_success: false,
      message: apiError?.reason || defaultMessage,
      data: apiError?.data || {},
      attemptsLeft: apiError?.data?.attemptsLeft,
      reason: apiError?.reason,
      status_code: apiError?.status_code,
    } as unknown as T;
  }
};