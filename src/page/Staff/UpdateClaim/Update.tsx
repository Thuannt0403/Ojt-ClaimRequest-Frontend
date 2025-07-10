import React, { useEffect, useState, useRef, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MailOutlined,
  RollbackOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { claimService } from "@/services/features/claim.service";
import { toast } from "react-toastify";
import { ClaimType, UpdateClaimRequest } from "@/interfaces/claim.interface";

const Update: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateClaimRequest>({
    claimType: ClaimType.HardwareRequest, // Default value is already a ClaimType
    name: "",
    remark: "",
    amount: 0,
    startDate: "",
    endDate: "",
    totalWorkingHours: 0,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateClaimRequest, string>>
  >({});

  const claimTypeLabels: Record<ClaimType, string> = {
    [ClaimType.HardwareRequest]: "Hardware Request",
    [ClaimType.SoftwareLicense]: "Software License",
    [ClaimType.OvertimeCompensation]: "Overtime Compensation",
    [ClaimType.ProjectBudgetIncrease]: "Project Budget Increase",
    [ClaimType.EquipmentRepair]: "Equipment Repair",
    [ClaimType.Miscellaneous]: "Miscellaneous",
  };

  // Fetch claim details by ID
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast.error("Claim ID is missing");
        navigate("/claims");
        return;
      }
      setIsLoading(true);
      try {
        const claimResponse = await claimService.getClaimById(id);
        if (claimResponse.data) {
          const claim = claimResponse.data;
          console.log("Claim details:", claim);
          setFormData({
            claimType:
              (claim.claimType as ClaimType) || ClaimType.HardwareRequest, // Ensure claimType is cast to ClaimType
            name: claim.staffName || "",
            remark: claim.remark || "",
            amount: claim.amount || 0,
            startDate: claim.projectStartDate || "",
            endDate: claim.projectEndDate || "",
            totalWorkingHours: claim.totalWorkingHours || 0,
          });
        }
      } catch (error: any) {
        console.error("Error fetching claim details:", error.message || error);
        if (error.response) {
          toast.error(
            `Error: ${
              error.response.data.message || "Failed to fetch claim details"
            }`
          );
        } else if (error.request) {
          toast.error("Network error: Unable to reach the server.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "totalWorkingHours"
          ? Number(value)
          : name === "claimType"
          ? (value as ClaimType) // Cast string to ClaimType since options are controlled
          : value,
    }));
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateClaimRequest, string>> = {};

    if (!formData.name) newErrors.name = "Claim name is required";
    else if (formData.name.length > 100)
      newErrors.name = "Claim name is too long";

    if (!formData.remark) newErrors.remark = "Remark is required";
    else if (formData.remark.length > 500)
      newErrors.remark = "Remark is too long";

    if (formData.amount < 0) newErrors.amount = "Amount cannot be negative";

    if (!formData.startDate || isNaN(Date.parse(formData.startDate))) {
      newErrors.startDate = "Invalid start date";
    }

    if (!formData.endDate || isNaN(Date.parse(formData.endDate))) {
      newErrors.endDate = "Invalid end date";
    } else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (formData.totalWorkingHours < 0) {
      newErrors.totalWorkingHours = "Total working hours cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await claimService.updateClaim(id!, formData);
      if (response.is_success) {
        toast.success("Claim updated successfully!");
        navigate("/claims");
      } else {
        toast.error(response.message || "Failed to update claim");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to update claim. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle return to the previous page
  const handleReturn = (): void => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingOutlined style={{ fontSize: 40 }} />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#f5f7fb] py-24">
      <form
        ref={formRef}
        className="max-w-[800px] mx-auto bg-white p-[20px] rounded-[10px] shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-[20px] text-center">
          Update Claim
        </h2>

        {/* Claim Type */}
        <div className="mb-[15px] w-full flex items-start">
          <label
            htmlFor="claimType"
            className="block mr-2.5 w-[150px] text-[18px] pt-2"
          >
            Claim Type:
          </label>
          <div className="w-[calc(100%_-_160px)] flex flex-col">
            <select
              className="w-full box-border border p-2 rounded-[5px] border-solid border-[#ccc]"
              id="claimType"
              name="claimType"
              value={formData.claimType}
              onChange={handleChange}
            >
              {Object.entries(claimTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.claimType && (
              <p className="text-red-500 text-sm mt-1">{errors.claimType}</p>
            )}
          </div>
        </div>

        {/* Claim Name */}
        <div className="mb-[15px] w-full flex items-start">
          <label
            htmlFor="name"
            className="block mr-2.5 w-[150px] text-[18px] pt-2"
          >
            Claim Name:
          </label>
          <div className="w-[calc(100%_-_160px)] flex flex-col">
            <input
              type="text"
              className="w-full box-border border p-2 rounded-[5px] border-solid border-[#ccc]"
              id="name"
              name="name"
              value={formData.name}
              placeholder="Enter claim name"
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Remark */}
        <div className="mb-[15px] w-full flex items-start">
          <label
            htmlFor="remark"
            className="block mr-2.5 w-[150px] text-[18px] pt-2"
          >
            Remark:
          </label>
          <div className="w-[calc(100%_-_160px)] flex flex-col">
            <input
              type="text"
              className="w-full box-border border p-2 rounded-[5px] border-solid border-[#ccc]"
              id="remark"
              name="remark"
              value={formData.remark}
              placeholder="Enter remark"
              onChange={handleChange}
            />
            {errors.remark && (
              <p className="text-red-500 text-sm mt-1">{errors.remark}</p>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="mb-[15px] w-full flex items-start">
          <label
            htmlFor="amount"
            className="block mr-2.5 w-[150px] text-[18px] pt-2"
          >
            Amount:
          </label>
          <div className="w-[calc(100%_-_160px)] flex flex-col">
            <input
              type="number"
              className="w-full box-border border p-2 rounded-[5px] border-solid border-[#ccc]"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min={0}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>
        </div>

        {/* Start Date */}
        <div className="mb-[15px] w-full flex items-start">
          <label
            htmlFor="startDate"
            className="block mr-2.5 w-[150px] text-[18px] pt-2"
          >
            Start Date:
          </label>
          <div className="w-[calc(100%_-_160px)] flex flex-col">
            <input
              type="date"
              className="w-full box-border border p-2 rounded-[5px] border-solid border-[#ccc]"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>
        </div>

        {/* End Date */}
        <div className="mb-[15px] w-full flex items-start">
          <label
            htmlFor="endDate"
            className="block mr-2.5 w-[150px] text-[18px] pt-2"
          >
            End Date:
          </label>
          <div className="w-[calc(100%_-_160px)] flex flex-col">
            <input
              type="date"
              className="w-full box-border border p-2 rounded-[5px] border-solid border-[#ccc]"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Total Working Hours */}
        <div className="mb-[15px] w-full flex items-start">
          <label
            htmlFor="totalWorkingHours"
            className="block mr-2.5 w-[150px] text-[18px] pt-2"
          >
            Total Working Hours:
          </label>
          <div className="w-[calc(100%_-_160px)] flex flex-col">
            <input
              type="number"
              className="w-full box-border border p-2 rounded-[5px] border-solid border-[#ccc]"
              id="totalWorkingHours"
              name="totalWorkingHours"
              value={formData.totalWorkingHours}
              onChange={handleChange}
              min={0}
            />
            {errors.totalWorkingHours && (
              <p className="text-red-500 text-sm mt-1">
                {errors.totalWorkingHours}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="container flex justify-center mt-5 gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white cursor-pointer px-5 py-2.5 rounded-[5px] border-none hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? <LoadingOutlined spin /> : <MailOutlined />} Submit
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white cursor-pointer px-5 py-2.5 rounded-[5px] border-none hover:bg-gray-700 flex items-center gap-2"
            onClick={handleReturn}
          >
            <RollbackOutlined /> Return
          </button>
        </div>
      </form>
    </div>
  );
};

export default Update;
