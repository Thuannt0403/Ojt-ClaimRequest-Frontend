import { useEffect, useState } from "react";
import { useAppSelector } from "@/services/store/store";
import LifeWidget from "@/components/homeUI/LifeWidget";
import InfoWidget from "@/components/homeUI/InfoWidget";

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [temperature, setTemperature] = useState<number | null>(null);
  const user = useAppSelector((state) => state.auth.user);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock temperature data
  useEffect(() => {
    setTemperature(28 + Math.floor(Math.random() * 5) - 2);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Phần LifeWidget (Header, TimeCard, WeatherCard) */}
        <LifeWidget 
          userName={user?.fullName || ""} 
          currentTime={currentTime} 
          temperature={temperature} 
        />

        {/* Phần giữa để trống (sẽ thêm AdminReportWidget sau) */}

        
        <div className="mb-6">
          <div className="text-center py-8 text-gray-400 italic">
            Admin Report Widget will be added here
          </div>
        </div>

        {/* Phần InfoWidget (Tin tức, Lịch, Chu kỳ ngày đêm) */}
        <InfoWidget />
      </div>
    </div>
  );
};

export default AdminDashboard;