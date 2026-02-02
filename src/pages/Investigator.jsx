// src/pages/Investigator.jsx
import { useEffect, useState } from 'react';
import { fetchTotalInvestigators, fetchInvestigators } from '../services/api'; // we'll create this

const Investigator = () => {
  const [total, setTotal] = useState(null);
  const [topInvestigators, setTopInvestigators] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch total investigators
  useEffect(() => {
    const loadTotal = async () => {
      try {
        const data = await fetchTotalInvestigators();
        setTotal(data.value);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch total investigators');
      }
    };
    loadTotal();
  }, []);

  // Fetch top 10 investigators
  useEffect(() => {
    const loadTopInvestigators = async () => {
      try {
        const data = await fetchInvestigators(); // no name = top 10
        setTopInvestigators(data);
      } catch (err) {
        console.error(err);
        setError('No investigator Found');
      }
    };
    loadTopInvestigators();
  }, []);

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await fetchInvestigators(searchName.trim());
      setSearchResults(results);
    } catch (err) {
      console.error(err);
      setError('No investigator name found');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const displayList = searchResults.length > 0 ? searchResults : topInvestigators;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Investigator Details</h1>

      <div className="mb-6">
        <span className="text-lg font-medium">
          Total Investigators: 
        </span>
        <span
         className="ml-2 font-bold"
         style={{ color: '#1e82c9' }}>
          {total !== null ? total : 'Loading...'}
        </span>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex space-x-2">
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Search investigator by name"
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />
        <button
           type="submit"
           className="text-white px-5 py-2 rounded transition-all duration-300 shadow-md"
           style={{ backgroundColor: '#1e82c9' }}
           onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1669a5')}
           onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e82c9')}>
           Search
</button>
  </form>

      {error && (
        <div className="mb-4 text-red-600 font-medium">{error}</div>
      )}

      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-2 text-left">Investigator Name</th>
            <th className="px-4 py-2 text-left">Number of Inspected Sites</th>
            <th className="px-4 py-2 text-left">Countries Count</th>
            <th className="px-4 py-2 text-left">Countries of Inspections</th>
          </tr>
        </thead>
        <tbody>
          {displayList.length === 0 && (
            <tr>
              <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                {loading ? 'Loading...' : 'No data available'}
              </td>
            </tr>
          )}
          {displayList.map((inv) => (
            <tr key={inv.investigator_name || inv.name} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{inv.investigator_name || inv.name}</td>
              <td className="px-4 py-2">{inv.total_inspections || inv.inspection_count}</td>
              <td className="px-4 py-2">{inv.countries_count}</td>
              <td className="px-4 py-2">{inv.inspected_countries}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Investigator;
