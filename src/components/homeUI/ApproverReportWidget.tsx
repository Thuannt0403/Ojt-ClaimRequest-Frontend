import { Card } from "@/components/ui/card";
import { FaCheck, FaClock, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ApproverReportWidget = () => {
  const navigate = useNavigate();
  
  // Mock data - thay bằng API call thực tế
  const stats = {
    pending: 8,
    approved: 24,
    rejected: 3
  };

  const handleCardClick = (status: string) => {
    navigate(`/approval/vetting?status=${status}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleCardClick("pending")}
        >
          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-lg h-full cursor-pointer">
            <div className="flex items-center justify-between h-full">
              <div>
                <div className="text-sm font-medium opacity-90">Chờ duyệt</div>
                <div className="text-3xl font-bold mt-2">{stats.pending}</div>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaClock className="text-xl" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleCardClick("approved")}
        >
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg h-full cursor-pointer">
            <div className="flex items-center justify-between h-full">
              <div>
                <div className="text-sm font-medium opacity-90">Đã duyệt</div>
                <div className="text-3xl font-bold mt-2">{stats.approved}</div>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaCheck className="text-xl" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleCardClick("rejected")}
        >
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-lg h-full cursor-pointer">
            <div className="flex items-center justify-between h-full">
              <div>
                <div className="text-sm font-medium opacity-90">Đã từ chối</div>
                <div className="text-3xl font-bold mt-2">{stats.rejected}</div>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaTimes className="text-xl" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="mb-6">
        <Card className="rounded-xl p-6 bg-white shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tỷ lệ duyệt claim</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">
                {(stats.approved / (stats.approved + stats.rejected) * 100).toFixed(1)}%
              </div>
              <p className="text-gray-600">Tỷ lệ claim được chấp nhận</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ApproverReportWidget;