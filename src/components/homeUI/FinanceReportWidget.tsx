import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import { claimService } from "@/services/features/claim.service";


const FinanceReportWidget = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    approved: 0,
    paid: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch claims data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [approvedRes, paidRes] = await Promise.all([
          claimService.getClaims("Approved", 1, 100, "FinanceMode", ""),
          claimService.getClaims("Paid", 1, 100, "FinanceMode", ""),
        ]);

        setStats({
          approved: approvedRes?.items?.length || 0,
          paid: paidRes?.items?.length || 0,
        });

      } catch (error) {
        toast.error("Không thể tải dữ liệu claims");
        console.error("Fetch claims error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (status: string) => {
    navigate(`/finance?status=${status}`);
  };

  const total = stats.approved + stats.paid;
  const data = [
    { name: "Đã duyệt", value: stats.approved, percent: (stats.approved / total * 100).toFixed(1) },
    { name: "Đã thanh toán", value: stats.paid, percent: (stats.paid / total * 100).toFixed(1) }
  ];

  return (
    <>
      {/* Phần thống kê bằng card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleCardClick("Approved")}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg h-full cursor-pointer">
            <div className="flex items-center justify-between h-full">
              <div>
                <div className="text-sm font-medium opacity-90">Claims đã duyệt</div>
                <div className="text-3xl font-bold mt-2">
                  {loading ? "--" : stats.approved}
                </div>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaCheckCircle className="text-xl" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleCardClick("Paid")}
        >
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg h-full cursor-pointer">
            <div className="flex items-center justify-between h-full">
              <div>
                <div className="text-sm font-medium opacity-90">Claims đã thanh toán</div>
                <div className="text-3xl font-bold mt-2">
                  {loading ? "--" : stats.paid}
                </div>
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaMoneyBillWave className="text-xl" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Phần biểu đồ */}
      <div className="mb-6">
  <Card className="rounded-xl p-6 bg-white shadow-sm border border-gray-100">
  <div className="flex justify-between items-center mb-4">
  <h3 className="text-lg font-semibold text-gray-800">Tỷ lệ Approved vs Paid</h3>
  <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
    <span className="text-base font-semibold text-gray-700 mr-2">Tổng:</span> {/* Tăng lên text-base */}
    <span className="text-xl font-bold text-indigo-600"> {/* Tăng lên text-xl */}
      {total} claims
    </span>
  </div>
</div>

    {/* Giữ nguyên kích thước card, điều chỉnh bên trong */}
    <div className="flex flex-col md:flex-row gap-6 h-[400px]"> {/* Fixed height */}
      
      {/* Phần biểu đồ - chiếm 70% width */}
      <div className="w-full md:w-[70%] h-full"> {/* Giảm từ 1/2 xuống 70% */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}  
              outerRadius={100} 
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name}\n${percent}%`}
              labelLine={false}
            >
              <Cell fill="#4f46e5" />
              <Cell fill="#10b981" />
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `${value} claims (${props.payload.percent}%)`,
                name
              ]}
            />
            <Legend 
              layout="horizontal"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Phần thông tin - chiếm 30% width */}
      <div className="w-full md:w-[30%] h-full flex flex-col justify-center"> {/* Giảm từ 1/2 xuống 30% */}
        <div className="space-y-6"> {/* Tăng khoảng cách giữa các item */}
          <div className="p-3 bg-indigo-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></div> {/* Giảm kích thước dot */}
                <span className="text-sm">Đã duyệt</span> {/* Giữ nguyên cỡ chữ */}
              </div>
              <div>
                <p className="font-semibold">{stats.approved}</p>
                <p className="text-xs text-gray-500">{data[0].percent}%</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-sm">Đã thanh toán</span>
              </div>
              <div>
                <p className="font-semibold">{stats.paid}</p>
                <p className="text-xs text-gray-500">{data[1].percent}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</div>
    </>
  );
};

export default FinanceReportWidget;