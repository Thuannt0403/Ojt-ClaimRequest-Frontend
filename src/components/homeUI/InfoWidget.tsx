import { FaCalendarAlt, FaSun, FaMoon } from "react-icons/fa";
import { Card } from "@/components/ui/card";

const NewsSection = () => {
  const newsItems = [
    {
      title: "Thành lập trung tâm ươm tạo bán dẫn để phát triển nguồn nhân lực",
      time: "10 giờ trước",
      category: "Kinh tế",
      url: "https://vnexpress.net/thanh-lap-trung-tam-uom-tao-ban-dan-de-phat-trien-nguon-nhan-luc-4867029.html",
      barColor: "bg-gradient-to-b from-purple-500 to-blue-500"
    },
    {
      title: "FPT cung cấp hệ thống ủy quyền, biểu quyết cho VCBF",
      time: "1 ngày trước",
      category: "Kinh tế",
      url: "https://vnexpress.net/fpt-cung-cap-he-thong-uy-quyen-bieu-quyet-cho-vcbf-4867038.html",
      barColor: "bg-gradient-to-b from-amber-500 to-orange-500"
    },
    {
      title: "FPT cất nóc tổ hợp giáo dục tại Huế",
      time: "2 ngày trước",
      category: "Kinh tế",
      url: "https://vnexpress.net/fpt-cat-noc-to-hop-giao-duc-tai-hue-4866591.html",
      barColor: "bg-gradient-to-b from-emerald-500 to-teal-500"
    }
  ];

  const handleNewsClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleViewAll = () => {
    window.open("https://vnexpress.net/chu-de/fpt-1440", '_blank');
  };

  return (
    <Card className="rounded-xl p-6 bg-white shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Tin tức</h3>
        <button 
          onClick={handleViewAll}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors flex items-center"
        >
          Xem tất cả <span className="ml-1">→</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {newsItems.map((news, index) => (
          <div 
            key={index} 
            className="relative group pl-4 hover:pl-3 transition-all duration-300"
            onClick={() => handleNewsClick(news.url)}
          >
            <div className={`absolute left-0 top-0 h-full w-1.5 rounded-full ${news.barColor}`}></div>
            
            <div className="cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors ml-2">
              <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {news.title}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                <span>{news.time}</span> - <span className="font-medium text-gray-600">{news.category}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const CalendarSection = () => {
  const events = [
    {
      day: "T2",
      date: "31",
      month: "3", 
      title: "Demo dự án",
      time: "08:00 - 09:30",
      location: "Phòng họp A",
      color: "bg-blue-100 text-blue-800"
    },
    {
      day: "T4",
      date: "02",
      month: "4", 
      title: "Demo dự án",
      time: "08:00 - 09:30",
      location: "Trực tuyến",
      color: "bg-purple-100 text-purple-800"
    },
    {
      day: "T2",
      date: "07",
      month: "4", 
      title: "Lên công ty",
      time: "08:00 - 17:00",
      location: "FPT Software D1",
      color: "bg-pink-100 text-pink-800"
    }
  ];

  return (
    <Card className="rounded-xl p-6 bg-white shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <FaCalendarAlt className="text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-800">Lịch</h3>
      </div>

      <div className="space-y-5">
        {events.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="text-center min-w-[50px]">
              <div className="text-sm font-medium text-gray-500">{event.day}</div>
              <div className="text-xl font-bold text-gray-800">
                {event.date}/{event.month}
              </div>
            </div>
            
            <div className="flex-1">
              <div className={`text-sm font-semibold mb-1 ${event.color} px-2 py-1 rounded-full inline-block`}>
                {event.title}
              </div>
              <p className="text-sm text-gray-600">
                {event.time} · {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const DayNightCycleSection = () => {
  return (
    <Card className="rounded-xl p-6 bg-white shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          <FaSun className="h-5 w-5 text-amber-500" />
          <FaMoon className="h-5 w-5 text-sky-700" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Chu kỳ ngày đêm</h3>
      </div>

      <p className="text-gray-600 mb-4">Thành phố Hồ Chí Minh</p>

      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div className="text-2xl font-bold text-gray-800">05:45</div>
          <div className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">💬</span> 18:15
          </div>
        </div>
        
        <div className="relative h-16 bg-gradient-to-r from-indigo-900 via-amber-500 to-indigo-900 rounded-full mb-4">
          <div className="absolute top-0 h-full w-full flex items-center justify-between px-3">
            <div className="text-xs text-white">05:45</div>
            <div className="h-4 w-4 rounded-full bg-white absolute" style={{ left: "calc(60% - 8px)" }}></div>
            <div className="text-xs text-white">18:15</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-3">
          <div>Bình minh</div>
          <div>Hoàng hôn</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-gray-800">05:45</div>
          <div className="text-gray-800">18:15</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm border-t pt-3">
        <div>
          <span className="text-gray-500">Thời gian ban ngày </span>
          <span className="font-medium text-gray-800">12h 30m</span>
        </div>
        <div>
          <span className="text-gray-500">Chỉ số UV </span>
          <span className="font-medium text-gray-800">7 (Cao)</span>
        </div>
      </div>
    </Card>
  );
};

export default function InfoWidget() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NewsSection />
      <CalendarSection />
      <DayNightCycleSection />
    </div>
  );
}