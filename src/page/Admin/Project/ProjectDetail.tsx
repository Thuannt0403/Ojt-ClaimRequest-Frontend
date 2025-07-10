import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectService } from "@/services/features/project.service";
import { staffService } from "@/services/features/staff.service";
import { GetProjectResponse, ProjectRole } from "@/interfaces/project.interface";
import { GetStaffResponse } from "@/interfaces/staff.interface";
import { Button } from "@/components/ui/button";
import HelloUserName from "@/components/kokonutui/helloUserName";
import { useAppSelector } from "@/services/store/store";
import { toast } from "react-toastify";
import { UserPlus, UserMinus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProjectDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<GetProjectResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedRole, setSelectedRole] = useState<ProjectRole>(ProjectRole.Developer);
  const [availableStaff, setAvailableStaff] = useState<GetStaffResponse[]>([]);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [staffToRemove, setStaffToRemove] = useState<{ id: string; name: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const user = useAppSelector((state) => state.auth.user);
  
  const isProjectManager = Boolean(
    user && (
      user.id === project?.projectManager.id
    )
  );

  const isAdmin = user?.role === "Admin";
  const canEdit = isAdmin || isProjectManager;
  
  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const response = await projectService.getProjectById(id);
        if (!response.data) {
          throw new Error("Project not found");
        }
        setProject(response.data);
      } catch (error) {
        console.error("Failed to fetch project:", error);
        toast.error("Failed to fetch project details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Fetch available staff
  useEffect(() => {
    const fetchAvailableStaff = async () => {
      try {
        const response = await staffService.getStaffs();
        if (response.data) {
          const existingStaffIds = project?.projectStaffs.map(staff => staff.staffId) || [];
          const availableStaff = response.data.filter(staff => 
            !existingStaffIds.includes(staff.id)
          );
          setAvailableStaff(availableStaff);
        }
      } catch (error) {
        console.error("Failed to fetch available staff:", error);
        toast.error("Failed to fetch available staff");
      }
    };

    if (canEdit && isAssignDialogOpen) {
      fetchAvailableStaff();
    }
  }, [canEdit, isAssignDialogOpen, project]);

  const handleAssignStaff = async () => {
    if (!id || !selectedStaffId || !user?.id) return;

    try {
      await staffService.assignStaff(selectedStaffId, {
        ProjectId: id,
        AssignerId: user.id,
        ProjectRole: selectedRole
      });
      
      // Refresh project data
      const response = await projectService.getProjectById(id);
      if (response.data) {
        setProject(response.data);
      }
      
      toast.success("Staff assigned successfully");
      setIsAssignDialogOpen(false);
      setSelectedStaffId("");
      setSelectedRole(ProjectRole.Developer);
    } catch (error) {
      toast.error("Failed to assign staff");
    }
  };

  const handleRemoveClick = (staffId: string, staffName: string) => {
    if (!canEdit) {
      toast.error("You don't have permission to remove staff");
      return;
    }
    setStaffToRemove({ id: staffId, name: staffName });
    setIsRemoveDialogOpen(true);
  };

  const confirmRemoveStaff = async () => {
    if (!staffToRemove || !id || !user?.id || !canEdit) {
      toast.error("You don't have permission to remove staff");
      return;
    }

    try {
      await staffService.removeStaff(staffToRemove.id, {
        projectId: id,
        removerId: user.id
      });
      
      // Refresh project data
      const response = await projectService.getProjectById(id);
      if (response.data) {
        setProject(response.data);
      }
      
      toast.success("Staff removed successfully");
      setIsRemoveDialogOpen(false);
      setStaffToRemove(null);
    } catch (error) {
      toast.error("Failed to remove staff");
    }
  };

  const handleActionClick = async (action: string, projectId: string) => {
    if (action === "delete") {
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDeleteProject = async () => {
    if (!id || !user?.id) return;
    try {
      await projectService.deleteProject(id);
      toast.success("Project deleted successfully");
      navigate("/admin/projects");
    } catch (error) {
      toast.error("Failed to delete project");
    }
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-[#f5f7fb] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen p-6 bg-[#f5f7fb] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Project not found</h2>
          <Button
            onClick={() => navigate("/admin/projects")}
            className="mt-4"
          >
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[#f5f7fb]">
      <div className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              <HelloUserName />
            </h1>
            <Button
              onClick={() => navigate("/admin/projects")}
              variant="outline"
            >
              Back to Projects
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Project Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project ID</label>
                    <p className="mt-1 text-gray-900">{project.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-gray-900">{project.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-gray-900">{project.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1 text-gray-900">{project.status}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <label className="block text-sm font-medium text-blue-800 mb-2">Project Manager</label>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={project.projectManager.avatar || undefined} alt={project.projectManager.responseName} />
                        <AvatarFallback>{project.projectManager.responseName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-blue-900 font-medium">{project.projectManager.responseName}</p>
                        <p className="text-sm text-blue-700">Project Manager</p>
                      </div>
                    </div>
                  </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(project.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <p className="mt-1 text-gray-900">
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget</label>
                    <p className="mt-1 text-gray-900">
                      {project.budget.toLocaleString()} VND
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Project Staff</h2>
                  {canEdit && (
                    <Button
                      onClick={() => setIsAssignDialogOpen(true)}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign Staff
                    </Button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Role</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Department</th>
                        {canEdit && (
                          <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {project?.projectStaffs
                        .filter(staff => staff.role !== "ProjectManager")
                        .map((staff, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2 text-sm text-gray-900">{staff.staffName}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              staff.role === "ProjectManager" 
                                ? "bg-blue-100 text-blue-800"
                                : staff.role === "Developer"
                                ? "bg-green-100 text-green-800"
                                : staff.role === "Tester"
                                ? "bg-purple-100 text-purple-800"
                                : staff.role === "BusinessAnalyst"
                                ? "bg-blue-100 text-blue-800"
                                : staff.role === "QualityAssurance"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {staff.role}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{staff.department}</td>
                          {canEdit && (
                            <td className="px-4 py-2 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveClick(staff.staffId, staff.staffName)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <UserMinus className="w-4 h-4" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              {canEdit && (
                <>
                  <Button
                    onClick={() => navigate(`/update-project/${project.id}`)}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Edit Project
                  </Button>
                  {(project.status === "Draft" || project.status === "Rejected" || isAdmin) && (
                    <Button
                      onClick={() => handleActionClick("delete", project.id)}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Deactivate Project
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Staff to Project</DialogTitle>
                <DialogDescription>
                  Select a staff member and their role in the project.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Staff</label>
                  <Select
                    value={selectedStaffId}
                    onValueChange={setSelectedStaffId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStaff?.map((staff: GetStaffResponse) => (
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Role</label>
                  <Select
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value as ProjectRole)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProjectRole.Developer}>Developer</SelectItem>
                      <SelectItem value={ProjectRole.Tester}>Tester</SelectItem>
                      <SelectItem value={ProjectRole.BusinessAnalyst}>Business Analyst</SelectItem>
                      <SelectItem value={ProjectRole.QualityAssurance}>Quality Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAssignDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignStaff}
                  disabled={!selectedStaffId || !selectedRole}
                >
                  Assign
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Staff Removal</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove {staffToRemove?.name} from this project?
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRemoveDialogOpen(false);
                    setStaffToRemove(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmRemoveStaff}
                >
                  Remove
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Project Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this project? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteProject}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 