import { ApiResponse, PaginationMeta, PagingResponse } from '@/interfaces/apiresponse.interface';
import axiosInstance from '../constant/axiosInstance';
import { CreateProjectRequest, CreateProjectResponse, GetProjectResponse, UpdateProjectRequest } from '@/interfaces/project.interface';

export const projectService = {
    projectEndpoint: '/projects',

    async createProject(request: CreateProjectRequest): Promise<ApiResponse<CreateProjectResponse>> {
        try {
            const response = await axiosInstance.post<ApiResponse<CreateProjectResponse>>(
                `${this.projectEndpoint}`,
                request
            );

            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.reason || 'Create project failed');
            }
            throw new Error('Network error occurred');
        }
    },

    async deleteProject(id: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axiosInstance.put<ApiResponse<boolean>>(
                `${this.projectEndpoint}/${id}/delete`
            );
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.reason || 'Delete project failed');
            }
            throw new Error('Network error occurred');
        }
    },

    async getProjectById(id: string): Promise<ApiResponse<CreateProjectResponse>> {
        try {
            const response = await axiosInstance.get<ApiResponse<CreateProjectResponse>>(
                `${this.projectEndpoint}/${id}`
            );
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.reason || 'Get project failed');
            }
            throw new Error('Network error occurred');
        }
    },

    async getProjects(effectiveStatus: string, pageNumber: number, pageSize: number, validatedViewMode: string, debouncedSearchText: string): Promise<PagingResponse<GetProjectResponse[]>> {
        try {
            const response = await axiosInstance.get<ApiResponse<PagingResponse<GetProjectResponse[]>>>(`${this.projectEndpoint}?viewMode=${validatedViewMode}&status=${effectiveStatus}&search=${debouncedSearchText}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
            // Ensure we return a valid PagingResponse structure
            return {
                items: response.data.data?.items ?? [], // Default to an empty array if undefined
                meta: (response.data.data ?? {}).meta || { total_pages: 0, current_page: 0, page_size: 0, total_items: 0 } // Default meta if undefined
            };
        } catch (error: unknown) {
            const apiError = (error as any).response?.data as ApiResponse<any>; // Specify a type instead of 'any'
            console.log(apiError);
            if (apiError) {
                throw new Error(apiError.reason || 'Get projects failed');
            }  
            throw new Error('Network error occurred');
        }
    },

    async updateProject(id: string, request: UpdateProjectRequest): Promise<ApiResponse<CreateProjectResponse>> {
        try {
            const response = await axiosInstance.put<ApiResponse<CreateProjectResponse>>(
                `${this.projectEndpoint}/${id}/update`,
                request
            );
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.reason || 'Update project failed');
            }
            throw new Error('Network error occurred');
        }
    },
    
    async activateProject(projectId: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axiosInstance.put<ApiResponse<boolean>>(
                `${this.projectEndpoint}/${projectId}/activate`
            );
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || "Activate project failed");
            }
            throw new Error("Network error occurred");
        }
    },

    async deactivateProject(projectId: string): Promise<ApiResponse<boolean>> {
        try {
            const response = await axiosInstance.put<ApiResponse<boolean>>(
                `${this.projectEndpoint}/${projectId}/deactivate`
            );
            return response.data;
        } catch (error: any) {
            const apiError = error.response?.data as ApiResponse<any>;
            if (apiError) {
                throw new Error(apiError.message || "Deactivate project failed");
            }
            throw new Error("Network error occurred");
        }
    }
};