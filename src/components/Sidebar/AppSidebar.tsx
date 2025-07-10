import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { NavMain } from "../ui/nav-main";
import { NavUser } from "../ui/nav-user";
import  useFilteredNavMain from "./roleFilter";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, setOpen } = useSidebar();
  const navItems = useFilteredNavMain();

  const handleMouseOver = () => {
    if (state === "collapsed") {
      setOpen(true);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      variant="floating"
      onMouseOver={handleMouseOver}
    >
      <SidebarHeader className="flex justify-between items-center w-full md:w-auto p-4">
        <Link
          to="/home"
          className="flex items-center gap-2 hover:opacity-75 transition-opacity"
        >
          {state === "expanded" ? (
            <>
              <img
                src="https://res.cloudinary.com/crs2025/image/upload/v1743268698/fpt-local_b3e9qx.png"
                alt="CRS"
                className="h-10 w-10"
              />
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold text-[#1169B0]">C</span>
                <span className="text-2xl font-semibold text-[#F27227]">R</span>
                <span className="text-2xl font-semibold text-[#16B14B]">S</span>
              </div>
            </>
          ) : (
            <div className="text-2xl font-semibold flex">
              <span className="text-[#1169B0]">C</span>
              <span className="text-[#F27227]">R</span>
              <span className="text-[#16B14B]">S</span>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
