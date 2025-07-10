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
  DollarSign,
  Printer,
  PenLineIcon,
  CornerDownLeft,
  CirclePlus,
} from "lucide-react";


interface Claim {
  id: string;
  status: string;
  staffName: string;
}

interface RenderActionsProps {
  claim: Claim;
  userRole: string | undefined;
  userFullName: string | undefined;
  handleActionClick: (
    action: string,
    claimId: string,
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
  cancel: {
    icon: X,
    className: "w-5 h-5 text-red-500 cursor-pointer",
    tooltip: "Cancel",
    action: "cancel",
  },
  approve: {
    icon: Check,
    className: "w-5 h-5 text-green-500 cursor-pointer",
    tooltip: "Approve",
    action: "approve",
  },
  reject: {
    icon: X,
    className: "w-5 h-5 text-red-500 cursor-pointer",
    tooltip: "Reject",
    action: "reject",
  },
  return: {
    icon: CornerDownLeft,
    className: "w-5 h-5 text-yellow-500 cursor-pointer",
    tooltip: "Return",
    action: "return",
  },
  paid: {
    icon: DollarSign,
    className: "w-5 h-5 text-green-500 cursor-pointer",
    tooltip: "Mark as Paid",
    action: "paid",
  },
  print: {
    icon: Printer,
    className: "w-5 h-5 text-blue-500 cursor-pointer",
    tooltip: "Print",
    action: "print",
  },
  update: {
    icon: PenLineIcon,
    className: "w-5 h-5 text-blue-500 cursor-pointer",
    tooltip: "Update",
    action: "update",
  },
  submit: {
    icon: CirclePlus,
    className: "w-5 h-5 text-violet-500 cursor-pointer",
    tooltip: "Submit",
    action: "submit",
  },
};

const DRAFT_ACTIONS = {
  cancel: { ownerOnly: true },
  update: { ownerOnly: true },
  submit: { ownerOnly: true },
};

const ROLE_STATUS_ACTIONS: Record<
  string,
  Partial<Record<string, Record<string, { ownerOnly?: boolean }>>>
> = {
  Staff: { Draft: DRAFT_ACTIONS },
  Approver: {
    Pending: {
      approve: {},
      reject: {},
      return: {},
    },
  },
  Finance: {
    Approved: {
      paid: {},
      print: {},
    },
  },
  Admin: {
  },
};

const renderAction = (
  actionKey: string,
  claimId: string,
  handleActionClick: RenderActionsProps["handleActionClick"],
  key: string
) => {
  const { icon: Icon, className, tooltip, action } = ACTIONS[actionKey];
  return (
    <TooltipProvider key={key}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Icon
              className={className}
              onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
                handleActionClick(action, claimId, e)
              }
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const renderActions = ({
  claim,
  userRole,
  userFullName,
  handleActionClick,
}: RenderActionsProps) => {
  if (!userRole) return null;

  const claimStatus = claim.status;
  const isCreator = userFullName === claim.staffName;

  let actionKeys: string[] = [];
  const roleActions = ROLE_STATUS_ACTIONS[userRole];

  if (roleActions && roleActions[claimStatus]) {
    const actionsForStatus = roleActions[claimStatus];
    actionKeys = Object.entries(actionsForStatus)
      .filter(([, config]: [string, { ownerOnly?: boolean }]) => {
        // If ownerOnly is true, only allow the creator to perform the action
        return !(config.ownerOnly && !isCreator);
      })
      .map(([key]) => key);
  }

  const actions = actionKeys.map((actionKey, index) =>
    renderAction(
      actionKey,
      claim.id,
      handleActionClick,
      `${claim.id}-${actionKey}-${index}`
    )
  );

  return actions.length > 0 ? (
    <div className="inline-flex items-center gap-2 whitespace-nowrap">
      {actions}
    </div>
  ) : null;
};
