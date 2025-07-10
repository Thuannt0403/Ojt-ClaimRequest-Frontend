import { useAppSelector } from "@/services/store/store";
import { SystemRole } from "@/interfaces/auth.interface";
import { Separator } from "@/components/ui/separator";
import { Info, Mail, Phone, MapPin, Shield, Clock } from "lucide-react"; // Icons from lucide-react

export default function Footer() {
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role || SystemRole.STAFF;

  return (
    <footer className="bg-gray-200 text-gray-600 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Claim Request System */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" /> About The System
            </h3>
            <p className="text-sm leading-relaxed">
              Developed by FPT Software, the Claim Request system centralizes
              overtime payment claims for staff at F-Town 1, Ho Chi Minh City.
              It help reduces paperwork and streamlines approvals for users,
              supporting roles like Claimers, Approvers, and Finance.
            </p>
          </div>

          {/* Your Role */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Your Role
            </h3>
            <div className="text-sm space-y-3">
              {userRole === SystemRole.STAFF && (
                <p>
                  <strong>Claimer:</strong> Submit overtime claims effortlessly
                  from F-Town 1. Save drafts, track approvals, and ensure timely
                  payments with our streamlined system.
                </p>
              )}
              {userRole === SystemRole.APPROVER && (
                <p>
                  <strong>Approver:</strong> Review and approve claims from
                  project teams at F-Town 1, ensuring accuracy and compliance
                  with company policies.
                </p>
              )}
              {userRole === SystemRole.FINANCE && (
                <p>
                  <strong>Finance:</strong> Process approved claims from F-Town
                  1 staff, marking them as paid to maintain financial clarity
                  and efficiency.
                </p>
              )}
              {userRole === SystemRole.ADMIN && (
                <p>
                  <strong>Administrator:</strong> Manage staff and project data
                  from F-Town 1, overseeing the system that supports thousands
                  of FPT Software employees.
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" /> Contact Us
            </h3>
            <ul className="text-sm space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@fptsoftware.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+84 12 3456 7899</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-9 h-4" />
                <span>
                  F-Town 1, Lot T2, D1 Street, Saigon Hi-Tech Park, Tan Phu
                  Ward, Thu Duc City, HCMC, Vietnam
                </span>
              </li>
            </ul>
          </div>

          {/* System Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" /> System Resources
            </h3>
            <ul className="text-sm space-y-3">
              <li>
                <strong>F-Town 1 Campus:</strong> Explore our flagship software
                development hub, fostering innovation since 1999.
              </li>
              <li>
                <strong>Support Services:</strong> Reach out for assistance with
                system usage, claims, or technical queries.
              </li>
              <li>
                <strong>Community:</strong> Join a network of over 15,000
                professionals driving FPT Software’s global impact.
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 bg-gray-600" />

        <div className="text-center text-sm">
          <p>
            © {new Date().getFullYear()} FPT Software - Claim Request System.
            All rights reserved.
          </p>
          <p className="mt-1 text-gray-400">
            Empowering F-Town 1 staff with seamless claim management since
            February 2018.
          </p>
        </div>
      </div>
    </footer>
  );
}
