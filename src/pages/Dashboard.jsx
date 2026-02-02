import { useEffect, useState } from 'react';
import { 
  fetchTotalObservations, 
  fetchTotalCitesInspected, 
  fetchProgramAreaCounts,
  fetchInspectionClassifications,
  fetchCountrywiseCounts,
  fetchTrend483AvailableFilters,
  fetchTrend483Data,
  fetchTrend483Observations
} from '../services/api';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, AreaChart
} from 'recharts';
import { Building2, FileText, Users, TrendingUp, Activity, Globe, AlertTriangle, MapPin } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

// Dark/Thick color palette for professional dashboards
const COLORS = [
  '#1E40AF', // Deep Blue
  '#059669', // Emerald Green
  '#7C3AED', // Deep Purple
  '#DC2626', // Deep Red
  '#D97706', // Amber
  '#0891B2', // Cyan
  '#BE185D', // Pink
  '#B45309', // Orange
  '#1E3A8A', // Navy Blue
  '#047857', // Dark Green
  '#6B21A8', // Dark Purple
  '#991B1B', // Dark Red
  '#92400E', // Dark Amber
  '#0E7490', // Dark Cyan
  '#9F1239'  // Dark Pink
];

// Country coordinates for world map
const countryCoordinates = {
  'United States': [-95.7129, 37.0902],
  'India': [78.9629, 20.5937],
  'China': [104.1954, 35.8617],
  'Germany': [10.4515, 51.1657],
  'Italy': [12.5674, 41.8719],
  'France': [2.2137, 46.2276],
  'United Kingdom': [-3.4360, 55.3781],
  'Canada': [-106.3468, 56.1304],
  'Japan': [138.2529, 36.2048],
  'Brazil': [-51.9253, -14.2350],
  'Mexico': [-102.5528, 23.6345],
  'Spain': [-3.7492, 40.4637],
  'South Korea': [127.7669, 35.9078],
  'Ireland': [-8.2439, 53.4129],
  'Switzerland': [8.2275, 46.8182]
};

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Mapping from backend field names to display names
const PROGRAM_AREA_NAME_MAPPING = {
  'drugs': 'Drugs',
  'food': 'Foods',
  'cosmetics': 'Cosmetics',
  'biologics': 'Biologics',
  'devices': 'Devices',
  'bioresearch_monitoring': 'Bioresearch Monitoring',
  'humantissue_for_transplantation': 'Human Tissue for Transplantation',
  'radiologic_health': 'Radiologic Health',
  'veterinary_medicine': 'Veterinary Medicine',
  'part11_compliance': 'Part 11 Compliance',
  'part1240andpart1250': 'Parts 1240 and 1250'
};

