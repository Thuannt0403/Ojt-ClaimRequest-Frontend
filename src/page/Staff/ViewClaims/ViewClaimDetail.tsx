import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Info,
  Building,
  User,
  FileText,
  Clock,
  CircleDollarSign,
} from "lucide-react"; // Added more icons
import { claimService } from "@/services/features/claim.service";
import { staffService } from "@/services/features/staff.service";
import { GetClaimByIdResponse } from "@/interfaces/claim.interface";

interface Staff {
  id: string;
  name: string;
  email: string;
}

export default function ClaimDialog({ claimId }: { claimId: string }) {
  const [open, setOpen] = useState(false);
  const [claim, setClaim] = useState<GetClaimByIdResponse | null>(null);
  const [staff, setStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClaimData = async () => {
    try {
      setIsLoading(true);
      const claimResponse = await claimService.getClaimById(claimId);
      if (claimResponse.data) {
        setClaim(claimResponse.data);

        if (claimResponse.data.financeId) {
          const staffResponse = await staffService.getStaffByIdv2(
            claimResponse.data.financeId
          );
          console.log("Detail staff data:", staffResponse);
          if (staffResponse.data) {
            setStaff({
              id: staffResponse.data.id,
              name: staffResponse.data.responseName,
              email: staffResponse.data.email,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching claim details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = async () => {
    setOpen(true);
    await fetchClaimData();
  };

  return (
    <>
      <Button
        variant="secondary"
        className="ml-2 bg-blue-100 rounded-2xl text-blue-500 hover:bg-blue-200 flex items-center gap-2"
        onClick={handleOpen}
      >
        <Info className="w-4 h-4" />
        View Detail
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800">
              Claim Details
            </DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          ) : claim ? (
            <div className="space-y-6 p-4">
              {/* Project Details Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Building className="w-5 h-5 text-gray-500" />
                  Project Details
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p>
                    <span className="font-medium text-gray-600">Name:</span>{" "}
                    <span className="text-gray-800">{claim.projectName}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">
                      Start Date:
                    </span>{" "}
                    <span className="text-gray-800">
                      {claim.projectStartDate}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">End Date:</span>{" "}
                    <span className="text-gray-800">
                      {claim.projectEndDate}
                    </span>
                  </p>
                </div>
              </div>

              {/* Staff Details Section (if available) */}
              {staff && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Paid By
                  </h3>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <p>
                      <span className="font-medium text-blue-600">Name:</span>{" "}
                      <span className="text-blue-800">{staff.name}</span>
                    </p>
                    <p>
                      <span className="font-medium text-blue-600">Email:</span>{" "}
                      <span className="text-blue-800">{staff.email}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Claim Details Section */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  Claim Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <span className="font-medium text-green-600">
                      Claim Type:
                    </span>{" "}
                    <span className="text-green-800">{claim.claimType}</span>
                  </p>
                  <p>
                    <span className="font-medium text-green-600">Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        claim.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : claim.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : claim.status === "Draft"
                          ? "bg-gray-100 text-gray-700"
                          : claim.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : claim.status === "Cancelled"
                          ? "bg-gray-200 text-gray-800"
                          : claim.status === "Paid"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-green-600">
                      Created At:
                    </span>{" "}
                    <span className="text-green-800">
                      {new Date(claim.createAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-green-600">
                      End Date:
                    </span>{" "}
                    <span className="text-green-800">{claim.endDate}</span>
                  </p>
                  <p>
                    <span className="font-medium text-green-600">
                      Total Hours:
                    </span>{" "}
                    <span className="text-green-800 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {claim.totalWorkingHours}{" "}
                      hr(s)
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-green-600">Amount:</span>{" "}
                    <span className="text-green-800 flex items-center gap-1">
                      <CircleDollarSign className="w-4 h-4" />{" "}
                      {claim.amount.toLocaleString()} VND
                    </span>
                  </p>
                  <p className="col-span-2">
                    <span className="font-medium text-green-600">Remark:</span>{" "}
                    <span className="text-green-800">
                      {claim.remark || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No claim data available.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
