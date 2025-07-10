import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { otpService } from '@/services/features/otp.service';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await otpService.sendOtpEmail({ email });
      if (response.is_success) {
        toast.success(response.message || 'OTP sent to your email');
        navigate('/verify-otp', { state: { email } });
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl text-[#1169B0] font-bold text-center mb-5">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#F27227] text-xl rounded-[5px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send OTP'}
          </Button>
          <p className="text-sm text-center">
            Remember your password?{' '}
            <Button
              variant="link"
              className="text-blue-400"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </p>
        </form>
      </div>
    </div>
  );
}