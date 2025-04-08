import { Holiday } from './types';

interface HolidayInfoProps {
  holiday: Holiday;
  onClose: () => void;
}

const HolidayInfo = ({ holiday, onClose }: HolidayInfoProps) => {
  return (
    <div className="mt-6 p-4 bg-white border rounded-lg shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-indigo-700">{holiday.name}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Local Name: <span className="font-medium">{holiday.localName}</span></p>
          <p className="text-sm text-gray-600">Country: <span className="font-medium">{holiday.countryCode}</span></p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Fixed Date: <span className="font-medium">{holiday.fixed ? 'Yes' : 'No'}</span></p>
          <p className="text-sm text-gray-600">Global: <span className="font-medium">{holiday.global ? 'Yes' : 'No'}</span></p>
          {holiday.launchYear && (
            <p className="text-sm text-gray-600">Launch Year: <span className="font-medium">{holiday.launchYear}</span></p>
          )}
        </div>
      </div>
      
      {holiday.types && holiday.types.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600">Types:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {holiday.types.map((type, index) => (
              <span key={index} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {holiday.counties && holiday.counties.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600">Applicable Counties:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {holiday.counties.map((county, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                {county}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayInfo;