import { useAppSelector } from "@/services/store/store";
import { BriefcaseBusinessIcon, Lock, FileTextIcon  } from "lucide-react"; 



const useFilteredNavMain = () => {
  const user = useAppSelector((state) => state.auth.user);

  const navMain = [
    {
      title: "Claims",
      url: "/claims",
      icon: FileTextIcon,
      isActive: true,
      roles: ["Staff", "Approver", "Finance", "Admin"],
      items: [
        { title: "Create New Claim ", url: "/create-claim", roles: ["Staff"] },
        { title: "View Personal Claims ", url: "/claims", roles: ["Staff", "Approver", "Finance", "Admin"] },
      ],
    },
    {
      title: "Management",
      icon: Lock,
      isActive: true,
      roles: ["Approver", "Finance", "Admin"],
      items: [
        { title: "Claim Control", url: "/claims?viewMode=ApproverMode", roles: ["Approver"] },
        { title: "Claim Control", url: "/claims?viewMode=FinanceMode", roles: ["Finance"] },
        {title: "Claim Control", url: "/claims?viewMode=AdminMode", roles: ["Admin"]},
      ],
    },
    {
      title: "Admin Center",
      icon: BriefcaseBusinessIcon,
      isActive: true,
      roles: ["Admin"],
      items: [
        { title: "Manage Staff ", url: "/admin/staffs", roles: ["Admin"] },
        { title: "Manage Project ", url: "/admin/projects", roles: ["Admin"] },
      ],
    },
  ];

  // Filter navMain based on user role
  const filteredNavMain = navMain
    .filter((navItem) => !navItem.roles || (user?.role && navItem.roles.includes(user.role)))
    .map((navItem) => ({
      ...navItem,
      items: navItem.items?.filter(
        (item) => !item.roles || (user?.role && item.roles.includes(user.role))
      ),
    }));

  return filteredNavMain;
};

export default useFilteredNavMain;
