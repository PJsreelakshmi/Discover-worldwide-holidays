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
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      if (!countryCode) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const year = currentDate.getFullYear();
        
        const API_KEY = 'PGKNQtYPToRgMHQ9uJ2W1SycFgdKsAsa';
        const response = await axios.get(
          `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${countryCode}&year=${year}`
        );
        
        if (response.data && response.data.response && Array.isArray(response.data.response.holidays)) {
          const formattedHolidays = response.data.response.holidays.map((holiday: any) => ({
            date: `${holiday.date.iso.split('T')[0]}`,
            localName: holiday.name,
            name: holiday.name,
            countryCode: countryCode,
            fixed: true,
            global: true,
            counties: null,
            launchYear: null,
            types: [holiday.type[0]]
          }));
          
          setHolidays(formattedHolidays);
        } else {
          setHolidays([]);
          setError(`No holiday data available for ${countryCode}`);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching holidays:", err);
        setHolidays([]);
        setError(`Failed to load holidays. Please try again later.`);
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, [countryCode, currentDate]);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const holiday = holidays.find(h => h.date === formattedDate);
      if (holiday) {
        return (
          <div className="mt-1 w-full text-center">
            <span className="text-xs text-indigo-600 line-clamp-2">{holiday.localName}</span>
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
      const classes = ['h-24 flex flex-col items-center justify-start p-2'];
      if (holiday) classes.push('bg-red-100 text-red-800');
      if (isSameDay(date, new Date())) classes.push('border-2 border-indigo-500 bg-white');
      return classes;
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
    <div className="max-w-4xl mx-auto p-6">
      {isLoading ? (
        <div className="text-center py-8 text-gray-600">Loading holidays...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Calendar
            onChange={handleDayClick}
            value={currentDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
            onActiveStartDateChange={handleActiveStartDateChange}
            className="w-full border-none"
            navigationLabel={({ date }) => (
              <h2 className="text-xl font-semibold text-gray-800">{format(date, 'MMMM yyyy')}</h2>
            )}
          />
          {selectedHoliday && <HolidayInfo holiday={selectedHoliday} onClose={() => setSelectedHoliday(null)} />}
        </div>
      )}
      <style jsx global>{`
        .react-calendar__navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .react-calendar__navigation__label {
          order: 1;
          flex-grow: 1;
          text-align: center;
        }

        .react-calendar__navigation__prev2-button,
        .react-calendar__navigation__next2-button {
          display: none;
        }

        .react-calendar__navigation__prev-button,
        .react-calendar__navigation__next-button {
          width: 2.5rem;
          height: 2.5rem;
          font-size: 1.5rem;
          border-radius: 50%;
          background: #f8fafc;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          color: #4a5568;
        }

        .react-calendar__navigation__prev-button:hover,
        .react-calendar__navigation__next-button:hover {
          background: #e2e8f0;
        }

        .react-calendar__month-view__weekdays {
          text-align: center;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .react-calendar__month-view__days__day--neighboringMonth {
          color: #9ca3af;
          background: #f9fafb;
        }

        .react-calendar__tile--active,
        .react-calendar__tile:hover {
          background: #edf2f7;
        }
      `}</style>
    </div>
  );
};

export default CustomCalendar;