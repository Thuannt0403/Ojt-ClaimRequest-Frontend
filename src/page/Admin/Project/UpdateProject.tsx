import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectService } from "@/services/features/project.service";
import { staffService } from "@/services/features/staff.service";
import { UpdateProjectRequest, GetProjectResponse } from "@/interfaces/project.interface";
import { GetStaffResponse } from "@/interfaces/staff.interface";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import HelloUserName from "@/components/kokonutui/helloUserName";

const UpdateProject: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState<GetProjectResponse | null>(null);
  const [staffList, setStaffList] = useState<GetStaffResponse[]>([]);
  const [formData, setFormData] = useState<UpdateProjectRequest>({
    name: "",
    description: "",
    startDate: "",
    endDate: null,
    budget: 0,
    projectManagerId: "",
    status: null,
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffService.getStaffs();
        if (response.data) {
          setStaffList(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch staff:", error);
        toast.error("Failed to load project managers");
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const response = await projectService.getProjectById(id);
        if (!response.data) {
          throw new Error("Project not found");
        }
        const projectData = response.data as GetProjectResponse;
        setFormData({
          name: projectData.name || "",
          description: projectData.description || "",
          startDate: projectData.startDate || "",
          endDate: projectData.endDate || null,
          budget: projectData.budget || 0,
          projectManagerId: projectData.projectManager.id || "",
          status: projectData.status || null,
        });
        setProject(projectData);
      } catch (error) {
        const errorMessage = (error as Error).message || "Failed to fetch project";
        toast.error(errorMessage);
        navigate("/admin/projects");
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsLoading(true);

    try {
      await projectService.updateProject(id, formData);
      toast.success("Project updated successfully");
      navigate(`/project/detail/${id}`)
    } catch (error) {
      const errorMessage = (error as Error).message || "Failed to update project";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!project) {
    return (
      <div className="min-h-screen p-6 bg-[#f5f7fb] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                <Input
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
                    <SelectValue>
                      {formData.projectManagerId && staffList.find(staff => staff.id === formData.projectManagerId) ? (
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage 
                              src={staffList.find(staff => staff.id === formData.projectManagerId)?.avatar} 
                              alt={staffList.find(staff => staff.id === formData.projectManagerId)?.responseName} 
                            />
                            <AvatarFallback>
                              {staffList.find(staff => staff.id === formData.projectManagerId)?.responseName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {staffList.find(staff => staff.id === formData.projectManagerId)?.responseName}
                          </span>
                        </div>
                      ) : (
                        "Select Project Manager"
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={staff.avatar} alt={staff.responseName} />
                            <AvatarFallback>{staff.responseName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{staff.responseName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value as any,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/project/detail/${id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject; 