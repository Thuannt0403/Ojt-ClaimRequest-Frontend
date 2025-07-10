import { ApiResponse, PagingResponse } from '@/interfaces/apiresponse.interface';
import axiosInstance from '../constant/axiosInstance';
import { CancelClaimRequest, CancelClaimResponse, CreateClaimRequest, CreateClaimResponse, GetClaimByIdResponse, GetClaimResponse, UpdateClaimRequest, UpdateClaimResponse } from '@/interfaces/claim.interface';
import { RejectClaimRequest, RejectClaimResponse } from '@/interfaces/claim.interface';

export const claimService = {
    claimEndpoint: '/claims',
    
    async createClaim(claim: CreateClaimRequest): Promise<CreateClaimResponse> {
        try {
          const response = await axiosInstance.post<CreateClaimResponse>(
            this.claimEndpoint,
            claim
          );
          console.log("API response:", response);
      
          return response.data;
        } catch (error: any) {
          console.error("Error creating claim:", error);
          const apiError = error.response?.data as ApiResponse<any>;
          throw new Error(apiError?.reason || "Failed to create claim");
        }
      },
      

    async getClaims(effectiveStatus: string, pageNumber: number, pageSize: number, validatedViewMode: string, debouncedSearchText: string): Promise<PagingResponse<GetClaimResponse[]>> {
        try {
            const response = await axiosInstance.get<ApiResponse<PagingResponse<GetClaimResponse[]>>>(`${this.claimEndpoint}?viewMode=${validatedViewMode}&status=${effectiveStatus}&search=${debouncedSearchText}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
            // Ensure we return a valid PagingResponse structure
            return {
                items: response.data.data?.items ?? [], // Default to an empty array if undefined
                meta: (response.data.data ?? {}).meta || { total_pages: 0, current_page: 0, page_size: 0, total_items: 0 } // Default meta if undefined
            };
        } catch (error: unknown) {
            const apiError = (error as any).response?.data as ApiResponse<any>; // Specify a type instead of 'any'
            console.log(apiError);
            if (apiError) {
                throw new Error(apiError.reason || 'Get claims failed');
            }  
            throw new Error('Network error occurred');
        }
    },

    async getClaimById(claimId: string): Promise<ApiResponse<GetClaimByIdResponse>> {
        try {
            const response = await axiosInstance.get<ApiResponse<GetClaimByIdResponse>>(
                `${this.claimEndpoint}/${claimId}` // Correct endpoint for fetching claim details
            );
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.reason || "Get claim failed");
            }
            throw new Error("Network error occurred");
        }
    },
      
    async updateClaim(claimId: string, request: UpdateClaimRequest): Promise<ApiResponse<UpdateClaimResponse>> {
        try {
          const response = await axiosInstance.put<ApiResponse<UpdateClaimResponse>>(
            `${this.claimEndpoint}/${claimId}/update`,
            request
          );
          return response.data;
        } catch (error: any) {
          const apiError = error.response?.data as ApiResponse<any>;
          if (apiError) {
            throw new Error(apiError.reason || "Update claim failed");
          }
          throw new Error("Network error occurred");
        }
    },

    async cancelClaim(claimId: string ,request: CancelClaimRequest): Promise<ApiResponse<CancelClaimResponse>> {
        try {
            const response = await axiosInstance.put<ApiResponse<CancelClaimResponse>>(`${this.claimEndpoint}/${claimId}/cancel`, request);
            return response.data;

        } catch ( error : any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.reason || 'Cancel claim failed');
            }
            throw new Error('Network error occurred');
        }
    },
    
    async approveClaim(claimId: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axiosInstance.put<ApiResponse<boolean>>(
                `${this.claimEndpoint}/${claimId}/approve`
            );
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const statusCode = error.response.status;
                if (statusCode === 401) {
                    throw new Error("You don't have permission to perform this action.");
                }
                if (statusCode === 403) {
                    throw new Error("Forbidden: You are not allowed to approve this claim.");
                }
            }
            throw new Error("Approve claim failed or network error occurred.");
        }
    },
    

    // async deleteClaim(claimId: string): Promise<ApiResponse<any>> {
    //     try {
    //         const response = await axiosInstance.delete<ApiResponse<any>>(`${this.claimEndpoint}/${claimId}`);
    //         return response.data;
    //     } catch (error: any) {
    //         const apiError = error.response?.data as ApiResponse<any>;
    //         if (apiError) {
    //             throw new Error(apiError.reason || 'Delete claim failed');
    //         }
    //         throw new Error('Network error occurred');
    //     }
    // },

    // async getClaimStatuses(): Promise<ApiResponse<any>> {
    //     try {
    //         const response = await axiosInstance.get<ApiResponse<any>>(`${this.claimEndpoint}/statuses`);
    //         return response.data;
    //     } catch (error: any) {
    //         const apiError = error.response?.data as ApiResponse<any>;
    //         if (apiError) {
    //             throw new Error(apiError.reason || 'Get claim statuses failed');
    //         }
    //         throw new Error('Network error occurred');
    //     }
    // },

    async rejectClaim(claimId: string, request: RejectClaimRequest): Promise<ApiResponse<RejectClaimResponse>> {
        try {
            const response = await axiosInstance.put<ApiResponse<RejectClaimResponse>>(
                `${this.claimEndpoint}/${claimId}/reject`,
                request
            );
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.reason || 'Reject claim failed');
            }
            throw new Error('Network error occurred');
        }
    },

    async returnClaim(claimId: string, request: RejectClaimRequest): Promise<ApiResponse<RejectClaimResponse>> {
        try {
            const response = await axiosInstance.put<ApiResponse<RejectClaimResponse>>(
                `${this.claimEndpoint}/${claimId}/return`,
                request
            );
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.reason || 'Return claim failed');
            }
            throw new Error('Network error occurred');
        }
    },

    async submitClaim(claimId: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axiosInstance.put<ApiResponse<boolean>>(`${this.claimEndpoint}/${claimId}/submit`);
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.reason || 'Submit claim failed');
            }
            throw new Error('Network error occurred');
        }
    }
};