import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { projectService } from "@/services/features/project.service";
import { toast } from "react-toastify";
import { useAppSelector } from "@/services/store/store";
import TextArea from "antd/es/input/TextArea";
import { z } from "zod";

// Define schemas for validation
const RemarkSchema = z.string().min(10, "Remark must be at least 10 characters").trim();
const ArchiveRequestSchema = z.object({
  remark: RemarkSchema,
});

// Type definitions
type ProjectAction = "delete" | "update" | "view" | "archive";

interface ProjectActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  action: ProjectAction;
  projectId: string;
  onActionComplete?: () => void;
}

interface DialogContentConfig {
  title: string;
  description: string;
  showRemark: boolean;
}

const ProjectActionDialog: React.FC<ProjectActionDialogProps> = ({
  isOpen,
  onClose,
  action,
  projectId,
  onActionComplete,
}) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add useEffect to handle view action immediately
  React.useEffect(() => {
    if (action === "view" && isOpen) {
      navigate(`/project/detail/${projectId}`);
      onClose();
    }
  }, [action, isOpen, projectId, navigate, onClose]);

  const getDialogContent = (): DialogContentConfig => {
    const configs: Record<ProjectAction, DialogContentConfig> = {
      delete: {
        title: "Delete Project",
        description: "Are you sure you want to delete this project? This action cannot be undone.",
        showRemark: true,
      },
      update: {
        title: "Update Project",
        description: "Are you sure you want to update this project?",
        showRemark: false,
      },
      view: {
        title: "View Project",
        description: "",
        showRemark: false,
      },
      archive: {
        title: "Archive Project",
        description: "Please provide a reason for archiving this project.",
        showRemark: true,
      },
    };
    return configs[action] || {
      title: "Confirm Action",
      description: "Are you sure you want to proceed with this action?",
      showRemark: false,
    };
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      switch (action) {
        case "delete": {
          if (!user?.id) throw new Error("User information not found");
          const validation = RemarkSchema.safeParse(remark);
          if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
          }
          await projectService.deleteProject(projectId);
          toast.success("Project deleted successfully");
          onActionComplete?.();
          break;
        }
        case "archive": {
          if (!user?.id) throw new Error("User information not found");
          const validation = ArchiveRequestSchema.safeParse({ remark });
          if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
          }
          // TODO: Implement archive project service
          toast.success("Project archived successfully");
          onActionComplete?.();
          break;
        }
        case "update": {
          navigate(`/update-project/${projectId}`);
          break;
        }
      }
      // Only close on success
      setRemark("");
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof z.ZodError
          ? error.errors[0].message
          : error instanceof Error
          ? error.message
          : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(`Error in ${action} action:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { title, description, showRemark } = getDialogContent();

  // Don't render dialog for view action
  if (action === "view") {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        {showRemark && (
          <div className="px-6 py-4">
            <TextArea
              value={remark}
              onChange={(e) => {
                setRemark(e.target.value);
                setError(null);
              }}
              placeholder="Enter reason (minimum 10 characters)"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              status={error ? "error" : undefined}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        )}

        <DialogFooter className="px-6 pb-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting || (showRemark && (!remark || !!error))}
            className="rounded"
          >
            {isSubmitting ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectActionDialog;
