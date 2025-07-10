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
import { claimService } from "@/services/features/claim.service";
import { toast } from "react-toastify";
import { useAppSelector } from "@/services/store/store";
import TextArea from "antd/es/input/TextArea";
import { z } from "zod";
import { SystemRole } from "@/interfaces/auth.interface";
import { vnpService } from "@/services/features/vnp.service";

// Define schemas for validation
const RemarkSchema = z
  .string()
  .min(10, "Remark must be at least 10 characters")
  .trim();
const CancelRequestSchema = z.object({
  remark: RemarkSchema,
});
const RejectRequestSchema = z.object({
  remark: RemarkSchema,
  approverId: z.string(),
});

// Type definitions
type ClaimAction =
  | "cancel"
  | "approve"
  | "reject"
  | "return"
  | "paid"
  | "print"
  | "submit"
  | "update";

interface ClaimActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  action: ClaimAction;
  claimId: string;
  onActionComplete?: () => void;
}

interface DialogContentConfig {
  title: string;
  description: string;
  showRemark: boolean;
}

const ClaimActionDialog: React.FC<ClaimActionDialogProps> = ({
  isOpen,
  onClose,
  action,
  claimId,
  onActionComplete,
}) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDialogContent = (): DialogContentConfig => {
    const configs: Record<ClaimAction, DialogContentConfig> = {
      cancel: {
        title: "Cancel Claim",
        description:
          "Are you sure you want to cancel this claim? This action cannot be undone.",
        showRemark: true,
      },
      approve: {
        title: "Approve Claim",
        description: "Are you sure you want to approve this claim?",
        showRemark: false,
      },
      reject: {
        title: "Reject Claim",
        description: "Please provide a reason for rejecting this claim.",
        showRemark: true,
      },
      return: {
        title: "Return Claim",
        description:
          "Are you sure you want to return this claim for amendments?",
        showRemark: true,
      },
      paid: {
        title: "Mark as Paid",
        description: "Are you sure you want to mark this claim as paid?",
        showRemark: false,
      },
      print: {
        title: "Print Claim",
        description: "Are you sure you want to print this claim?",
        showRemark: false,
      },
      submit: {
        title: "Submit Claim",
        description: "Would you like to submit this claim?",
        showRemark: false,
      },
      update: {
        title: "Update Claim",
        description: "Would you like to update this claim?",
        showRemark: false,
      },
    };
    return (
      configs[action] || {
        title: "Confirm Action",
        description: "Are you sure you want to proceed with this action?",
        showRemark: false,
      }
    );
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      switch (action) {
        case "cancel": {
          if (!user?.id) throw new Error("User information not found");
          const validation = CancelRequestSchema.safeParse({ remark });
          if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
          }
          await claimService.cancelClaim(claimId, {
            remark: validation.data.remark,
          });
          toast.success("Claim cancelled successfully");
          onActionComplete?.();
          break;
        }
        case "reject": {
          if (!user?.id) throw new Error("User information not found");
          if (user.role !== SystemRole.APPROVER) {
            throw new Error("Only approvers can reject claims");
          }
          const validation = RejectRequestSchema.safeParse({
            remark,
            approverId: user.id,
          });
          if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
          }
          await claimService.rejectClaim(claimId, validation.data);
          toast.success("Claim rejected successfully");
          onActionComplete?.();
          break;
        }
        case "approve": {
          console.log(`Approving claim ${claimId}`);
          try {
              await claimService.approveClaim(claimId);
              toast.success(`Claim approved successfully!`);
              if (onActionComplete) {
                  onActionComplete(); 
              }
          } catch (error: any) {
              toast.error(error.message);
              console.error("Approve claim failed:", error);
          }
          break;
      }      
        case "return": {
          if (!user?.id) throw new Error("User information not found");
          const validation = RemarkSchema.safeParse(remark);
          if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
          }
          await claimService.returnClaim(claimId, {
            remark,
            approverId: user.id,
          });
          toast.success("Claim returned successfully");
          onActionComplete?.();
          break;
        }
        case "paid": {
          try {
            // Call the createVnpPayment API with the claimId
            if (!user?.id) {
              throw new Error("User ID is required for initiating payment");
            }
            const response = await vnpService.createVnpPayment({ claimId, financeId: user.id });
        
            // Extract the payment URL from the response
            const paymentUrl = response.data?.paymentUrl;
        
            if (!paymentUrl) {
              throw new Error("Payment URL not found in the response");
            }
        
            // Redirect the user to the payment URL
            window.location.href = paymentUrl;
        
            toast.success("Redirecting to payment page...");
            onActionComplete?.();
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Failed to initiate payment";
            toast.error(errorMessage);
            console.error("Error in 'paid' action:", error);
          }
          break;
        }
        case "print": {
          window.print();
          break;
        }
        case "update": {
          navigate(`/update-claim/${claimId}`);
          break;
        }
        case "submit": {
          if (!user?.id) throw new Error("User information not found");
          await claimService.submitClaim(claimId);
          toast.success("Claim submitted successfully");
          onActionComplete?.();
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

export default ClaimActionDialog;
