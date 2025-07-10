import { SendOtpEmailRequest, SendOtpEmailResponse, VerifyOtpResponse } from '@/interfaces/otp.interface';
import axiosInstance from '../constant/axiosInstance';

export const otpService = {
  sendOtpEndpoint: '/email/send-otp',
  validateOtpEndpoint: '/otp/validate',

  async sendOtpEmail(data: SendOtpEmailRequest): Promise<SendOtpEmailResponse> {
    try {
      const response = await axiosInstance.post(
        this.sendOtpEndpoint, 
        data
      );
      return {
        is_success: true,  
        message: response.data.message || 'OTP sent successfully.',
        data: response.data
      };
    } catch (error: any) {
      return {
        is_success: false,
        message: error.response?.data?.message || 'Failed to send OTP',
        data: null
      };
    }
  },

  async validateOtp(data: { email: string, otp: string }): Promise<VerifyOtpResponse> {
    try {
      const response = await axiosInstance.post<VerifyOtpResponse>(
        this.validateOtpEndpoint, 
        data
      );
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as VerifyOtpResponse;
      if (apiError) {
        throw new Error(apiError.reason || 'Failed to validate OTP');
      }
      throw new Error('Network error occurred');
    }
  }
};