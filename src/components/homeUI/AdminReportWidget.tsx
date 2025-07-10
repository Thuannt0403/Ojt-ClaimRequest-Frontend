import { Card } from "@/components/ui/card";
import { FaUsers, FaProjectDiagram } from "react-icons/fa";

const AdminReportWidget = () => {
  // Lấy data từ API hoặc store
  const staffCount = 42;
  const projectCount = 15;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between h-full">
          <div>
            <div className="text-sm font-medium opacity-90">Tổng nhân viên</div>
            <div className="text-3xl font-bold mt-2">{staffCount}</div>
          </div>
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <FaUsers className="text-xl" />
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between h-full">
          <div>
            <div className="text-sm font-medium opacity-90">Tổng dự án</div>
            <div className="text-3xl font-bold mt-2">{projectCount}</div>
          </div>
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <FaProjectDiagram className="text-xl" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminReportWidget;