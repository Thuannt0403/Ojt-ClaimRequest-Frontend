import { useAppSelector } from "@/services/store/store";
import { SystemRole } from "@/interfaces/auth.interface";
import AdminDashboard from "@/components/eldoraui/AdminDashboard";
import StaffDashboard from "@/components/eldoraui/StaffDashboard";
import ApproverDashboard from "@/components/eldoraui/ApproverDashboard";
import FinanceDashboard from "@/components/eldoraui/FinanceDashboard";

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role || SystemRole.STAFF;

  switch(userRole) {
    case SystemRole.ADMIN:
      return <AdminDashboard />;
    case SystemRole.STAFF:
      return <StaffDashboard />;
    case SystemRole.APPROVER:
      return <ApproverDashboard />;
    case SystemRole.FINANCE:
      return <FinanceDashboard />;
    default:
      return <StaffDashboard />;
  }
};

export default Home;