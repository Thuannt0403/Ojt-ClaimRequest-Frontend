import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ApproverLayout from '@/layouts/ApproverLayout';
import { ClaimData } from '@/interfaces/claim.interface';

function Detail(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialClaimData = location.state as ClaimData;
  const [claimData, setClaimData] = useState<ClaimData | null>(() => {
    const storedStatus = localStorage.getItem(`claimStatus_${id}`);
    if (storedStatus && initialClaimData) {
      return { ...initialClaimData, status: storedStatus as ClaimData['status'] };
    }
    return initialClaimData;
  });

  useEffect(() => {
    if (claimData) {
      localStorage.setItem(`claimStatus_${id}`, claimData.status);
    }
  }, [claimData, id]);

  const handleBack = () => {
    navigate('/Approve');
  };

  // const handleApprove = () => {
  //   const newStatus = 'Approved';
  //   localStorage.setItem(`claimStatus_${id}`, newStatus);
  //   setClaimData({ ...claimData, status: newStatus as ClaimData['status'] });
  //   navigate('/Approve');
  // };

  // const handleReject = () => {
  //   const newStatus = 'Rejected';
  //   localStorage.setItem(`claimStatus_${id}`, newStatus);
  //   setClaimData({ ...claimData, status: newStatus as ClaimData['status'] });
  //   navigate('/Approve');
  // };

  return (
    <ApproverLayout>
      <div className="flex-1 min-h-screen bg-gray-100">
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 -mt-2">
              Staff Details
            </h2>
            {/* Sử dụng flex-col trên mobile, flex-row trên md trở lên */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-white rounded-lg shadow p-6 w-full md:w-1/2">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={claimData?.staffImage || 'https://via.placeholder.com/150'}
                    alt={claimData?.staffName}
                    className="w-64 h-64 rounded-lg mb-4"
                  />
                  <h1 className="text-3xl font-bold text-gray-900 my-2">
                    {claimData?.staffName}
                  </h1>
                  <p className="text-lg text-gray-500 mb-4">{claimData?.email}</p>
                  <div className="w-full">
                    <div className="flex justify-between items-center my-2">
                      <span>Status</span>
                      <span className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm">
                        {claimData?.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center my-2">
                      <span>Approved By</span>
                      <span className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm">
                        {claimData?.approvedBy}
                      </span>
                    </div>
                  </div>
                  <div className="w-full border-b border-gray-200 pb-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                    <div className="my-4">
                      <span className="text-gray-500">Phone:</span>
                      <p className="text-gray-900 font-medium my-1">
                        {claimData?.phoneNumber}
                      </p>
                    </div>
                    <div className="my-4">
                      <span className="text-gray-500">Address:</span>
                      <p className="text-gray-900 font-medium my-1">
                        {claimData?.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 w-full md:w-1/2">
                <div className="flex flex-col gap-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold mb-2">Project Information</h3>
                    <div className="my-4">
                      <span className="text-gray-500">Project Name:</span>
                      <p className="text-gray-900 font-medium my-1">
                        {claimData?.projectName}
                      </p>
                    </div>
                    <div className="my-4">
                      <span className="text-gray-500">Duration:</span>
                      <p className="text-gray-900 font-medium my-1">
                        {claimData?.projectStartDate} to {claimData?.projectEndDate}
                      </p>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold mb-2">Claim Details</h3>
                    <div className="my-4">
                      <span className="text-gray-500">Claim Date:</span>
                      <p className="text-gray-900 font-medium my-1">
                        {claimData?.claimDate}
                      </p>
                    </div>
                    <div className="my-4">
                      <span className="text-gray-500">Total Compensation:</span>
                      <p className="text-green-400 font-medium text-xl my-1">
                        {claimData?.totalClaimAmount}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Reason</h3>
                    <p className="text-gray-900 font-medium my-1">
                      {claimData?.reason}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-around gap-3 mt-4">
                    <button
                      className="bg-gray-300 text-gray-800 py-2 px-8 rounded-md font-medium transition duration-300 hover:opacity-90"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    {claimData?.status === 'Pending' && (
                      <div className="flex gap-3">
                        <button
                          className="bg-green-500 text-white py-2 px-8 rounded-md font-medium transition duration-300 hover:opacity-90"
                          // onClick={handleApprove}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white py-2 px-8 rounded-md font-medium transition duration-300 hover:opacity-90"
                          // onClick={handleReject}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ApproverLayout>
  );
}

export default Detail;
