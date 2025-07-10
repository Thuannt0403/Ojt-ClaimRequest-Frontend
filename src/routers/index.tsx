import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/page/Login/LoginPage";
import AuthGuard from "@/components/auth/AuthGuard";
import UserDetail from "@/page/Common/UserDetail/UserDetail";
import AdminLayout from "@/layouts/AdminLayout";
import ApproverLayout from "@/layouts/ApproverLayout";
import FinanceLayout from "@/layouts/FinanceLayout";
import StaffLayout from "@/layouts/StaffLayout";
import Home from "../page/Common/Home/Home";
import { useAppSelector } from "@/services/store/store";
import { SystemRole } from "@/interfaces/auth.interface";
import Footer from "@/components/Footer/Footer";
import { SidebarProvider} from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar/AppSidebar";
import ViewClaims from "@/page/Staff/ViewClaims/ViewClaims";
import Approve from "@/page/Approver/Approve";
import Detail from "@/page/Approver/Detail";
import ProjectList from "@/page/Admin/Project/ProjectList";
import StaffList from "@/page/Admin/StaffList/StaffList";
import Create from "@/page/Common/CreateClaim/Create";
import Update from "@/page/Staff/UpdateClaim/Update";
import FinanceDetail from "@/page/Finance/FinanceDetail";
import DetailClaimer from "@/page/Staff/ViewClaims/DetailClaimer";
import ForgotPassword from "@/page/Auth/ForgotPassword";
import VerifyOTP from "@/page/Auth/VerifyOTP";
import FinanceRequest from "@/page/Finance/FinanceRequest";
import PaymentResult from "@/page/Finance/PaymentCallBack";

import CreateProject from "@/page/Admin/Project/CreateProject";
import UpdateProject from "@/page/Admin/Project/UpdateProject";
import ProjectDetail from "@/page/Admin/Project/ProjectDetail";
import LandingPage from "@/page/LandingPage/LandingPage";



// ProtectedLayout: nhung layout dc bao ve boi UserRole
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  // AuthGuard: kiem tra xem user co duoc phep truy cap vao route hay khong
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1">
            {children}
            <Footer />
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};

const AppRouter = () => {
  const user = useAppSelector((state) => state.auth.user); // useAppSelector: lay state tu store cua Redux
  const userRole = user?.role || SystemRole.STAFF;

  // return: tra ve 1 component Routes
  // Routes: 1 component chua cac route cua app
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<LandingPage />} />
      {/* Route login: trang login */}
      <Route path="/login" element={<LoginPage />} />


      {/* Route: trang home */}
      <Route
        path="/home"
        element={
          // ProtectedLayout: nhung layout dc bao ve boi UserRole
          <ProtectedLayout>
            {/* Neu userRole la ADMIN, thi hien thi layout AdminLayout */}
            {userRole === SystemRole.ADMIN && (
              <AdminLayout>
                <Home />
              </AdminLayout>
            )}
            {/* Neu userRole la APPROVER, thi hien thi layout ApproverLayout */}
            {userRole === SystemRole.APPROVER && (
              <ApproverLayout>
                <Home />
              </ApproverLayout>
            )}
            {/* Neu userRole la FINANCE, thi hien thi layout FinanceLayout */}
            {userRole === SystemRole.FINANCE && (
              <FinanceLayout>
                <Home />
              </FinanceLayout>
            )}
            {/* Neu userRole la STAFF, thi hien thi layout StaffLayout */}
            {userRole === SystemRole.STAFF && (
              <StaffLayout>
                <Home />
              </StaffLayout>
            )}
          </ProtectedLayout>
        }
      />
      <Route
        path="/claims"
        element={
          <ProtectedLayout>
            <ViewClaims />
          </ProtectedLayout>
        }
      />
      <Route
        path="/claimer/detail/:key"
        element={
          <ProtectedLayout>
            <DetailClaimer />
          </ProtectedLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <UserDetail />
          </ProtectedLayout>
        }
      />
      <Route
        path="/create-claim"
        element={
          <ProtectedLayout>
            <Create />
          </ProtectedLayout>
        }
      />
      <Route
        path="/update-claim/:id"
        element={
          <ProtectedLayout>
            <Update />
          </ProtectedLayout>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {userRole === SystemRole.APPROVER && (
        <>
          <Route
            path="/approval/vetting"
            element={
              <ProtectedLayout>
                <ApproverLayout>
                  <Approve />
                </ApproverLayout>
              </ProtectedLayout>
            }
          />
          <Route
            path="/detail/:id"
            element={
              <ProtectedLayout>
                <ApproverLayout>
                  <Detail />
                </ApproverLayout>
              </ProtectedLayout>
            }
          />
        </>
      )}

      {userRole === SystemRole.ADMIN && (
        <>
          <Route
            path="/admin/projects"
            element={
              <ProtectedLayout>
                <AdminLayout>
                  <ProjectList />
                </AdminLayout>
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/staffs"
            element={
              <ProtectedLayout>
                <AdminLayout>
                  <StaffList />
                </AdminLayout>
              </ProtectedLayout>
            }
          />
          <Route
            path="/create-project"
            element={
              <ProtectedLayout>
                <AdminLayout>
                  <CreateProject />
                </AdminLayout>
              </ProtectedLayout>
            }
          />
          <Route
            path="/update-project/:id"
            element={
              <ProtectedLayout>
                <AdminLayout>
                  <UpdateProject />
                </AdminLayout>
              </ProtectedLayout>
            }
          />
          <Route
            path="/project/detail/:id"
            element={
              <ProtectedLayout>
                <AdminLayout>
                  <ProjectDetail />
                </AdminLayout>
              </ProtectedLayout>
            }
          />
        </>
      )}
      {userRole === SystemRole.FINANCE && (
        <>
          <Route
            path="/finance/approved"
            element={
              <ProtectedLayout>
                <FinanceLayout>
                  <FinanceRequest />
                </FinanceLayout>
              </ProtectedLayout>
            }
          />
          <Route
            path="/finance/detail/:id"
            element={
              <ProtectedLayout>
                <FinanceLayout>
                  <FinanceDetail />
                </FinanceLayout>
              </ProtectedLayout>
            }
          />
          <Route
            path="/api/v1/payment/payment-callback-result"
            element={
              <ProtectedLayout>
                <FinanceLayout>
                  <PaymentResult />
                </FinanceLayout>
              </ProtectedLayout>
            }
          />
        </>
      )}
      {/* Add other protected routes here */}
    </Routes>
  );
};

export default AppRouter;
