import React, { useState } from 'react'
import { useAppSelector } from '@/services/store/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { otpService } from '@/services/features/otp.service'
import { authService } from '@/services/features/auth.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, User, Mail, UserCircle, Building, Lock, Key, Copy } from 'lucide-react'

function UserDetail() {
    const user = useAppSelector((state) => state.auth.user)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null)
    const [isResending, setIsResending] = useState(false)

    const extractAttemptsLeft = (response: any) => {
        if (response.data?.attemptsLeft !== undefined) {
            return response.data.attemptsLeft;
        }
        if (response.attemptsLeft !== undefined) {
            return response.attemptsLeft;
        }
        return null;
    }

    const copyToClipboard = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast.success(`${fieldName} copied to clipboard!`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
            .catch((err) => {
                toast.error(`Failed to copy: ${err}`, {
                    position: "top-right",
                    autoClose: 3000,
                });
            });
    };

    const handleSendOtp = async () => {
        if (!user?.email) {
            toast.error('User email is not available')
            return
        }

        setIsLoading(true)
        try {
            const response = await otpService.sendOtpEmail({ email: user.email })
            if (response.is_success) {
                toast.success(response.message || 'OTP sent to your email')
                setOtpSent(true)
                
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
        } catch (error: any) {
            const errorMessage = error.message || 'An error occurred'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOTP = async () => {
        if (!user?.email) {
            toast.error('Email information missing')
            return
        }

        setIsResending(true)
        try {
            const response = await otpService.sendOtpEmail({ email: user.email })
            if (response.is_success) {
                toast.success(response.message || 'OTP resent to your email')
                setOtp('')
                
                const attempts = extractAttemptsLeft(response);
                if (attempts !== null) {
                    setAttemptsLeft(attempts);
                }
            } else {
                const attempts = extractAttemptsLeft(response);
                if (attempts !== null) {
                    setAttemptsLeft(attempts);
                    toast.error(`${response.message || 'Failed to resend OTP'} Attempts remaining: ${attempts}`);
                } else {
                    toast.error(response.message || 'Failed to resend OTP');
                }
            }
        } catch (error: any) {
            const errorMessage = error.message || 'An error occurred'
            toast.error(errorMessage)
        } finally {
            setIsResending(false)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!user?.email) {
            toast.error('Email information missing')
            return
        }

        if (!oldPassword) {
            toast.error('Please enter your current password')
            return
        }

        if (!otp) {
            toast.error('Please enter the OTP code')
            return
        }

        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long')
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match')
            return
        }

        setIsLoading(true)
        try {
            const response = await authService.changePassword({
                email: user.email,
                oldPassword,
                newPassword,
                otp
            })
            
            if (response.is_success) {
                toast.success('Password changed successfully')
                setShowPasswordForm(false)
                setOtpSent(false)
                setOldPassword('')
                setNewPassword('')
                setConfirmPassword('')
                setOtp('')
                setAttemptsLeft(null)
            } else {
                const attempts = extractAttemptsLeft(response);
                const errorMessage = response.message || response.reason || 'Failed to change password';
                
                setAttemptsLeft(attempts !== undefined ? attempts : null);
                
                if (attempts !== undefined && attempts !== null) {
                    toast.error(`${errorMessage}. Attempts remaining: ${attempts}`);
                } else {
                    toast.error(errorMessage);
                }
            }
        } catch (error: any) {
            const errorMessage = error.message || 'An unexpected error occurred'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }
    
    const handleCancel = () => {
        setShowPasswordForm(false)
        setOtpSent(false)
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setOtp('')
        setAttemptsLeft(null)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 animate-fadeIn">
            <main className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100 transition-all duration-500 hover:shadow-lg animate-slideUp">
                        <div className="flex flex-col md:flex-row items-center gap-8 mb-4">
                            <div className="relative group">
                                {user?.avatarUrl ? (
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                                        <img 
                                            src={user.avatarUrl} 
                                            alt={user.fullName || "User Avatar"} 
                                            className="relative h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-white shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 rounded-full ring-4 ring-orange-500 ring-opacity-30"></div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                                        <div className="relative h-32 w-32 md:h-40 md:w-40 flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50 rounded-full border-4 border-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                                            <UserCircle className="h-20 w-20 md:h-24 md:w-24 text-orange-500" />
                                        </div>
                                        <div className="absolute inset-0 rounded-full ring-4 ring-orange-500 ring-opacity-30"></div>
                                    </div>
                                )}
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-800">{user?.fullName || 'User Profile'}</h1>
                                <p className="text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-4">
                            <p className="text-sm text-gray-500">Manage your account information and security settings</p>
                        </div>
                    </div>
                    
                    {user ? (
                        <>
                            <Card className="mb-8 overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 animate-slideIn">
                                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <CardTitle className="flex items-center gap-2 text-gray-800">
                                        <User className="h-5 w-5 text-orange-500" />
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors duration-150">
                                            <div className="flex items-center gap-2">
                                                <Key className="h-5 w-5 text-gray-500" />
                                                <span className="text-gray-600 font-medium text-base">User ID</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span 
                                                    onClick={() => copyToClipboard(user.id, "User ID")}
                                                    className="font-medium text-gray-800 bg-gray-100 px-4 py-1.5 rounded-full text-base cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                                                >
                                                    {user.id}
                                                </span>
                                                <button 
                                                    type="button"
                                                    onClick={() => copyToClipboard(user.id, "User ID")}
                                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors duration-150">
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="h-5 w-5 text-gray-500" />
                                                <span className="text-gray-600 font-medium text-base">Full Name</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span 
                                                    onClick={() => copyToClipboard(user.fullName, "Full Name")}
                                                    className="font-medium text-gray-800 px-4 py-1.5 rounded-md text-base cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                >
                                                    {user.fullName}
                                                </span>
                                                <button 
                                                    type="button"
                                                    onClick={() => copyToClipboard(user.fullName, "Full Name")}
                                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors duration-150">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-5 w-5 text-gray-500" />
                                                <span className="text-gray-600 font-medium text-base">Email</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span 
                                                    onClick={() => copyToClipboard(user.email, "Email")}
                                                    className="font-medium text-gray-800 px-4 py-1.5 rounded-md text-base cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                >
                                                    {user.email}
                                                </span>
                                                <button 
                                                    type="button"
                                                    onClick={() => copyToClipboard(user.email, "Email")}
                                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors duration-150">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-5 w-5 text-gray-500" />
                                                <span className="text-gray-600 font-medium text-base">Role</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span 
                                                    onClick={() => copyToClipboard(user.role, "Role")}
                                                    className="font-medium text-gray-800 bg-orange-100 px-4 py-1.5 rounded-full text-base cursor-pointer hover:bg-orange-200 transition-colors duration-200"
                                                >
                                                    {user.role}
                                                </span>
                                                <button 
                                                    type="button"
                                                    onClick={() => copyToClipboard(user.role, "Role")}
                                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors duration-150">
                                            <div className="flex items-center gap-2">
                                                <Building className="h-5 w-5 text-gray-500" />
                                                <span className="text-gray-600 font-medium text-base">Department</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span 
                                                    onClick={() => copyToClipboard(user.department, "Department")}
                                                    className="font-medium text-gray-800 bg-blue-50 px-4 py-1.5 rounded-full text-base cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                                >
                                                    {user.department}
                                                </span>
                                                <button 
                                                    type="button"
                                                    onClick={() => copyToClipboard(user.department, "Department")}
                                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 animate-slideIn animate-delay-200">
                                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <CardTitle className="flex items-center gap-2 text-gray-800">
                                        <Shield className="h-5 w-5 text-orange-500" />
                                        Security Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {!showPasswordForm ? (
                                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                            <div>
                                                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                                                    <Lock className="h-4 w-4 text-gray-600" />
                                                    Password Management
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">Update your password to maintain account security</p>
                                            </div>
                                            <Button 
                                                onClick={() => {
                                                    setShowPasswordForm(true)
                                                    handleSendOtp()
                                                }}
                                                className="bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
                                            >
                                                Change Password
                                            </Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleChangePassword} className="space-y-5 bg-white rounded-lg">
                                            <h3 className="font-medium mb-4 text-gray-800 border-b pb-2">Password Change Request</h3>
                                            
                                            {!otpSent ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500 mr-3"></div>
                                                    <p className="text-gray-600">Sending verification code to your email...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                                                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                                            OTP Verification Code
                                                        </label>
                                                        <div className="flex mt-1">
                                                            <Input
                                                                id="otp"
                                                                type="text"
                                                                value={otp}
                                                                onChange={(e) => setOtp(e.target.value)}
                                                                required
                                                                placeholder="Enter OTP sent to your email"
                                                                className="flex-grow min-w-[250px] w-full focus:ring-orange-500 focus:border-orange-500"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="ml-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                                                                onClick={handleResendOTP}
                                                                disabled={isResending}
                                                            >
                                                                {isResending ? 'Sending...' : 'Resend OTP'}
                                                            </Button>
                                                        </div>
                                                        {attemptsLeft !== null && (
                                                            <p className="mt-2 text-sm text-amber-600 flex items-center">
                                                                <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded text-xs mr-2">
                                                                    {attemptsLeft} attempts left
                                                                </span>
                                                                Please enter the correct verification code
                                                            </p>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                                                        <div>
                                                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                                Current Password
                                                            </label>
                                                            <Input
                                                                id="oldPassword"
                                                                type="password"
                                                                value={oldPassword}
                                                                onChange={(e) => setOldPassword(e.target.value)}
                                                                required
                                                                placeholder="Enter your current password"
                                                                className="focus:ring-orange-500 focus:border-orange-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                                New Password
                                                            </label>
                                                            <Input
                                                                id="newPassword"
                                                                type="password"
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                required
                                                                placeholder="Enter new password"
                                                                className="focus:ring-orange-500 focus:border-orange-500"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                                                                <Lock className="h-3 w-3 mr-1 text-gray-400" />
                                                                Password must be at least 6 characters
                                                            </p>
                                                        </div>
                                                        
                                                        <div>
                                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                                Confirm New Password
                                                            </label>
                                                            <Input
                                                                id="confirmPassword"
                                                                type="password"
                                                                value={confirmPassword}
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                                required
                                                                placeholder="Confirm new password"
                                                                className="focus:ring-orange-500 focus:border-orange-500"
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex gap-3 justify-end pt-4 border-t">
                                                        <Button 
                                                            type="button" 
                                                            variant="outline"
                                                            onClick={handleCancel}
                                                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button 
                                                            type="submit" 
                                                            className="bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? (
                                                                <span className="flex items-center">
                                                                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                                                                    Saving...
                                                                </span>
                                                            ) : 'Save Changes'}
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <Card className="overflow-hidden border border-gray-200 shadow-md transition-all duration-500 hover:shadow-lg animate-fadeIn">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <UserCircle className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No user information available.</p>
                                    <Button 
                                        className="mt-4 bg-orange-500 text-white hover:bg-orange-600"
                                        onClick={() => navigate('/login')}
                                    >
                                        Sign In
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    )
}

export default UserDetail