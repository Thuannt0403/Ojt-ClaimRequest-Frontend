import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { authService } from '@/services/features/auth.service';
import { otpService } from '@/services/features/otp.service';

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function ChangeExpiredPassword({ isOpen, onClose, email }: ChangePasswordProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otp, setOtp] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const location = useLocation();

  const extractAttemptsLeft = (response: any) => {
    if (response.data?.attemptsLeft !== undefined) {
      return response.data.attemptsLeft;
    }
    if (response.attemptsLeft !== undefined) {
      return response.attemptsLeft;
    }
    return null;
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Email information missing');
      return;
    }

    setIsResending(true);
    try {
      const response = await otpService.sendOtpEmail({ email });
      if (response.is_success) {
        toast.success(response.message || 'OTP sent to your email');
        setOtp('');
        
        const attempts = extractAttemptsLeft(response);
        if (attempts !== null) {
          setAttemptsLeft(attempts);
        }
      } else {
        const attempts = extractAttemptsLeft(response);
        if (attempts !== null) {
          setAttemptsLeft(attempts);
          toast.error(`${response.message || 'Failed to send OTP'} Attempts remaining: ${attempts}`);
        } else {
          toast.error(response.message || 'Failed to send OTP');
        }
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email information missing');
      return;
    }

    if (!oldPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (!otp) {
      toast.error('Please enter the OTP code');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await authService.changePassword({
        email,
        oldPassword,
        newPassword,
        otp
      });
      
      if (response.is_success) {
        toast.success('Password changed successfully');
        resetForm();
        onClose();
      } else {
        const attempts = extractAttemptsLeft(response);
        const errorMessage = response.message || response.reason || 'Failed to change password';
        
        setAttemptsLeft(attempts !== undefined ? attempts : null);
        
        if (attempts !== undefined && attempts !== null) {
          toast.error(`${errorMessage} Attempts remaining: ${attempts}`);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'An unexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
    setAttemptsLeft(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#1169B0] font-bold text-center">
            Change Expired Password
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            Your password has expired. Please set a new password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              disabled
            />
          </div>
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium">
              Current Password
            </label>
            <Input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              placeholder="Enter your current password"
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="otp" className="block text-sm font-medium">
                OTP Code
              </label>
              <Button
                type="button"
                variant="link"
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-sm text-blue-400 underline-offset-4 hover:underline p-0 h-auto"
              >
                {isResending ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter OTP sent to your email"
              className="w-full mt-1"
            />
            {attemptsLeft !== null && (
              <p className="mt-1 text-sm text-amber-600">
                Attempts left: {attemptsLeft}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium">
              New Password
            </label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#F27227] text-xl rounded-[5px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}