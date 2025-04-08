import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface Country {
  countryCode: string;
  name: string;
}

interface CountrySelectorProps {
  onCountryChange: (countryCode: string) => void;
}

const CountrySelector = ({ onCountryChange }: CountrySelectorProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('IN');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries');

        let countriesList = response.data;
        const hasIndia = countriesList.some((c: Country) => c.countryCode === 'IN');
        if (!hasIndia) {
          countriesList.push({ countryCode: 'IN', name: 'India' });
        }

        countriesList.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(countriesList);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load countries. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    onCountryChange(countryCode);
  };

  if (isLoading) return <div className="text-center py-4 text-gray-500">Loading countries...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="mb-6 max-w-sm">
      <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-1">
        Select a Country
      </label>
      <div className="relative">
        <select
          id="country-select"
          value={selectedCountry}
          onChange={handleCountryChange}
          className="appearance-none w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {countries.map((country) => (
            <option key={country.countryCode} value={country.countryCode}>
              {country.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default CountrySelector;
