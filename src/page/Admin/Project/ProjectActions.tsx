import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  X,
  Check,
  Archive,
  PenLineIcon,
  Trash2,
  Eye,
} from "lucide-react";
import { ProjectStatus } from "@/interfaces/project.interface";

interface Project {
  id: string;
  status: ProjectStatus;
  projectManagerId: string;
}

interface RenderActionsProps {
  project: Project;
  userRole: string | undefined;
  userId: string | undefined;
  handleActionClick: (
    action: string,
    projectId: string,
    e: React.MouseEvent
  ) => void;
}

type ActionConfig = {
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  tooltip: string;
  action: string;
};

const ACTIONS: Record<string, ActionConfig> = {
  delete: {
    icon: Trash2,
    className: "w-5 h-5 text-red-500 cursor-pointer",
    tooltip: "Delete",
    action: "delete",
  },
  update: {
    icon: PenLineIcon,
    className: "w-5 h-5 text-blue-500 cursor-pointer",
    tooltip: "Update",
    action: "update",
  },
  view: {
    icon: Eye,
    className: "w-5 h-5 text-green-500 cursor-pointer",
    tooltip: "View",
    action: "view",
  },
  archive: {
    icon: Archive,
    className: "w-5 h-5 text-yellow-500 cursor-pointer",
    tooltip: "Archive",
    action: "archive",
  },
};

const PROJECT_STATUS_ACTIONS: Record<
  string,
  Partial<Record<ProjectStatus, Record<string, { ownerOnly?: boolean }>>>
> = {
  Admin: {
    [ProjectStatus.Draft]: {
      delete: { ownerOnly: true },
      update: { ownerOnly: true },
      view: {},
    },
    [ProjectStatus.Ongoing]: {
      update: { ownerOnly: true },
      view: {},
    },
    [ProjectStatus.Rejected]: {
      delete: { ownerOnly: true },
      update: { ownerOnly: true },
      view: {},
    },
    [ProjectStatus.Archived]: {
      view: {},
    },
  },
  Staff: {
    [ProjectStatus.Draft]: {
      delete: { ownerOnly: true },
      update: { ownerOnly: true },
      view: {},
    },
    [ProjectStatus.Ongoing]: {
      update: { ownerOnly: true },
      view: {},
    },
    [ProjectStatus.Rejected]: {
      delete: { ownerOnly: true },
      update: { ownerOnly: true },
      view: {},
    },
    [ProjectStatus.Archived]: {
      view: {},
    },
  },
};

const renderAction = (
  actionKey: string,
  projectId: string,
  handleActionClick: RenderActionsProps["handleActionClick"],
  key: string
) => {
  const { icon: Icon, className, tooltip, action } = ACTIONS[actionKey];
  return (
    <TooltipProvider key={key}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="cursor-pointer"
            onClick={(e: React.MouseEvent) =>
              handleActionClick(action, projectId, e)
            }
          >
            <Icon className={className} />
          </span>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const renderProjectActions = ({
  project,
  userRole,
  userId,
  handleActionClick,
}: RenderActionsProps) => {
  if (!userRole) return null;

  const projectStatus = project.status;
  const isManager = userId === project.projectManagerId;

  let actionKeys: string[] = [];
  const roleActions = PROJECT_STATUS_ACTIONS[userRole];

  if (roleActions && roleActions[projectStatus]) {
    const actionsForStatus = roleActions[projectStatus];
    actionKeys = Object.entries(actionsForStatus)
      .filter(([, config]) => {
        return !(config.ownerOnly && !isManager);
      })
      .map(([key]) => key);
  }

  const actions = actionKeys.map((actionKey, index) =>
    renderAction(
      actionKey,
      project.id,
      handleActionClick,
      `${project.id}-${actionKey}-${index}`
    )
  );

  return actions.length > 0 ? (
    <div className="inline-flex items-center gap-2 whitespace-nowrap">
      {actions}
    </div>
  ) : null;
};
