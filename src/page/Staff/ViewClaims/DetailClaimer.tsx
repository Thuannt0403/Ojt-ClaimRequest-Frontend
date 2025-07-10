import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Modal } from "antd";
import { CheckSquareOutlined, DeleteOutlined } from "@ant-design/icons";

interface ClaimDataType {
  key: string;
  staffImage?: string;
  staffName: string;
  email: string;
  status: string;
  phoneNumber: string;
  address: string;
  projectName: string;
  projectStartDate: string;
  projectEndDate: string;
  claimDate: string;
  totalClaimAmount: string | number;
  reason: string;
}

interface LocationState {
  state: ClaimDataType;
}

const DetailClaimer: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const location = useLocation() as LocationState;

  const initialClaimData = location.state;
  const [filteredClaimData, setFilteredClaimData] = useState<ClaimDataType[]>(
    []
  );
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [isSendModalVisible, setIsSendModalVisible] = useState<boolean>(false);
  const [isCancelModalVisible, setIsCancelModalVisible] =
    useState<boolean>(false);
  const [claimData, setClaimData] = useState<ClaimDataType>(() => {
    if (!key) return initialClaimData;
    const storedStatus = localStorage.getItem(`claimStatus_${key}`);
    if (storedStatus) {
      return { ...initialClaimData, status: storedStatus };
    }
    return initialClaimData;
  });

  const updateClaimStatus = (claimKey: string, newStatus: string): void => {
    const updatedData = filteredClaimData.map((item) => {
      if (item.key === claimKey) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    localStorage.setItem("claimerData", JSON.stringify(updatedData));
    setFilteredClaimData(updatedData);
    navigate("/claimer/request");
  };

  const handleSend = (): void => {
    setIsSendModalVisible(true);
  };

  const handleSendConfirm = (): void => {
    if (!key) return;
    updateClaimStatus(claimData.key, "Pending");
    setClaimData((prevData) => ({ ...prevData, status: "Pending" }));
    setIsSendModalVisible(false);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("claimerData");
    const updatedData = storedData ? JSON.parse(storedData) : ClaimerData;
    setFilteredClaimData(updatedData);
  }, []);

  useEffect(() => {
    if (!key) return;
    const storedStatus = localStorage.getItem(`claimStatus_${key}`);
    if (storedStatus) {
      setClaimData((prevData) => ({ ...prevData, status: storedStatus }));
    }
  }, [key]);

  useEffect(() => {
    if (claimData && key) {
      localStorage.setItem(`claimStatus_${key}`, claimData.status);
    }
  }, [claimData, key]);

  const handleEdit = (editKey: string): void => {
    navigate(`/claimer/edit/${editKey}`, { state: claimData });
  };

  const handleDeleteConfirm = (): void => {
    const updatedData = filteredClaimData.filter(
      (item) => item.key !== claimData.key
    );
    localStorage.setItem("claimerData", JSON.stringify(updatedData));
    setFilteredClaimData(updatedData);
    navigate("/claimer/request");
  };

  // const handleCancelConfirm = (): void => {
  //   if (!key) return;
  //   updateClaimStatus(claimData.key, "Canceled");
  //   setClaimData((prevData) => ({ ...prevData, status: "Canceled" }));
  //   setIsCancelModalVisible(false);
  // };

  const handleBack = (): void => {
    navigate("/claimer/request");
  };

  if (!claimData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-100">
      <LayoutClaimer>
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 -mt-2">
              Staff Details
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-white rounded-lg shadow p-6 w-full md:w-1/2">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={
                      claimData.staffImage || "https://via.placeholder.com/150"
                    }
                    alt={claimData.staffName}
                    className="w-64 h-64 rounded-lg mb-4"
                  />
                  <h1 className="text-3xl font-bold text-gray-900 my-2">
                    {claimData.staffName}
                  </h1>
                  <p className="text-lg text-gray-500 mb-4">
                    {claimData.email}
                  </p>
                  <div className="flex justify-between items-center my-2 w-full">
                    <span>Status</span>
                    <span
                      className={`px-4 py-1 rounded-full text-sm ${
                        claimData.status === "Pending"
                          ? "bg-yellow-100 text-yellow-500"
                          : claimData.status === "Draft"
                          ? "bg-pink-100 text-pink-500"
                          : claimData.status === "Approved"
                          ? "bg-green-100 text-green-500"
                          : ""
                      }`}
                    >
                      {claimData.status}
                    </span>
                  </div>
                  <div className="w-full border-b border-gray-200 pb-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Contact Information
                    </h3>
                    <div className="my-4">
                      <span className="text-gray-500">Phone:</span>
                      <p className="text-gray-900 font-medium my-1">
                        {claimData.phoneNumber}
                      </p>
                    </div>
                    <div className="my-4">
                      <span className="text-gray-500">Address:</span>
                      <p className="text-gray-900 font-medium my-1">
                        {claimData.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 w-full md:w-1/2">
                <div className="flex flex-col gap-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Project Information
                    </h3>
                    <div className="my-4">
                      <span className="text-gray-500">Project Name:</span>
                      <p className="text-gray-900 font-medium my-1">
                        {claimData.projectName}
                      </p>
                    </div>
                    <div className="my-4">
                      <span className="text-gray-500">Duration:</span>
                      <p className="text-gray-900 font-medium my-1">
                        {claimData.projectStartDate} to{" "}
                        {claimData.projectEndDate}
                      </p>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Claim Details
                    </h3>
                    <div className="my-4">
                      <span className="text-gray-500">Claim Date:</span>
                      <p className="text-gray-900 font-medium my-1">
                        {claimData.claimDate}
                      </p>
                    </div>
                    <div className="my-4">
                      <span className="text-gray-500">Total Compensation:</span>
                      <p className="text-green-400 font-medium text-xl my-1">
                        {claimData.totalClaimAmount}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Reason</h3>
                    <p className="text-gray-900 font-medium my-1">
                      {claimData.reason}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4">
                    <button
                      className="bg-gray-300 text-gray-800 py-2 px-8 rounded-md font-medium transition duration-300 hover:opacity-90"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <div className="flex gap-3">
                      {claimData.status === "Draft" ? (
                        <>
                          <button
                            className="bg-blue-500 text-white py-2 px-8 h-9 w-25 rounded-md font-medium transition duration-300 hover:opacity-90"
                            onClick={() => handleEdit(claimData.key)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white py-2 px-8 rounded-md font-medium transition duration-300 hover:opacity-90"
                            onClick={() => setIsDeleteModalVisible(true)}
                          >
                            Delete
                          </button>
                          <button
                            className="bg-green-500 text-white py-2 px-8 rounded-md font-medium transition duration-300 hover:opacity-90"
                            onClick={handleSend}
                          >
                            Send
                          </button>
                          {/* <button
                            className="bg-gray-500 text-white py-2 px-8 rounded-md font-medium transition duration-300 hover:opacity-90"
                            onClick={() => setIsCancelModalVisible(true)}
                          >
                            Cancel Claim
                          </button> */}
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutClaimer>

      <Modal
        title={
          <span className="flex items-center justify-center">
            <img
              src="https://thumb.silhouette-ac.com/t/94/94e9bb965c06456f89b4f65bd35ad270_t.jpeg"
              alt="Send"
              className="w-24 mr-2 rounded-full"
            />
          </span>
        }
        open={isSendModalVisible}
        onOk={handleSendConfirm}
        onCancel={() => setIsSendModalVisible(false)}
        footer={
          <div className="flex justify-center gap-12">
            <Button key="cancel" onClick={() => setIsSendModalVisible(false)}>
              Cancel
            </Button>
            <Button
              key="ok"
              type="primary"
              onClick={handleSendConfirm}
              className="bg-green-500"
            >
              <span className="flex items-center">
                <CheckSquareOutlined className="mr-2" />
                Send
              </span>
            </Button>
          </div>
        }
        className="text-center"
      >
        <div className="text-center">
          <p>Are you sure you want to send this claim?</p>
        </div>
      </Modal>

      <Modal
        title={
          <span className="flex items-center justify-center">
            <img
              src="https://img.lovepik.com/png/20231121/garbage-bin-icon-with-lots-of-items-to-put-in_659321_wh860.png"
              alt="Delete"
              className="w-24 mr-2 rounded-full"
            />
          </span>
        }
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={
          <div className="flex justify-center gap-12">
            <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
              Cancel
            </Button>
            <Button
              key="ok"
              type="primary"
              onClick={handleDeleteConfirm}
              className="bg-red-500"
            >
              <span className="flex items-center">
                <DeleteOutlined className="mr-2" />
                Delete
              </span>
            </Button>
          </div>
        }
        className="text-center"
      >
        <div className="text-center">
          <p>Are you sure you want to delete this claim?</p>
        </div>
      </Modal>

      {/* <Modal
        title={
          <span className="flex items-center justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
              alt="Cancel"
              className="w-24 mr-2 rounded-full"
            />
          </span>
        }
        open={isCancelModalVisible}
        onOk={handleCancelConfirm}
        onCancel={() => setIsCancelModalVisible(false)}
        footer={
          <div className="flex justify-center gap-12">
            <Button key="cancel" onClick={() => setIsCancelModalVisible(false)}>
              Back
            </Button>
            <Button
              key="ok"
              type="primary"
              onClick={handleCancelConfirm}
              className="bg-gray-500"
            >
              <span className="flex items-center">
                <CheckSquareOutlined className="mr-2" />
                Cancel Claim
              </span>
            </Button>
          </div>
        }
        className="text-center"
      >
        <div className="text-center">
          <p>Are you sure you want to cancel this claim?</p>
        </div>
      </Modal> */}
    </div>
  );
};

export default DetailClaimer;
