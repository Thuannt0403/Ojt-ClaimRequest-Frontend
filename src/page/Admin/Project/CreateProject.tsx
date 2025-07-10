import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "@/services/features/project.service";
import { staffService } from "@/services/features/staff.service";
import { CreateProjectRequest, ProjectStatus } from "@/interfaces/project.interface";
import { GetStaffResponse } from "@/interfaces/staff.interface";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TextArea from "antd/es/input/TextArea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HelloUserName from "@/components/kokonutui/helloUserName";

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [staffList, setStaffList] = useState<GetStaffResponse[]>([]);
  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: "",
    description: "",
    startDate: "",
    endDate: null,
    budget: 0,
    projectManagerId: "",
    status: ProjectStatus.Draft,
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffService.getStaffs();
        if (response.data) {
          const adminStaff = response.data.filter(staff => staff.systemRole === 'Admin');
          setStaffList(adminStaff);
        }
      } catch (error) {
        console.error("Failed to fetch staff:", error);
        toast.error("Failed to load project managers");
      }
    };

    fetchStaff();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await projectService.createProject(formData);
      toast.success("Project created successfully");
      navigate("/admin/projects");
    } catch (error) {
      const errorMessage = (error as Error).message || "Failed to create project";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen p-6 bg-[#f5f7fb]">
      <div className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-semibold mb-6">
            <HelloUserName />
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value || null,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="budget">Budget (VND)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="projectManagerId">Project Manager</Label>
                <Select
                  value={formData.projectManagerId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      projectManagerId: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Project Manager">
                      {formData.projectManagerId && staffList.find(staff => staff.id === formData.projectManagerId) && (
                        <div className="flex items-center gap-2">
                          <img
                            src={staffList.find(staff => staff.id === formData.projectManagerId)?.avatar || 
                                 "https://ui-avatars.com/api/?name=" + encodeURIComponent(staffList.find(staff => staff.id === formData.projectManagerId)?.responseName || "")}
                            alt={staffList.find(staff => staff.id === formData.projectManagerId)?.responseName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{staffList.find(staff => staff.id === formData.projectManagerId)?.responseName}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        <div className="flex items-center gap-2">
                          <img
                            src={staff.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(staff.responseName)}
                            alt={staff.responseName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{staff.responseName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/projects")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject; 