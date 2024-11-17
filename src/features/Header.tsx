import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Header: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current month and year
  const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
  const currentYear = new Date().getFullYear();

  // Extract month and year from URL or use defaults
  const selectedMonth = parseInt(searchParams.get('month') || `${currentMonth}`, 10);
  const selectedYear = parseInt(searchParams.get('year') || `${currentYear}`, 10);

  // Handle dropdown change
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = event.target.value;
    setSearchParams({ month: newMonth, year: `${selectedYear}` });
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = event.target.value;
    setSearchParams({ month: `${selectedMonth}`, year: newYear });
  };

  return (
    <header className="header">
      <h1>Transaction Viewer</h1>
      <div className="header-filters">
        <label>
          Month:
          <select value={selectedMonth} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </label>
        <label>
          Year:
          <select value={selectedYear} onChange={handleYearChange}>
            {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
};

export default Header;