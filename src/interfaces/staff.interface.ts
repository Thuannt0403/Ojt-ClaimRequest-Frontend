import { ProjectRole } from "./project.interface";

export enum SystemRole {
  Admin = 'Admin',
  Finance = 'Finance',
  Approver = 'Approver',
  Staff = 'Staff'
}


export enum Department {
    ProjectManagement = 'ProjectManagement',
    Engineering = 'Engineering',
    FinancialDivision = 'FinancialDivision',
    BusinessOperations = 'BusinessOperations'
}

export interface GetStaffResponse {
    id: string;
    responseName: string;
    email: string;
    password: string;
    systemRole: SystemRole;
    department: Department;
    salary: number;
    isActive: boolean;
    avatar: string;
}

export interface GetStaffByIdRequest {
    id: string;
}

export interface GetStaffByIdResponse {
    id: string;
    responseName: string;
    email: string;
    systemRole : SystemRole;
    departent : Department;
    salary: number;
    isActive: boolean;
    avatar: string;
}

export interface CreateStaffRequest {
    name: string;
    email: string;
    password: string;
    systemRole: SystemRole;
    department: Department;
    salary: number;
    isActive: boolean;
    avatar?: File | null;
}

export interface CreateStaffResponse {
    id: string;
    responseName: string;
    email: string;
    systemRole: SystemRole;
    department: Department;
    salary: number;
    isActive: boolean;
    avatar: string;
}

export interface UpdateStaffRequest {
    id: string;
    name: string;
    email: string;
    systemRole: SystemRole;
    department: Department;
    salary: number;
    isActive: boolean;
    avatar?: File | null;
}

export interface UpdateStaffResponse {
    name: string;
    email: string;
    password: string;
    systemRole: SystemRole;
    department: Department;
    salary: number;
    isActive: boolean;
    avatar: string;
}

export interface DeleteStaffRequest {
    id: string;
}

export interface AssignStaffRequest {
    ProjectId: string;
    AssignerId: string;
    ProjectRole: ProjectRole;
}

export interface AssignStaffResponse {
    id: string;
    projectId: string;
    staffId: string;
    ProjectRole: ProjectRole;
}

export interface RemoveStaffRequest {
    projectId: string;
    removerId: string;
}

export interface RemoveStaffResponse {
    id: string;
    staffId: string;
    projectId: string;
    projectRole: ProjectRole;
}