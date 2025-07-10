import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/services/store/store";
import { authService } from "@/services/features/auth.service";
import { clearUser } from "@/services/features/authSlice";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

export default function NavHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Execute dispatch and navigate immediately
    dispatch(clearUser());
    navigate("/login");
    try {
      // Await the logout process separately
      await authService.logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-4 py-3 bg-background shadow-sm border-b">
      {/* Logo Section */}
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-75 transition-opacity"
        >
          <img
            src="/src/assets/icon-fpt.png"
            alt="Claim Request System"
            className="h-10 w-10"
          />
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-[#1169B0]">C</span>
            <span className="text-2xl font-semibold text-[#F27227]">R</span>
            <span className="text-2xl font-semibold text-[#16B14B]">S</span>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" aria-label="Close menu" />
          ) : (
            <Menu className="h-6 w-6" aria-label="Open menu" />
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <div
        className={cn(
          "w-full md:w-auto mt-4 md:mt-0 gap-2",
          isMenuOpen ? "flex flex-col" : "hidden md:flex md:flex-row"
        )}
      >
        <Button
          asChild
          variant="ghost"
          className="w-full md:w-auto justify-start text-base hover:bg-accent"
        >
          <Link to="/create-claim">Create Claim</Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          className="w-full md:w-auto justify-start text-base hover:bg-accent"
        >
          <Link to="/claims">View Claims</Link>
        </Button>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <img
                src="/src/assets/default-avatar.jpeg"
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" /> My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600"
            >
              <LogOut className="h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
