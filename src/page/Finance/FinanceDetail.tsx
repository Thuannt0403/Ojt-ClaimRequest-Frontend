import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { financeDetail, updateClaimStatus } from "@/services/mockData";

interface FinanceDetailData {
  staffName: string;
  projectName: string;
  claimDate: string;
  phoneNumber: string;
  approvedBy: string;
  status: string;
  projectStartDate: string;
  projectEndDate: string;
  email: string;
  totalCompensation: string;
  reason: string;
  staffImage?: string;
  staffId?: string;
  department?: string;
  projectRole?: string;
  workLocation?: string;
  address?: string;
  claimType?: string;
  workHours?: string;
}

const FinanceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<FinanceDetailData>(() => {
    const storedStatus = localStorage.getItem(`financeClaimStatus_${id}`);
    const initialData: FinanceDetailData = financeDetail[id as string] || {
      staffName: "Not Found",
      projectName: "Not Found",
      claimDate: "N/A",
      phoneNumber: "N/A",
      approvedBy: "N/A",
      status: "N/A",
      projectStartDate: "N/A",
      projectEndDate: "N/A",
      email: "N/A",
      totalCompensation: "N/A",
      reason: "Claim request not found",
    };

    return storedStatus ? { ...initialData, status: storedStatus } : initialData;
  });

  useEffect(() => {
    if (detail.status !== "N/A") {
      localStorage.setItem(`financeClaimStatus_${id}`, detail.status);
    }
  }, [detail.status, id]);

  const handleExit = (): void => {
    navigate("/finance/request");
  };

  const handleDownload = (): void => {
    console.log("Download clicked");
  };

  const handlePay = (): void => {
    const newStatus = "Paid";
    setDetail(prev => ({
      ...prev,
      status: newStatus
    }));
    
    if (id) {
      updateClaimStatus(id, newStatus);
    }
  };

  const statusContent: Record<string, JSX.Element> = {
    approved: (
      <div className="flex justify-end gap-6 mt-5 pt-4 border-t border-gray-200">
        <button 
          className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
          onClick={handleExit}
        >
          Back
        </button>
        <button 
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          onClick={handlePay}
        >
          Pay
        </button>
      </div>
    ),
    Paid: (
      <div className="text-center pt-5 mt-5 border-t border-gray-200">
        <div className="text-green-600 text-lg font-semibold mb-4">
          This claim has been paid successfully!
        </div>
        <div className="text-base mb-5">
          Total Compensation:{" "}
          <span className="text-green-500 font-bold text-lg">{detail.totalCompensation}</span>
        </div>
        <div className="flex justify-center gap-3">
          <button 
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
            onClick={handleExit}
          >
            Back
          </button>
          <button 
            className="px-6 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
            onClick={handleDownload}
          >
            Download Claim
          </button>
        </div>
      </div>
    ),
  };

  return (
    <div className="flex bg-gray-100">
      <div className="flex-1">
        <h2 className="text-2xl mt-[-1%] font-bold text-gray-900 ml-[1.5%] mb-1">
          Binance Request Details
        </h2>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">
            {/* Staff Information Card */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex flex-col items-center">
                <img
                  src={detail.staffImage}
                  alt={detail.staffName}
                  className="w-[250px] h-[250px] rounded-lg mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-1">
                  {detail.staffName}
                </h1>
                <p className="text-sm text-gray-500 mb-1">ID: {detail.staffId}</p>
                <p className="text-sm text-gray-500 mb-4">{detail.email}</p>

                <div className="w-full mb-5 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      detail.status === "approved" 
                        ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-700" 
                        : "bg-white text-blue-700 border-2 border-blue-700"
                    }`}>
                      {detail.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Approved By:</span>
                    <span className="text-sm font-semibold px-3 py-1">
                      {detail.approvedBy}
                    </span>
                  </div>
                </div>

                <div className="w-full border-b border-gray-200 pb-4">
                  <h3 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-gray-200">
                    Contact Information
                  </h3>
                  <div className="">
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {detail.phoneNumber}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-500">Work Location:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {detail.workLocation}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-500">Address:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {detail.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project and Claim Details Card */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="space-y-5">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-gray-200">
                    Project Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-1 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-500">Project Name:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {detail.projectName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-1 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-500">Department:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {detail.department}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-1 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-500">Project Role:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {detail.projectRole}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-1 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-500">Duration:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {detail.projectStartDate} to {detail.projectEndDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-gray-200">
                    Claim Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-1 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-500">Claim Type:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {detail.claimType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-1 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-500">Work Hours:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {detail.workHours}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-1 hover:bg-gray-50 rounded">
                      <span className="text-sm text-gray-500">Claim Date:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {detail.claimDate}
                      </span>
                    </div>

                    {detail.status === "approved" && (
                      <div className="flex justify-between items-center p-1 hover:bg-gray-50 rounded">
                        <span className="text-sm text-gray-500">
                          Total Compensation:
                        </span>
                        <span className="text-lg font-bold text-green-500">
                          {detail.totalCompensation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pb-4">
                  <h3 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-gray-200">
                    Reason
                  </h3>
                  <p className="text-sm font-semibold text-gray-900 ml-5">
                    {detail.reason}
                  </p>
                </div>

                {statusContent[detail.status]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDetail; 