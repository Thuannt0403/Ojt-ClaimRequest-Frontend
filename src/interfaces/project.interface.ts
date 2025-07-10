export enum ProjectStatus {
    Draft = "Draft",
    Ongoing = "Ongoing",
    Rejected = "Rejected",
    Archived = "Archived"
}

export enum Department {
    ProjectManagement = "ProjectManagement",
    Engineering = "Engineering",
    FinancialDivision = "FinancialDivision",
    BusinessOperations = "BusinessOperations"
}

export enum ProjectRole {
    ProjectManager = "ProjectManager",
    Developer = "Developer",
    Tester = "Tester",
    BusinessAnalyst = "BusinessAnalyst",
    QualityAssurance = "QualityAssurance",
    Manager = "Manager"
}

export type DateOnly = string;

export interface CreateProjectResponse {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    startDate: DateOnly;
    endDate: DateOnly | null;
    budget: number;
    projectManagerId: string;
    projectManager: CreateStaffResponse;
    projectStaffs: ProjectStaffResponse[];
}

export interface CreateStaffResponse {
    id: string;
    responseName: string;
    email: string;
    password: string;
    systemRole: string;
    department: string;
    salary: number;
    isActive: boolean;
    avatar: string | null;
}

export interface GetProjectResponse {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    startDate: DateOnly;
    endDate: DateOnly | null;
    budget: number;
    projectManagerId: string;
    projectManager: CreateStaffResponse;
    projectStaffs: ProjectStaffResponse[];
}

export interface CreateProjectRequest {
    name: string;
    description: string;
    startDate: DateOnly;
    endDate: DateOnly | null;
    budget: number;
    projectManagerId: string;
    status: ProjectStatus;
}

export interface UpdateProjectRequest {
    name: string;
    description: string;
    startDate: DateOnly;
    endDate: DateOnly | null;
    budget: number;
    projectManagerId: string;
    status: ProjectStatus | null;
}

export interface ProjectStaffResponse {
    staffId: string;
    staffName: string;
    staffEmail: string;
    department: Department;
    role: ProjectRole;
}