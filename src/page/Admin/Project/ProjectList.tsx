import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "@/services/features/project.service";
import { ProjectStatus, GetProjectResponse } from "@/interfaces/project.interface";
import { useAppSelector } from "@/services/store/store";
import ProjectActionDialog from "@/page/Common/Action/ProjectActionDialog";
import { renderProjectActions } from "./ProjectActions";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { FileWordOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { SearchWithSelect } from "@/components/ui/search-with-select";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import HelloUserName from "@/components/kokonutui/helloUserName";

type ProjectAction = "delete" | "update" | "view" | "archive";

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [projects, setProjects] = useState<GetProjectResponse[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(20);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = React.useState("all");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState("");

  // Debounce search text
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const fetchProjects = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const effectiveStatus = filter === "all" ? "" : filter;
      const response = await projectService.getProjects(
        effectiveStatus,
        pageNumber,
        pageSize,
        "AdminMode",
        debouncedSearchText
      );
      if (response && Array.isArray(response.items)) {
        setProjects(response.items.flat());
        setTotalProjects(response.meta.total_items);
      } else {
        setError("No projects found");
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || "An error occurred while fetching projects";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [filter, pageNumber, pageSize, debouncedSearchText]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const totalPages = Math.ceil(totalProjects / pageSize);
  const pageRange = 2;
  const startPage = Math.max(1, pageNumber - pageRange);
  const endPage = Math.min(totalPages, pageNumber + pageRange);

  const handleActionClick = (
    action: string,
    projectId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setCurrentAction(action);
    setCurrentProjectId(projectId);
    setDialogOpen(true);
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Loading projects...</p>
    </div>
  );

  const NotFoundState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <FileWordOutlined className="text-4xl text-gray-400 mb-4" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );

  // Search with Select Filter Options
  const filterOptions = [
    { value: "all", label: "All" },
    { value: "draft", label: "Draft" },
    { value: "ongoing", label: "Ongoing" },
    { value: "rejected", label: "Rejected" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <div className="min-h-screen pl-10 bg-[#f5f7fb]">
      <div className="flex-1 p-4 md:p-8">
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold m-0">
              <HelloUserName />
            </h1>
            <SearchWithSelect
              searchValue={searchText}
              onSearchChange={setSearchText}
              selectValue={filter}
              onSelectChange={setFilter}
              selectPlaceholder="Filter by"
              searchPlaceholder="Search... e.g. project name"
              selectItems={filterOptions}
            />
          </div>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <NotFoundState message={error} />
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                {projects.length === 0 ? (
                  <NotFoundState message="No projects found matching your criteria" />
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr>
                            <th className="border-b p-2 text-left">Index</th>
                            <th className="border-b p-2 text-left">Project ID</th>
                            <th className="border-b p-2 text-left">Project Name</th>
                            <th className="border-b p-2 text-left">Budget</th>
                            <th className="border-b p-2 text-left">Start Date</th>
                            <th className="border-b p-2 text-left">End Date</th>
                            <th className="border-b p-2 text-center">Status</th>
                            <th className="border-b p-2 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map((project, index) => (
                            <tr
                              key={project.id}
                              className="hover:bg-gray-50 cursor-pointer"
                            >
                              <td className="border-b p-2 text-left">{index + 1}</td>
                              <td className="border-b p-2 text-left">{project.id}</td>
                              <td className="border-b p-2 text-left">{project.name}</td>
                              <td className="border-b p-2 text-left">
                                <div className="flex items-center gap-1">
                                  <span>{project.budget.toLocaleString()}</span>
                                  <span className="text-gray-500">VND</span>
                                </div>
                              </td>
                              <td className="border-b p-2 text-left">
                                {new Date(project.startDate).toLocaleDateString()}
                              </td>
                              <td className="border-b p-2 text-left">
                                {project.endDate ? new Date(project.endDate).toLocaleDateString() : "-"}
                              </td>
                              <td className="border-b p-2 text-center">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-lg ${
                                    project.status === ProjectStatus.Ongoing
                                      ? "text-[#00b894]"
                                      : project.status === ProjectStatus.Draft
                                      ? "text-pink-500"
                                      : project.status === ProjectStatus.Rejected
                                      ? "text-[#ff3636]"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {project.status}
                                </span>
                              </td>
                              <td className="border-b p-2 text-center">
                                {renderProjectActions({
                                  project: {
                                    id: project.id,
                                    status: project.status,
                                    projectManagerId: project.projectManagerId,
                                  },
                                  userRole: user?.role,
                                  userId: user?.id,
                                  handleActionClick,
                                }) || (
                                  <Button
                                    variant={"secondary"}
                                    className="ml-2 bg-blue-100 rounded-2xl text-blue-500 hover:bg-blue-200"
                                  >
                                    <Info />
                                    Show Detail
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <Pagination className="mt-4">
                      <PaginationContent>
                        <PaginationPrevious
                          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                          className={
                            pageNumber <= 1
                              ? "opacity-50 cursor-not-allowed pointer-events-none"
                              : ""
                          }
                          aria-disabled={pageNumber <= 1}
                        />
                        {Array.from(
                          { length: endPage - startPage + 1 },
                          (_, index) => (
                            <PaginationItem key={startPage + index}>
                              <PaginationLink
                                onClick={() => setPageNumber(startPage + index)}
                                isActive={pageNumber === startPage + index}
                              >
                                {startPage + index}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}
                        <PaginationNext
                          onClick={() =>
                            setPageNumber((prev) => Math.min(prev + 1, totalPages))
                          }
                          className={
                            pageNumber >= totalPages
                              ? "opacity-50 cursor-not-allowed pointer-events-none"
                              : ""
                          }
                          aria-disabled={pageNumber >= totalPages}
                        />
                      </PaginationContent>
                    </Pagination>
                  </>
                )}
              </div>
              <div className="mt-6">
                {(user?.role === "Admin" || user?.role === "Staff") && (
                  <Button
                    onClick={() => navigate("/create-project")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Create New Project
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <ProjectActionDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        action={currentAction as ProjectAction}
        projectId={currentProjectId}
        onActionComplete={fetchProjects}
      />
    </div>
  );
};

export default ProjectList; 