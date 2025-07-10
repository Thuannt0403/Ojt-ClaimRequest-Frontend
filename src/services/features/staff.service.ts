import { ApiResponse } from '@/interfaces/apiresponse.interface';
import axiosInstance from '../constant/axiosInstance';
import { GetStaffResponse, CreateStaffRequest, CreateStaffResponse, UpdateStaffRequest, UpdateStaffResponse, AssignStaffRequest, AssignStaffResponse, RemoveStaffRequest, RemoveStaffResponse, GetStaffByIdResponse } from '@/interfaces/staff.interface';
import { BASE_URL } from '../constant/apiConfig';

export const staffService = {
    staffEndpoint: '/staffs',

    async getStaffs(): Promise<ApiResponse<GetStaffResponse[]>> {
        const response = await axiosInstance.get<ApiResponse<GetStaffResponse[]>>(`${BASE_URL}${this.staffEndpoint}`);
        return response.data;
    },

    async getStaffById(id: string): Promise<ApiResponse<GetStaffResponse>> {
        try {
            console.log('Fetching staff with ID:', id);
            
            const response = await axiosInstance.get<ApiResponse<GetStaffResponse>>(
                `${BASE_URL}${this.staffEndpoint}/${id}`
            );
            
            console.log('Staff data response:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Get staff by ID error:', error);
            const apiError = error as { response?: { data: ApiResponse<void> } };
            if (apiError.response?.data) {
                throw new Error(apiError.response.data.message || 'Failed to fetch staff data');
            }
            throw new Error('Network error occurred');
        }
    },
    async getStaffByIdv2(id: string): Promise<ApiResponse<GetStaffByIdResponse>> {
        try {
            console.log('Fetching staff with ID:', id);
            
            const response = await axiosInstance.get<ApiResponse<GetStaffByIdResponse>>(
                `${BASE_URL}${this.staffEndpoint}/${id}`
            );
            
            console.log('Staff data response:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Get staff by ID error:', error);
            const apiError = error as { response?: { data: ApiResponse<void> } };
            if (apiError.response?.data) {
                throw new Error(apiError.response.data.message || 'Failed to fetch staff data');
            }
            throw new Error('Network error occurred');
        }
    },

    async createStaff(data: CreateStaffRequest): Promise<ApiResponse<CreateStaffResponse>> {
        try {
            console.log("Creating staff with data:", data);
            
            const salary = typeof data.salary === 'string' ? parseFloat(data.salary) : data.salary;

            const formData = new FormData(); // Sử dụng FormData để gửi file
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('systemRole', data.systemRole);
            formData.append('department', data.department);
            formData.append('salary', salary.toString());
            formData.append('isActive', 'true'); // Mặc định là true
            if (data.avatar) {
                formData.append('avatar', data.avatar); // Gửi file avatar
            }

            const response = await axiosInstance.post<ApiResponse<CreateStaffResponse>>(
                `${BASE_URL}${this.staffEndpoint}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } } // Đặt header cho multipart
            );

            console.log("Create response:", response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Create staff error:', error);
            const apiError = error as { response?: { data: ApiResponse<void> } };
            if (apiError.response?.data) {
                throw new Error(apiError.response.data.message || 'Create staff failed');
            }
            throw new Error('Network error occurred');
        }
    },
    
    async updateStaff(id: string, data: UpdateStaffRequest): Promise<ApiResponse<UpdateStaffResponse>> {
        try {
            const formData = new FormData();
            formData.append('Name', data.name);
            formData.append('Email', data.email);
            formData.append('SystemRole', data.systemRole);
            formData.append('Department', data.department);
            formData.append('Salary', data.salary.toString());
            formData.append('isActive', data.isActive.toString());
            if (data.avatar) {
                formData.append('Avatar', data.avatar); // Ensure this is a File
            }

            const response = await axiosInstance.put<ApiResponse<UpdateStaffResponse>>(
                `${BASE_URL}${this.staffEndpoint}/${id}/update`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            return response.data;
        } catch (error: unknown) {
            console.error('Update staff error:', error);
            const apiError = error as { response?: { data: ApiResponse<void> } };
            if (apiError.response?.data) {
                throw new Error(apiError.response.data.message || 'Update staff failed');
            }
            throw new Error('Network error occurred');
        }
    },

    async deleteStaff(staffId: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axiosInstance.put<ApiResponse<boolean>>(
                `${BASE_URL}${this.staffEndpoint}/${staffId}/delete`
            );
            return response.data;
        } catch (error: unknown) {
            console.error('Delete staff error:', error);
            const apiError = error as { response?: { data: ApiResponse<void> } };
            if (apiError.response?.data) {
                throw new Error(apiError.response.data.message || 'Delete staff failed');
            }
            throw new Error('Network error occurred');
        }
    },

    async assignStaff(staffId: string, request: AssignStaffRequest): Promise<ApiResponse<AssignStaffResponse>> {
        try {
            console.log('Assigning staff with ID:', staffId);
            console.log('Assignment request:', request);

            const response = await axiosInstance.post<ApiResponse<AssignStaffResponse>>(
                `${BASE_URL}${this.staffEndpoint}/${staffId}/assign`,
                request
            );

            console.log('Assignment response:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Assign staff error:', error);
            const apiError = error as { response?: { data: ApiResponse<void> } };
            if (apiError.response?.data) {
                throw new Error(apiError.response.data.message || 'Failed to assign staff');
            }
            throw new Error('Network error occurred');
        }
    },

    async removeStaff(staffId: string, request: RemoveStaffRequest): Promise<ApiResponse<RemoveStaffResponse>> {
        try {
            console.log('Removing staff with ID:', staffId);
            console.log('Remove request:', request);

            const response = await axiosInstance.delete<ApiResponse<RemoveStaffResponse>>(
                `${BASE_URL}${this.staffEndpoint}/${staffId}/remove`,
                { data: request }
            );

            console.log('Remove response:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Remove staff error:', error);
            const apiError = error as { response?: { data: ApiResponse<void> } };
            if (apiError.response?.data) {
                throw new Error(apiError.response.data.message || 'Failed to remove staff from project');
            }
            throw new Error('Network error occurred');
        }
    },
}

