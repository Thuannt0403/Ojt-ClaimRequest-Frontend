import { motion } from "framer-motion";
import { WiDaySunny, WiRain, WiCloudy, WiThunderstorm, WiDayHaze, WiFog, WiSnow } from "react-icons/wi";
import { useWeatherData } from "../../hooks/useWeatherData";
import { useState } from "react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};

const Header = ({ userName }: { userName: string }) => {
  const greeting = getGreeting();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="mb-6 flex justify-center"
      >
        <img 
          src="https://res.cloudinary.com/crs2025/image/upload/v1743237101/CRSLogo_h5s8ez.png" 
          alt="Company Logo" 
          className="h-32 object-contain"
        />
      </motion.div>
      
      <div className="inline-block">
        <h1 className="text-4xl font-bold mb-4">
          <span className="animate-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
            {greeting}
          </span>
          , <span className="animate-text bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent font-extrabold">
            {userName}
          </span>
        </h1>
      </div>
      
      <div className="my-5">
        <p className="text-lg rounded-full py-2 px-6 inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
          <span className="font-bold text-white">Chào mừng bạn quay trở lại với Claim Request System</span>
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-md"></div>
      </div>
    </motion.div>
  );
};

const TimeCard = ({ currentTime }: { currentTime: Date }) => {
  const newYorkTime = new Date(currentTime.getTime() - 12 * 60 * 60 * 1000);
  const londonTime = new Date(currentTime.getTime() - 7 * 60 * 60 * 1000);
  const tokyoTime = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);
  const sydneyTime = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);

  const calculateWorkTime = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const totalMinutes = currentHour * 60 + currentMinute;

    if (totalMinutes < 8 * 60 || totalMinutes >= 17 * 60) {
      return { hours: 8, minutes: 0, progress: 100 };
    }

    if (totalMinutes >= 12 * 60 && totalMinutes < 13 * 60) {
      const morningMinutes = 4 * 60;
      return {
        hours: 4,
        minutes: 0,
        progress: (morningMinutes / (8 * 60)) * 100
      };
    }

    let workedMinutes = totalMinutes - 8 * 60;
    if (totalMinutes >= 13 * 60) {
      workedMinutes -= 60;
    }

    const hours = Math.floor(workedMinutes / 60);
    const minutes = workedMinutes % 60;
    const progress = Math.min((workedMinutes / (8 * 60)) * 100, 100);

    return {
      hours,
      minutes,
      progress: Math.round(progress)
    };
  };

  const workTime = calculateWorkTime();
  const workProgress = workTime.progress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      className="bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white rounded-3xl overflow-hidden shadow-xl h-full"
    >
      {/* Top time section with curved design */}
      <div className="relative">
        {/* Background design element */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-400/30 to-transparent 
                       backdrop-blur-sm rounded-b-[40px] -mb-8"></div>
        
        {/* Header with time */}
        <div className="relative px-5 pt-4">
          <h2 className="text-lg font-semibold flex items-center mb-1">
            <span className="mr-1">⏰</span> Thời gian
          </h2>
          
          <div className="flex justify-center items-center py-2 flex-col">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-center"
            >
              <div className="text-6xl font-bold mb-1">
                {currentTime.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              
              <div className="text-base opacity-90 mb-3">
                {currentTime.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Time zones and work time details */}
      <div className="px-5 pb-4 pt-6">
        {/* World clocks */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 mb-3">
          <h3 className="text-xs font-medium text-center mb-2 opacity-90">Giờ quốc tế</h3>
          <div className="grid grid-cols-4 gap-2">
            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-white/10 rounded-lg p-2 flex flex-col items-center"
            >
              <div className="text-xs mb-1 opacity-80">New York</div>
              <div className="text-base font-bold">
                {newYorkTime.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-white/10 rounded-lg p-2 flex flex-col items-center"
            >
              <div className="text-xs mb-1 opacity-80">London</div>
              <div className="text-base font-bold">
                {londonTime.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-white/10 rounded-lg p-2 flex flex-col items-center"
            >
              <div className="text-xs mb-1 opacity-80">Tokyo</div>
              <div className="text-base font-bold">
                {tokyoTime.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-white/10 rounded-lg p-2 flex flex-col items-center"
            >
              <div className="text-xs mb-1 opacity-80">Sydney</div>
              <div className="text-base font-bold">
                {sydneyTime.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Work time section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs font-medium opacity-80">Giờ làm việc</div>
            <div className="text-sm font-bold">
              {workTime.hours}h{workTime.minutes.toString().padStart(2, '0')}p/8h
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${workProgress}%` }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-r from-green-400 to-cyan-300 h-2 rounded-full"
            ></motion.div>
          </div>
          
          <div className="flex justify-between mt-1.5 text-xs opacity-70">
            <div>08:00</div>
            <div>12:00</div>
            <div>13:00</div>
            <div>17:00</div>
          </div>
          
          <div className="mt-2 grid grid-cols-3 gap-2.5">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-xs mb-0.5 opacity-70">Giờ vào</div>
              <div className="font-bold text-sm">08:00</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-xs mb-0.5 opacity-70">Giờ nghỉ</div>
              <div className="font-bold text-sm">12:00-13:00</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-xs mb-0.5 opacity-70">Giờ ra</div>
              <div className="font-bold text-sm">17:00</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const getWeatherIcon = (condition: string) => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) 
    return <WiRain className="text-2xl mx-auto" />;
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) 
    return <WiCloudy className="text-2xl mx-auto" />;
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) 
    return <WiThunderstorm className="text-2xl mx-auto" />;
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) 
    return <WiFog className="text-2xl mx-auto" />;
  if (conditionLower.includes('haze') || conditionLower.includes('smoke')) 
    return <WiDayHaze className="text-2xl mx-auto" />;
  if (conditionLower.includes('snow') || conditionLower.includes('sleet') || conditionLower.includes('ice')) 
    return <WiSnow className="text-2xl mx-auto" />;
  return <WiDaySunny className="text-2xl mx-auto" />;
};

const WeatherCard = () => {
  const { 
    weatherData, 
    updateLocation, 
    useCurrentLocation, 
    isUsingCurrentLocation, 
    geoError 
  } = useWeatherData();
  
  const { 
    temperature, 
    feelsLike, 
    description, 
    humidity, 
    windSpeed, 
    airQuality, 
    forecast, 
    location, 
    isLoading, 
    error 
  } = weatherData;

  const [searchLocation, setSearchLocation] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);

  let weatherIcon = <WiDaySunny className="text-5xl" />;
  if (description.toLowerCase().includes('rain') || description.toLowerCase().includes('drizzle')) {
    weatherIcon = <WiRain className="text-5xl" />;
  } else if (description.toLowerCase().includes('cloud') || description.toLowerCase().includes('overcast')) {
    weatherIcon = <WiCloudy className="text-5xl" />;
  } else if (description.toLowerCase().includes('thunder')) {
    weatherIcon = <WiThunderstorm className="text-5xl" />;
  } else if (description.toLowerCase().includes('fog') || description.toLowerCase().includes('mist')) {
    weatherIcon = <WiFog className="text-5xl" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      updateLocation(searchLocation);
      setShowSearch(false);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl p-6 shadow-lg h-full flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Đang tải dữ liệu thời tiết...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white rounded-3xl overflow-hidden shadow-xl h-full"
    >
      {/* Top weather section with curved design */}
      <div className="relative">
        {/* Background design element */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/30 to-transparent 
                      backdrop-blur-sm rounded-b-[40px] -mb-8"></div>
        
        {/* Header with controls */}
        <div className="relative px-5 pt-4">
          <div className="flex justify-between items-center w-full mb-1">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="mr-1">☁️</span> Thời tiết
            </h2>
            <div className="flex gap-1">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSearch(!showSearch)}
                className="p-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center justify-center w-7 h-7"
                title={showSearch ? "Đóng tìm kiếm" : "Tìm kiếm địa điểm"}
              >
                {showSearch ? "✕" : "🔍"}
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={useCurrentLocation}
                className={`p-1 rounded-full transition-colors flex items-center justify-center w-7 h-7
                          ${isUsingCurrentLocation ? 'bg-white/40' : 'bg-white/20 hover:bg-white/30'}`}
                title="Sử dụng vị trí hiện tại"
              >
                📍
              </motion.button>
            </div>
          </div>
          
          {/* Search bar */}
          {showSearch && (
            <motion.form 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit} 
              className="w-full mb-2"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Nhập tên thành phố..."
                  className="flex-1 p-1.5 rounded-lg text-gray-800 text-xs focus:ring-1 focus:ring-blue-300 outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-white text-blue-500 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium"
                >
                  Tìm
                </button>
              </div>
            </motion.form>
          )}
          
          {/* Error message */}
          {geoError && !showSearch && (
            <div className="bg-yellow-500 bg-opacity-30 px-2 py-0.5 rounded-lg text-xs mb-1 w-full text-center">
              {geoError}
            </div>
          )}
          
          {/* Location display */}
          <div className="text-center my-1.5 flex items-center justify-center">
            <span className="text-base font-medium">{location}</span>
            {isUsingCurrentLocation && (
              <span className="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">Vị trí hiện tại</span>
            )}
          </div>
          
          {/* Current weather - more compact */}
          <div className="flex justify-center items-center py-2 flex-col">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="relative flex items-center mb-1"
            >
              <div className="text-6xl font-bold mr-2">{temperature}°</div>
              <motion.div 
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-5xl opacity-80 -mt-2"
              >
                {weatherIcon}
              </motion.div>
            </motion.div>
            <div className="text-lg mb-0.5 font-medium capitalize">{description}</div>
            <div className="text-sm opacity-90">Cảm giác như: {feelsLike}°C</div>
          </div>
        </div>
      </div>
      
      {/* Weather details and forecast - more compact */}
      <div className="px-5 pb-4 pt-6">
        {/* Forecast section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 mb-3">
          <div className="grid grid-cols-3 gap-2 w-full">
            {forecast.map((item) => (
              <motion.div 
                whileHover={{ y: -3 }}
                key={item.day} 
                className="text-center p-1"
              >
                <div className="text-xs font-medium mb-0.5 opacity-90">{item.day}</div>
                <div className="p-1 rounded-full bg-white/10 inline-block mb-0.5">
                  {getWeatherIcon(item.condition)}
                </div>
                <div className="font-bold text-sm">{item.temp}°</div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Weather details - using inline layout for better vertical space usage */}
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <div className="text-xs mb-0.5 opacity-70">Độ ẩm</div>
              <div className="font-bold text-lg">{humidity}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <div className="text-xs mb-0.5 opacity-70">Gió</div>
              <div className="font-bold text-lg">{windSpeed}<span className="text-xs"> km/h</span></div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <div className="text-xs mb-0.5 opacity-70">AQI</div>
              <div className="font-bold text-lg flex items-center">
                {airQuality}
                <span className="ml-1 text-xs">
                  {airQuality < 50 ? '✅' : '⚠️'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-1">
            <div 
              className={`h-1 rounded-full ${airQuality < 50 ? 'bg-green-400' : 'bg-yellow-400'}`}
              style={{ width: `${Math.min(airQuality, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface LifeWidgetProps {
  userName: string;
  currentTime: Date;
}

export default function LifeWidget({ userName, currentTime }: LifeWidgetProps) {
  return (
    <>
      <Header userName={userName} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TimeCard currentTime={currentTime} />
        <WeatherCard />
      </div>
    </>
  );
}