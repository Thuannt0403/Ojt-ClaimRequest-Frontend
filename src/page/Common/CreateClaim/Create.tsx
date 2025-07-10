import { useState, useRef, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";
import { SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/services/store/store";
import { CreateClaimRequest, ClaimType } from "@/interfaces/claim.interface";
import { claimService } from "@/services/features/claim.service";
import { GetProjectResponse } from "@/interfaces/project.interface";
import { projectService } from "@/services/features/project.service";
import { z } from "zod";

// Define Zod schema for validation
const claimSchema = z
  .object({
    claimType: z.nativeEnum(ClaimType),
    name: z
      .string()
      .min(1, "Claim Name is required")
      .max(100, "Claim Name cannot exceed 100 characters"),
    remark: z
      .string()
      .min(1, "Remark is required")
      .max(500, "Remark cannot exceed 500 characters"),
    amount: z.number().positive("Amount must be greater than 0"),
    totalWorkingHours: z
      .number()
      .positive("Total Working Hours must be greater than 0"),
    startDate: z.string().min(1, "Start Date is required"),
    endDate: z.string().min(1, "End Date is required"),
    projectId: z.string().min(1, "Project selection is required"),
    claimerId: z.string().min(1, "Claimer ID is required"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be greater than or equal to start date",
    path: ["endDate"],
  });

const Create: React.FC = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const user = useAppSelector((state) => state.auth.user);
  const [projects, setProjects] = useState<GetProjectResponse[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await projectService.getProjects(
          "",
          1,
          50,
          "AdminMode",
          ""
        );
        setProjects(response.items.flat());
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    }
    fetchProjects();
  }, []);

  const [formData, setFormData] = useState<CreateClaimRequest>({
    claimType: ClaimType.HardwareRequest,
    name: "",
    remark: "",
    amount: 0,
    totalWorkingHours: 0,
    startDate: "",
    endDate: "",
    projectId: "",
    claimerId: user?.id || "",
  });

  const claimTypeLabels: Record<ClaimType, string> = {
    [ClaimType.HardwareRequest]: "Hardware Request",
    [ClaimType.SoftwareLicense]: "Software License",
    [ClaimType.OvertimeCompensation]: "Overtime Compensation",
    [ClaimType.ProjectBudgetIncrease]: "Project Budget Increase",
    [ClaimType.EquipmentRepair]: "Equipment Repair",
    [ClaimType.Miscellaneous]: "Miscellaneous",
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "totalWorkingHours"
          ? Number(value)
          : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      // Validate form data with Zod
      const validatedData = claimSchema.parse(formData);

      const dataToSave = {
        ...validatedData,
        createAt: new Date().toISOString(),
      };
      const response = await claimService.createClaim(dataToSave);

      if (response) {
        toast.success("Claim saved successfully!");
        navigate("/claims");
      } else {
        toast.error("Failed to save claim");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0];
          errorMessages[field] = err.message;
        });
        setErrors(errorMessages);
        toast.error("Please fix the form errors");
      } else {
        console.error("Save claim error:", error);
        toast.error("Failed to save claim. Please try again.");
      }
    }
  };

  const handleReturn = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 min-h-screen bg-[#f5f7fb] py-24">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="max-w-[800px] mx-auto bg-white p-[20px] rounded-[10px] shadow-md"
      >
        <h2 className="text-2xl font-bold mb-[20px] text-center">
          Create New Claim
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
              {Object.values(ClaimType).map((type) => (
                <option key={type} value={type}>
                  {claimTypeLabels[type]}
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

        {/* Project Name */}
        <div className="mb-[15px] w-full flex items-start">
          <label
            htmlFor="projectId"
            className="block mr-2.5 w-[150px] text-[18px] pt-2"
          >
            Project Name:
          </label>
          <div className="w-[calc(100%_-_160px)] flex flex-col">
            <select
              id="projectId"
              name="projectId"
              className="w-full box-border border p-2 rounded-[5px] border-solid border-[#ccc]"
              value={formData.projectId}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select a project
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-red-500 text-sm mt-1">{errors.projectId}</p>
            )}
          </div>
        </div>
        {/* Buttons */}
        <div className="container flex justify-center mt-5 gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white cursor-pointer px-5 py-2.5 rounded-[5px] border-none hover:bg-blue-700 flex items-center gap-2"
          >
            <SaveOutlined /> Save
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

export default Create;
