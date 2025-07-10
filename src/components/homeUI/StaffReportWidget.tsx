import { Card } from "@/components/ui/card";
import { FaFileAlt, FaClock } from "react-icons/fa";

const StaffReportWidget = () => {
  // Lấy data từ API hoặc store
  const pendingClaims = 5;
  const approvedClaims = 12;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between h-full">
          <div>
            <div className="text-sm font-medium opacity-90">Claims đang chờ</div>
            <div className="text-3xl font-bold mt-2">{pendingClaims}</div>
          </div>
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <FaClock className="text-xl" />
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between h-full">
          <div>
            <div className="text-sm font-medium opacity-90">Claims đã duyệt</div>
            <div className="text-3xl font-bold mt-2">{approvedClaims}</div>
          </div>
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <FaFileAlt className="text-xl" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StaffReportWidget;