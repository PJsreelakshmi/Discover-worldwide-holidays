import { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import { Holiday } from './types';
import HolidayInfo from './HolidayInfo';

interface CalendarProps {
  countryCode: string;
}

const CustomCalendar = ({ countryCode }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [holidaysCache, setHolidaysCache] = useState<Record<string, Holiday[]>>({});
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const cacheKey = `${countryCode}_${year}`;
  const holidays = holidaysCache[cacheKey] || [];

  useEffect(() => {
    const fetchHolidays = async () => {
      if (!countryCode || holidaysCache[cacheKey]) return; // Already cached

      try {
        setIsLoading(true);
        setError(null);
        const API_KEY = 'PGKNQtYPToRgMHQ9uJ2W1SycFgdKsAsa';
        const response = await axios.get(
          `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${countryCode}&year=${year}`
        );

        if (response.data?.response?.holidays) {
          const formattedHolidays = response.data.response.holidays.map((holiday: any) => ({
            date: `${holiday.date.iso.split('T')[0]}`,
            localName: holiday.name,
            name: holiday.name,
            countryCode,
            fixed: true,
            global: true,
            counties: null,
            launchYear: null,
            types: [holiday.type[0]],
          }));

          setHolidaysCache(prev => ({ ...prev, [cacheKey]: formattedHolidays }));
        } else {
          setError(`No holiday data available for ${countryCode}`);
        }
      } catch (err) {
        console.error("Error fetching holidays:", err);
        setError("Failed to load holidays. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, [cacheKey, countryCode, holidaysCache]);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const holiday = holidays.find(h => h.date === formattedDate);
      if (holiday) {
        return (
          <div className="mt-1 w-full text-center">
            <span className="text-xs text-red-600 font-poppins line-clamp-2 hover:text-red-800 transition-colors duration-200">
              {holiday.localName}
            </span>
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const holiday = holidays.find(h => h.date === formattedDate);
      const classes = [
        'h-32 flex flex-col items-center justify-center p-2 rounded-lg shadow-md transition-all duration-300',
        'hover:shadow-lg hover:bg-red-50 hover:scale-105'
      ];
      if (holiday) classes.push('bg-red-100 text-red-800');
      if (isSameDay(date, new Date())) classes.push('border-2 border-indigo-500 bg-white font-bold');
      return classes.join(' ');
    }
    return null;
  };

  const handleDayClick = (value: Date) => {
    const formattedDate = format(value, 'yyyy-MM-dd');
    const holiday = holidays.find(h => h.date === formattedDate);
    setSelectedHoliday(holiday || null);
  };

  const handleActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date }) => {
    setCurrentDate(activeStartDate);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {isLoading ? (
        <div className="text-center py-8 text-gray-600 font-poppins animate-pulse">Loading holidays...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500 font-poppins animate-pulse">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Calendar
            onChange={handleDayClick}
            value={currentDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
            onActiveStartDateChange={handleActiveStartDateChange}
            className="w-full border-none font-poppins"
            navigationLabel={({ date }) => (
              <span className="text-3xl font-bold text-gray-900 font-poppins mx-auto">
                {format(date, 'MMMM yyyy')}
              </span>
            )}
            prev2Label="«"
            next2Label="»"
          />
          {selectedHoliday && (
            <HolidayInfo
              holiday={selectedHoliday}
              onClose={() => setSelectedHoliday(null)}
              className="mt-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 transform hover:scale-101"
            />
          )}
        </div>
      )}

      <style jsx global>{`
        .react-calendar__navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding: 0.75rem;
          background: linear-gradient(to right, #e0e7ff, #f3e8ff);
          border-radius: 1rem;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }

        .react-calendar__navigation__label {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          flex-grow: 0;
          color: #1e293b;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          font-family: 'Poppins', sans-serif;
        }

        .react-calendar__navigation__prev-button,
        .react-calendar__navigation__next-button,
        .react-calendar__navigation__prev2-button,
        .react-calendar__navigation__next2-button {
          width: 2.75rem;
          height: 2.75rem;
          font-size: 1.75rem;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #e0e7ff;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #4b5563;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .react-calendar__navigation__prev-button:hover,
        .react-calendar__navigation__next-button:hover,
        .react-calendar__navigation__prev2-button:hover,
        .react-calendar__navigation__next2-button:hover {
          background: #e0e7ff;
          transform: scale(1.15);
          border-color: #a3bffa;
        }

        .react-calendar__month-view__weekdays {
          text-align: center;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 1rem;
          background: #f9fafb;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-family: 'Poppins', sans-serif;
        }

        .react-calendar__month-view__days__day--neighboringMonth {
          color: #9ca3af;
          background: #f9fafb;
        }

        .react-calendar__tile--active,
        .react-calendar__tile:hover {
          background: #dbeafe;
          border-radius: 0.75rem;
          transform: scale(1.1);
        }

        .react-calendar__tile:focus {
          outline: none;
          box-shadow: 0 0 0 3px #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default CustomCalendar;
