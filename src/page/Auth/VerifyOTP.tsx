import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { authService } from '@/services/features/auth.service';
import { otpService } from '@/services/features/otp.service';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email information missing');
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
      const resetResponse = await authService.resetPassword({
        email,
        otp,
        newPassword: newPassword
      });
            
      if (resetResponse.is_success) {
        toast.success('Password reset successful');
        navigate('/login');
      } else {
        const attempts = resetResponse.data?.attemptsLeft !== undefined 
          ? resetResponse.data.attemptsLeft 
          : resetResponse.attemptsLeft;
        
        setAttemptsLeft(attempts !== undefined ? attempts : null);
        const errorMessage = resetResponse.message || resetResponse.reason || 'Failed to reset password';
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

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Email information missing');
      return;
    }

    setIsResending(true);
    try {
      const response = await otpService.sendOtpEmail({ email });
      if (response.is_success) {
        toast.success(response.message || 'OTP resent to your email');
        // Reset the OTP field
        setOtp('');
      } else {
        toast.error(response.message || 'Failed to resend OTP');
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl text-[#1169B0] font-bold text-center mb-5">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                {isResending ? 'Resending...' : 'Resend OTP'}
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
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}