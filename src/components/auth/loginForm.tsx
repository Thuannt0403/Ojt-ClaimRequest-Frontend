import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/services/store/store";
import React, { useState } from "react";
import { IAuthUser } from "@/interfaces/auth.interface";
import { authService } from "@/services/features/auth.service";
import { Lock, User2 } from "lucide-react";
import { otpService } from "@/services/features/otp.service";
import { setUser } from "@/services/features/authSlice";
import { toast } from "react-toastify";
import ChangeExpiredPassword from "./ChangeExpiredPassword";
import { motion } from "framer-motion";
import { LoadingOutlined } from "@ant-design/icons"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when submission starts

    try {
      const response = await authService.login({ email, password });
      if (response.is_success && response.data) {
        const {
          accessToken,
          id,
          email,
          fullName,
          role,
          department,
          avatarUrl,
        } = response.data;
        authService.setToken(accessToken);

        const tokenData = JSON.parse(atob(accessToken.split(".")[1]));
        const expiration = new Date(tokenData.exp * 1000).toISOString();
        localStorage.setItem("tokenExpiration", expiration);

        const userData: IAuthUser = {
          id,
          email,
          fullName,
          role,
          department,
          avatarUrl,
        };

        dispatch(setUser(userData));
        navigate("/home");
        toast.success(response.message || "Login successful!");
      } else {
        if (response.message?.includes("password has expired")) {
          toast.warning(
            "Your password has expired. Please set a new password."
          );
          setIsChangePasswordOpen(true);
          try {
            const otpResponse = await otpService.sendOtpEmail({ email });
            if (otpResponse.is_success) {
              toast.info("An OTP has been sent to your email");
            } else {
              toast.error("Failed to send OTP: " + otpResponse.message);
            }
          } catch (otpError) {
            toast.error("Failed to send OTP email");
            console.error(otpError);
          }
        } else {
          toast.error(response.message || "Login failed");
        }
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || "An error occurred";

      if (
        errorMessage.toLowerCase().includes("password has expired") ||
        errorMessage.toLowerCase().includes("password expired")
      ) {
        toast.warning("Your password has expired. Please set a new password.");
        setIsChangePasswordOpen(true);
        try {
          const otpResponse = await otpService.sendOtpEmail({ email });
          if (otpResponse.is_success) {
            toast.info("An OTP has been sent to your email");
          } else {
            toast.error("Failed to send OTP: " + otpResponse.message);
          }
        } catch (otpError) {
          toast.error("Failed to send OTP email");
          console.error(otpError);
        }
      } else {
        toast.error(errorMessage);
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn("flex flex-col gap-8 w-full", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <img
            src="https://res.cloudinary.com/crs2025/image/upload/v1743237101/CRSLogo_h5s8ez.png"
            alt="CRS Logo"
            className="w-full h-auto mb-6"
          />
          <h1 className="text-3xl font-bold">Claim Request System</h1>
          <p className="text-base text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-8">
          <div className="grid gap-3">
            <Label htmlFor="email" className="text-base">
              Email
            </Label>
            <Input
              startIcon={User2}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@fpt.edu.com"
              required
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot your password?
              </a>
            </div>
            <Input
              startIcon={Lock}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <motion.button
            type="submit"
            className={`w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 rounded-full shadow-lg flex items-center justify-center ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            whileHover={{ scale: isLoading ? 1 : 1.05 }} // Disable hover effect when loading
            whileTap={{ scale: isLoading ? 1 : 0.95 }} // Disable tap effect when loading
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <>
                <LoadingOutlined className="mr-2" /> {/* Spinner */}
                Loading...
              </>
            ) : (
              "Login"
            )}
          </motion.button>
          {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Login with GitHub
        </Button> */}
        </div>
      </form>
      {/* Add the ChangeExpiredPassword component */}
      <ChangeExpiredPassword
        isOpen={isChangePasswordOpen}
        onClose={handleCloseChangePassword}
        email={email}
      />
    </>
  );
}
