import { ApiResponse } from "@/interfaces/apiresponse.interface";
import {
  createVnpPaymentRequest,
  createVnpPaymentResponse,
} from "@/interfaces/vnpay.interface";
import axiosInstance from "../constant/axiosInstance";

export const vnpService = {
  vnpEndpoint: "/payment",

  async createVnpPayment(
    createVnpPaymentRequest: createVnpPaymentRequest
  ): Promise<ApiResponse<createVnpPaymentResponse>> {
    try {
      // Extract claimIds and financeId from the request object
      const { claimIds, financeId } = createVnpPaymentRequest;
  
      // Build query parameters for multiple claimIds
      const claimParams = claimIds.map(id => `claimIds=${encodeURIComponent(id)}`).join('&');
      const queryParams = `${claimParams}&financeId=${encodeURIComponent(financeId)}`;
  
      // Make the API call with multiple claimIds as query parameters
      const response = await axiosInstance.post<ApiResponse<createVnpPaymentResponse>>(
        `${this.vnpEndpoint}/create-payment-url?${queryParams}`,
        {}
      );
  
      return response.data;
    } catch (error: any) {
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.reason || "Create VNP payment failed");
      }
      throw new Error("Network error occurred");
    }
  },
};