const Dashboard = () => {
  const [totalObservations, setTotalObservations] = useState(null);
  const [totalCitesInspected, setTotalCitesInspected] = useState(null);
  const [programAreaCounts, setProgramAreaCounts] = useState(null);
  const [inspectionClassifications, setInspectionClassifications] = useState(null);
  const [countrywiseCounts, setCountrywiseCounts] = useState([]);
  const [trend483Data, setTrend483Data] = useState([]);
  const [trend483Observations, setTrend483Observations] = useState([]);
  const [trend483Pagination, setTrend483Pagination] = useState({ total: 0, page: 1, page_size: 10, total_pages: 0 });
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingProgramAreas, setLoadingProgramAreas] = useState(true);
  const [loadingClassifications, setLoadingClassifications] = useState(true);
  const [loadingCountrywise, setLoadingCountrywise] = useState(true);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [loadingObservations, setLoadingObservations] = useState(false);
  const [availableTrendProgramAreas, setAvailableTrendProgramAreas] = useState([]);
  const [availableTrendSystems, setAvailableTrendSystems] = useState([]);
  const [availableTrendYears, setAvailableTrendYears] = useState([]);
  const [selectedProgramArea, setSelectedProgramArea] = useState('Drugs');
  const [selectedTrendProgramArea, setSelectedTrendProgramArea] = useState('Drugs');
  const [selectedTrendSystem, setSelectedTrendSystem] = useState('Production System');
  const [selectedTrendYear, setSelectedTrendYear] = useState(2022);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  // Fetch total observations and total cites inspected from API
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoadingMetrics(true);
        const [observationsData, citesData] = await Promise.all([
          fetchTotalObservations(),
          fetchTotalCitesInspected()
        ]);
        setTotalObservations(observationsData.total);
        setTotalCitesInspected(citesData.total);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setTotalObservations(0);
        setTotalCitesInspected(0);
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, []);

  // Fetch program area counts from API
  useEffect(() => {
    const fetchProgramAreas = async () => {
      try {
        setLoadingProgramAreas(true);
        const counts = await fetchProgramAreaCounts();
        
        // Transform backend field names to display names
        const transformedCounts = {};
        Object.keys(counts).forEach(key => {
          const displayName = PROGRAM_AREA_NAME_MAPPING[key] || key;
          transformedCounts[displayName] = counts[key];
        });
        
        setProgramAreaCounts(transformedCounts);
      } catch (error) {
        console.error('Error fetching program area counts:', error);
        setProgramAreaCounts(null);
      } finally {
        setLoadingProgramAreas(false);
      }
    };

    fetchProgramAreas();
  }, []);

  // Fetch inspection classifications from API
  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        setLoadingClassifications(true);
        const data = await fetchInspectionClassifications();
        setInspectionClassifications(data);
      } catch (error) {
        console.error('Error fetching inspection classifications:', error);
        setInspectionClassifications({ NAI: 0, VAI: 0, OAI: 0 });
      } finally {
        setLoadingClassifications(false);
      }
    };

    fetchClassifications();
  }, []);

  // Fetch country-wise counts from API
  useEffect(() => {
    const fetchCountrywise = async () => {
      try {
        setLoadingCountrywise(true);
        const data = await fetchCountrywiseCounts();
        setCountrywiseCounts(data);
      } catch (error) {
        console.error('Error fetching country-wise counts:', error);
        setCountrywiseCounts([]);
      } finally {
        setLoadingCountrywise(false);
      }
    };

    fetchCountrywise();
  }, []);

  // Fetch available filters for 483 trend (program areas, systems, years)
  useEffect(() => {
    const fetchAvailableFilters = async () => {
      try {
        const filters = await fetchTrend483AvailableFilters();
        setAvailableTrendProgramAreas(filters.program_areas || []);
        setAvailableTrendSystems(filters.systems || []);
        // Sort years ascending for a natural dropdown order
        const years = Array.isArray(filters.years) ? [...filters.years].sort((a, b) => a - b) : [];
        setAvailableTrendYears(years);
      } catch (error) {
        console.error('Error fetching trend 483 available filters:', error);
      }
    };

    fetchAvailableFilters();
  }, []);

  // Fetch trend 483 data when filters change
  // Filters are applied in order: Program Area -> System -> Year (in backend)
  useEffect(() => {
    const fetchTrend = async () => {
      try {
        setLoadingTrend(true);
        console.log('Fetching trend data with filters (applied in order: Program Area -> System):', {
          programArea: selectedTrendProgramArea,
          system: selectedTrendSystem
        });
        const data = await fetchTrend483Data(selectedTrendProgramArea, selectedTrendSystem);
        console.log('Trend data received:', data);
        setTrend483Data(data);
      } catch (error) {
        console.error('Error fetching trend 483 data:', error);
        setTrend483Data([]);
      } finally {
        setLoadingTrend(false);
      }
    };

    fetchTrend();
  }, [selectedTrendProgramArea, selectedTrendSystem]);

  // Fetch trend 483 observations when filters or page change
  // Filters are applied in order: Program Area -> System -> Year (in backend)
  useEffect(() => {
    const fetchObservations = async () => {
      try {
        setLoadingObservations(true);
        console.log('Fetching observations with filters (applied in order: Program Area -> System -> Year):', {
          programArea: selectedTrendProgramArea,
          system: selectedTrendSystem,
          year: selectedTrendYear,
          page: currentPage
        });
        const response = await fetchTrend483Observations(
          selectedTrendProgramArea, 
          selectedTrendSystem, 
          selectedTrendYear,
          currentPage,
          10 // 10 records per page
        );
        console.log('API Response:', response);
        console.log('Response type:', Array.isArray(response) ? 'Array' : 'Object');
        
        // Handle both array response and object response
        let observationsData = [];
        let paginationInfo = { total: 0, page: 1, page_size: 10, total_pages: 0 };
        
        if (Array.isArray(response)) {
          // If response is directly an array, use it directly
          console.log('Response is an array, using directly. Length:', response.length);
          observationsData = response;
          paginationInfo = {
            total: response.length,
            page: currentPage,
            page_size: 10,
            total_pages: Math.ceil(response.length / 10)
          };
        } else if (response && response.data && Array.isArray(response.data)) {
          // If response is an object with data property that is an array
          console.log('Response is an object with data array. Length:', response.data.length);
          observationsData = response.data;
          // Use the total from backend (total count of all records)
          const totalRecords = response.total || response.data.length;
          paginationInfo = {
            total: totalRecords,
            page: response.page || currentPage,
            page_size: response.page_size || 10,
            total_pages: response.total_pages || Math.ceil(totalRecords / 10)
          };
        } else {
          console.warn('Unexpected response format:', response);
          observationsData = [];
        }
        
        console.log('Final observations data length:', observationsData.length);
        console.log('First observation:', observationsData[0]);
        setTrend483Observations(observationsData);
        setTrend483Pagination(paginationInfo);
      } catch (error) {
        console.error('Error fetching trend 483 observations:', error);
        setTrend483Observations([]);
        setTrend483Pagination({ total: 0, page: 1, page_size: 10, total_pages: 0 });
      } finally {
        setLoadingObservations(false);
      }
    };

    fetchObservations();
  }, [selectedTrendProgramArea, selectedTrendSystem, selectedTrendYear, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTrendProgramArea, selectedTrendSystem, selectedTrendYear]);

  // Prepare program area chart data
  const programAreaData = programAreaCounts
    ? Object.entries(programAreaCounts)
        .filter(([name, value]) => value > 0)
        .map(([name, value]) => ({
    name,
    value
        }))
        .sort((a, b) => b.value - a.value)
    : [];

  // Prepare inspection classification data
  const classificationData = inspectionClassifications
    ? [
        { name: 'NAI', value: inspectionClassifications.NAI || 0 },
        { name: 'VAI', value: inspectionClassifications.VAI || 0 },
        { name: 'OAI', value: inspectionClassifications.OAI || 0 }
      ]
    : [];

  // Prepare country data
  const countryData = countrywiseCounts || [];

  // Program Area + System + Year-wise 483/Observation data
  // Prefer backend-provided years; fall back to 2022–2026 if not available
  const DEFAULT_TREND_YEARS = [2022, 2023, 2024, 2025, 2026];
  const TREND_YEARS = availableTrendYears.length > 0 ? availableTrendYears : DEFAULT_TREND_YEARS;
  
  // Systems for trend filters – prefer backend-provided list
  const ALL_AVAILABLE_SYSTEMS_FALLBACK = [
    'Facilities and Equipment System',
    'Laboratory Control System',
    'Materials System',
    'Packaging and Labeling System',
    'Production System',
    'Quality System'
  ];

  const allSystems = availableTrendSystems.length > 0
    ? availableTrendSystems
    : ALL_AVAILABLE_SYSTEMS_FALLBACK;

  // Use trend data from API
  const trendChartData = trend483Data.length > 0 
    ? trend483Data 
    : TREND_YEARS.map(year => ({ year, observations: 0, fda483s: 0 }));

  const selectedYearData =
    trendChartData.find((d) => d.year === Number(selectedTrendYear)) || {
      year: selectedTrendYear,
      observations: 0,
      fda483s: 0
    };

  const firstYearData = trendChartData[0] || { observations: 0, fda483s: 0 };
  const lastYearData = trendChartData[trendChartData.length - 1] || { observations: 0, fda483s: 0 };
  let trendDirection = 'Stable';
  if (lastYearData.observations > firstYearData.observations) {
    trendDirection = 'Increasing';
  } else if (lastYearData.observations < firstYearData.observations) {
    trendDirection = 'Decreasing';
  }

  // Use observations from API
  // Use trend483Observations directly - it's already an array from the API
  const mappedObservationRows = Array.isArray(trend483Observations) ? trend483Observations : [];

  // Get max values for dynamic heights (with safety checks)
  const maxProgramArea = programAreaData.length > 0 ? Math.max(...programAreaData.map(d => d.value)) : 0;
  const maxClassification = classificationData.length > 0 ? Math.max(...classificationData.map(d => d.value)) : 0;
  const maxCountry = countryData.length > 0 ? Math.max(...countryData.map(d => d.count)) : 0;

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-5 rounded-xl shadow-2xl border-2 border-gray-300">
          <p className="font-bold text-lg text-gray-900 mb-3 pb-2 border-b-2 border-gray-200">
            {typeof label === 'number' ? `Year: ${label}` : label}
          </p>
          <div className="space-y-2">
            {payload
              .sort((a, b) => (b.value || 0) - (a.value || 0))
              .map((entry, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between space-x-4 p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm font-semibold text-gray-700">
                      {entry.name}:
                    </span>
                  </div>
                  <span 
                    className="text-base font-bold"
                    style={{ color: entry.color }}
                  >
                    {entry.value ? entry.value.toLocaleString() : '0'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Country tooltip
  const CountryTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-blue-300">
          <p className="font-bold text-base text-gray-900 mb-2">
            {payload[0].payload.name}
          </p>
          <p className="text-lg font-bold text-blue-600">
            Observations: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* CompliSense Branding - Between Navbar and Content */}
      <div className="w-full py-6 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="bg-white border-2 border-blue-200 rounded-xl px-8 py-4 shadow-sm">
          <span className="text-2xl font-bold" style={{ color: '#1e82c9' }}>
            CompliSense
          </span>
          <p className="text-xs text-gray-500 mt-1 text-center">cGMP Intelligence Platform</p>
        </div>
      </div>

      <div className="py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">FDA 483 Observations Trends</h1>
              <p className="text-gray-600 text-xl">Comprehensive analysis of GMP inspection data (2007-2025)</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="metric-card bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 text-gray-800 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-blue-700" />
                <div className="px-3 py-1 bg-white/60 rounded-full backdrop-blur-sm border border-white/40">
                  <span className="text-xs font-semibold text-gray-700">Total</span>
                </div>
              </div>
              <p className="text-gray-700 text-sm font-medium mb-2 uppercase tracking-wider">Total Observations</p>
              <p className="text-5xl font-bold mb-2 text-gray-900">
                {loadingMetrics ? (
                  <span className="text-3xl animate-pulse">Loading...</span>
                ) : (
                  (totalObservations ?? 0).toLocaleString()
                )}
              </p>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <span>📊</span>
                <span>From 2007 to 2025</span>
              </div>
            </div>
          </div>

          <div className="metric-card bg-gradient-to-br from-teal-400 via-teal-300 to-teal-200 text-gray-800 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Building2 className="w-8 h-8 text-teal-700" />
                <div className="px-3 py-1 bg-white/60 rounded-full backdrop-blur-sm border border-white/40">
                  <span className="text-xs font-semibold text-gray-700">Unique</span>
                </div>
              </div>
              <p className="text-gray-700 text-sm font-medium mb-2 uppercase tracking-wider">Total Sites/Facilities Inspected</p>
              <p className="text-5xl font-bold mb-2 text-gray-900">
                {loadingMetrics ? (
                  <span className="text-3xl animate-pulse">Loading...</span>
                ) : (
                  (totalCitesInspected ?? 0).toLocaleString()
                )}
              </p>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <span>🏢</span>
                <span>Unique facilities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Program Area Distribution */}
        <div className="card mb-10 card-hover">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Observations by Program Area</h2>
                <p className="text-gray-500 text-sm mt-1">Distribution across different regulatory areas</p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={programAreaData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    domain={[0, 'dataMax']}
                    allowDataOverflow={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} strokeWidth={2}>
                    {programAreaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={programAreaData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(1)}%`}
                    outerRadius={110}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {programAreaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>


        {/* NAI/OAI/VAI Pharma Count */}
        <div className="card mb-10 card-hover">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Inspection Classifications</h2>
                <p className="text-gray-500 text-sm mt-1">NAI, OAI, VAI counts for pharmaceutical inspections</p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={classificationData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    domain={[0, 'dataMax']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} strokeWidth={2}>
                    {classificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={classificationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent, value }) => `${name}\n${(percent * 100).toFixed(1)}%\n${value.toLocaleString()}`}
                    outerRadius={110}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {classificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Country-wise Observation Count */}
        <div className="card mb-10 card-hover">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Country-wise Observations</h2>
                <p className="text-gray-500 text-sm mt-1">Hover over dots on the map to see observation counts</p>
                {hoveredCountry && (
                  <p className="text-blue-600 font-semibold mt-2">
                    {hoveredCountry.name}: {hoveredCountry.count.toLocaleString()} observations
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="chart-container">
              <div style={{ width: '100%', height: '400px', position: 'relative', backgroundColor: '#F9FAFB' }}>
                <ComposableMap projectionConfig={{ scale: 120 }}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#E5E7EB"
                          stroke="#9CA3AF"
                          style={{
                            default: { outline: 'none' },
                            hover: { outline: 'none', fill: '#D1D5DB' },
                            pressed: { outline: 'none' }
                          }}
                        />
                      ))
                    }
                  </Geographies>
                  {countryData.map((country, index) => {
                    const coords = countryCoordinates[country.name];
                    if (!coords) return null;
                    const maxCount = Math.max(...countryData.map(c => c.count || 0));
                    const size = Math.max(4, ((country.count || 0) / maxCount) * 12);
                    return (
                      <Marker
                        key={country.name}
                        coordinates={coords}
                      >
                        <g
                          onMouseEnter={() => setHoveredCountry(country)}
                          onMouseLeave={() => setHoveredCountry(null)}
                          style={{ cursor: 'pointer' }}
                        >
                          <circle
                            r={size}
                            fill={COLORS[index % COLORS.length]}
                            stroke="#fff"
                            strokeWidth={2}
                            opacity={hoveredCountry?.name === country.name ? 1 : 0.7}
                          />
                          {hoveredCountry?.name === country.name && (
                            <g>
                              <rect
                                x={-60}
                                y={-size - 35}
                                width={120}
                                height={25}
                                fill="white"
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                rx={4}
                              />
                              <text
                                textAnchor="middle"
                                y={-size - 18}
                                style={{
                                  fontFamily: 'system-ui',
                                  fill: '#1F2937',
                                  fontSize: '11px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {country.name}: {country.count.toLocaleString()}
                              </text>
                            </g>
                          )}
                        </g>
                      </Marker>
                    );
                  })}
                </ComposableMap>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={countryData.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    domain={[0, 'dataMax']}
                  />
                  <Tooltip content={<CountryTooltip />} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} strokeWidth={2}>
                    {countryData.slice(0, 10).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Program Area / System Year-wise 483 Trend (2022-2026) */}
        <div className="card mb-10 card-hover">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Program Area / System Year-wise 483 Trend</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Select program area, system, and year to see observations and corresponding 483&apos;s, with trend from 2022 to 2026
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <select
                value={selectedTrendProgramArea}
                onChange={(e) => setSelectedTrendProgramArea(e.target.value)}
                className="input-field px-4 py-2 font-medium text-gray-700 bg-white border-2 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20 cursor-pointer"
              >
                {programAreaData.map((area) => (
                  <option key={area.name} value={area.name}>{area.name}</option>
                ))}
              </select>
              <select
                value={selectedTrendSystem}
                onChange={(e) => setSelectedTrendSystem(e.target.value)}
                className="input-field px-4 py-2 font-medium text-gray-700 bg-white border-2 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20 cursor-pointer"
              >
                {allSystems.map((system) => (
                  <option key={system} value={system}>{system}</option>
                ))}
              </select>
              <select
                value={selectedTrendYear}
                onChange={(e) => setSelectedTrendYear(Number(e.target.value))}
                className="input-field px-4 py-2 font-medium text-gray-700 bg-white border-2 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400/20 cursor-pointer"
              >
                {TREND_YEARS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
          </div>
        </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Summary cards for selected year */}
            <div className="space-y-4 md:col-span-1">
              <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-sm">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                  Selected Program Area
                </p>
                <p className="text-lg font-bold text-gray-900 mb-2">
                  {selectedTrendProgramArea}
                </p>
                <p className="text-xs text-gray-500">
                  System: <span className="font-semibold text-gray-800">{selectedTrendSystem}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Year: <span className="font-semibold text-gray-800">{selectedTrendYear}</span>
                </p>
            </div>
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                  Observations &amp; 483&apos;s ({selectedTrendYear})
                </p>
                <div className="flex items-baseline space-x-6">
            <div>
                    <p className="text-xs text-gray-500 mb-1">Observations</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {selectedYearData.observations.toLocaleString()}
                    </p>
            </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">483&apos;s Issued</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {selectedYearData.fda483s.toLocaleString()}
                    </p>
          </div>
                </div>
                <p className="mt-3 text-xs text-gray-600">
                  483 count represents warning letters mapped to FEI numbers for the selected filters. Not every observation
                  will necessarily have a corresponding 483.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm">
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">
                  Trend Direction (2022 – 2026)
                </p>
                <p className="text-lg font-bold text-gray-900 mb-1">
                  {trendDirection}
                </p>
                <p className="text-xs text-gray-600">
                  Based on change in observations from 2022 to 2026 for the selected program area and system.
                </p>
              </div>
            </div>

            {/* Clean professional line chart for 2022-2026 trend */}
            <div className="md:col-span-2">
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={340}>
                  <LineChart
                    data={trendChartData}
                    margin={{ top: 20, right: 40, left: 10, bottom: 40 }}
                  >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                      dataKey="year"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(v) => v}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    domain={[0, 'dataMax']}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="observations"
                      name="Observations"
                      stroke={COLORS[0]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="fda483s"
                      name="483's Issued"
                      stroke={COLORS[1]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      strokeDasharray="4 4"
                    />
                  </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
                </div>
                </div>

        {/* Sample Observations & 483 Warning Letters Mapped by FEI */}
        <div className="card mb-10 card-hover">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
                  </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Observations &amp; 483's (FEI Mapping)
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Showing observations and their mapped 483 warning letters for the selected program area, system, and year (from the backend database).
                </p>
              </div>
            </div>
            <div className="hidden md:block text-xs text-gray-500">
              {loadingObservations ? (
                <span>Loading...</span>
              ) : trend483Pagination.total > 0 ? (
                <span>
                  Showing {((currentPage - 1) * trend483Pagination.page_size) + 1} - {Math.min(currentPage * trend483Pagination.page_size, trend483Pagination.total)} of {trend483Pagination.total} records
                </span>
              ) : (
                <span>No records found</span>
              )}
            </div>
              </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full divide-y divide-gray-200 text-sm" style={{ tableLayout: 'auto' }}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[120px]">FEI Number</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[200px]">Legal Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[120px]">Program Area</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[150px]">System</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[130px]">Inspection End Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[150px]">Act/CFR Number</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[250px]">Short Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[350px]">Long Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[180px]">483 Warning Letter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingObservations && (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-gray-500 text-sm">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading records...</span>
          </div>
                    </td>
                  </tr>
                )}
                {!loadingObservations && mappedObservationRows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-gray-500 text-sm">
                      No records found for the selected combination. Try a different year, program area, or system.
                    </td>
                  </tr>
                )}
                {!loadingObservations && mappedObservationRows.map((row, index) => (
                  <tr key={`${row.inspectionId || row.feiNumber}-${index}`} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm text-gray-900 break-words">
                      {row.feiNumber || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-800 break-words">
                      {row.companyName || row.LegalName || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 break-words">
                      {row.programArea || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 break-words">
                      {row.system || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {row.inspectionEndDate
                        ? new Date(row.inspectionEndDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 break-words">
                      {row.cfrNumber || row.ActCFRNumber || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 break-words">
                      <div className="whitespace-normal">{row.shortDescription || '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 break-words">
                      <div className="whitespace-normal">{row.longDescription || '—'}</div>
                    </td>
                    <td className="px-4 py-3">
                      {row.warningLetter ? (
                        <div className="flex flex-col text-xs text-gray-700">
                          <span className="font-semibold text-emerald-700 break-words">
                            {row.warningLetter.recordId}
                          </span>
                          {row.warningLetter.download && (
                            <a
                              href={row.warningLetter.download}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline mb-1 break-all"
                            >
                              View 483 Letter
                            </a>
                          )}
                          {row.warningLetter.recordDate && (
                            <span className="break-words">
                              Record Date:{' '}
                              {new Date(row.warningLetter.recordDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No 483 mapped</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>

          {/* Pagination Controls */}
          {trend483Pagination.total_pages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loadingObservations}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === 1 || loadingObservations
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {currentPage} of {trend483Pagination.total_pages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(trend483Pagination.total_pages, prev + 1))}
                  disabled={currentPage === trend483Pagination.total_pages || loadingObservations}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === trend483Pagination.total_pages || loadingObservations
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * trend483Pagination.page_size) + 1} - {Math.min(currentPage * trend483Pagination.page_size, trend483Pagination.total)} of {trend483Pagination.total} records
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
