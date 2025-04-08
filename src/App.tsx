import { useState } from 'react';
import CountrySelector from './components/CountrySelector';
import CustomCalendar from './components/Calendar';

function App() {
  const [selectedCountry, setSelectedCountry] = useState<string>('IN');

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      
        <h1 className="text-3xl font-semibold font-serif italic text-center text-indigo-800 mb-4">
        Discover Worldwide Holidays Instantly
        </h1>

        <div className="max-w-4xl mx-auto">
          <CountrySelector onCountryChange={setSelectedCountry} />
          <CustomCalendar countryCode={selectedCountry} />
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Data provided by Calendarific API</p>
        </footer>
      </div>
  );
}

export default App;