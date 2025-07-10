import { GetProjectResponse } from "./project.interface";

export enum ClaimType {
  HardwareRequest = "HardwareRequest",
  SoftwareLicense = "SoftwareLicense",
  OvertimeCompensation = "OvertimeCompensation",
  ProjectBudgetIncrease = "ProjectBudgetIncrease",
  EquipmentRepair = "EquipmentRepair",
  Miscellaneous = "Miscellaneous",
}

export interface GetClaimResponse {
  id: string;
  projectName: string;
  project?: GetProjectResponse;
  staffName: string;
  status: string;
  totalWorkingHours: number;
  projectStartDate: Date;
  projectEndDate: Date;
  amount: number;
  createAt: string;
}

export interface GetClaimByIdResponse {
  id: string;
  startdate: string;
  endDate: string;
  totalWorkingHours: number;
  amount: number;
  claimType: string;
  status: string;
  createAt: string;
  updateAt: string;
  staffName: string;
  projectName: string;
  projectStartDate: string;
  projectEndDate: string;
  financeId: string;
  remark: string;
}

// export interface CreateClaimRequest {
//   projectName: string;
//   roleInProject: string;
//   projectStartDate: string;
//   projectEndDate: string;
//   totalWorking: string;
//   claimDate: string;
//   staffReason: string;
//   status: string;
//   userId?: string;
// }

// export interface CreateClaimResponse {
//   is_success: boolean;
//   message?: string;
//   data?: any;
// }

export interface UpdateClaimRequest {
  claimType: ClaimType;
  name: string;
  remark: string;
  amount: number;
  startDate: string;
  endDate: string;
  totalWorkingHours: number;
}

export interface UpdateClaimResponse {
  claimType: ClaimType;
  name: string;
  remark: string;
  amount: number;
  startDate: string;
  endDate: string;
  totalWorkingHours: number;
  updateAt: string;
}

export interface CancelClaimRequest {
  remark: string;
}

export interface CancelClaimResponse {
  claimId: string;
  name: string;
  status: string;
  remark?: string;
  amount?: number;
  updatedAt: string;
  claimerId: string;
}

export interface ClaimRequest {
  key: string;
  name: string;
  projectName: string;
  claimDate: string;
  totalWorking: string;
  status: "Approved" | "Paid";
}

export interface RejectClaimRequest {
  remark: string;
  approverId: string;
}

export interface RejectClaimResponse {
  id: string;
  status: ClaimStatus;
  remark: string;
  approverId: string;
  updateAt: string;
}

export interface ReturnClaimRequest {
  remark: string;
  approverId: string;
  status: ClaimStatus;
}

export enum ClaimStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  CANCELLED = "Cancelled",
  DRAFT = "Draft",
}

export interface CreateClaimRequest {
  claimType: ClaimType;
  name: string;
  remark: string;
  amount: number;
  createAt?: string;
  totalWorkingHours: number;
  startDate: string;
  endDate: string;
  projectId: string;
  claimerId: string;
}

export interface CreateClaimResponse {
  claimType: ClaimType;
  name: string;
  remark: string;
  amount: number;
  createAt: string;
  totalWorkingHours: number;
  startDate: string;
  endDate: string;
  project: GetProjectResponse;
  claimerId: string;
}
