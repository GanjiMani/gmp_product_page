import { useEffect, useState } from 'react';
import { getAggregatedData } from '../data/dummyData';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, AreaChart
} from 'recharts';
import { Building2, FileText, Users, TrendingUp, Award, Activity, Globe, AlertTriangle, MapPin } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

// Professional color palette for corporate dashboards
const COLORS = [
  '#2563EB',  // Professional Blue
  '#059669',  // Professional Green
  '#7C3AED',  // Professional Purple
  '#DC2626',  // Professional Red
  '#EA580C',  // Professional Orange
  '#0891B2',  // Professional Cyan
  '#BE185D',  // Professional Pink
  '#B45309',  // Professional Amber
  '#1E40AF',  // Deep Blue
  '#047857',  // Deep Green
  '#6B21A8',  // Deep Purple
  '#991B1B',  // Deep Red
  '#C2410C',  // Deep Orange
  '#0E7490',  // Deep Cyan
  '#9F1239'   // Deep Pink
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

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [selectedProgramArea, setSelectedProgramArea] = useState('Drugs');
  const [selectedTrendProgramArea, setSelectedTrendProgramArea] = useState('Drugs');
  const [selectedTrendSystem, setSelectedTrendSystem] = useState('Production');
  const [selectedTrendYear, setSelectedTrendYear] = useState(2022);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setData(getAggregatedData());
    }, 500);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-6"></div>
          <p className="text-gray-700 text-lg font-medium">Loading dashboard data...</p>
          <p className="text-gray-500 text-sm mt-2">Preparing comprehensive analytics</p>
        </div>
      </div>
    );
  }

  // Prepare program area chart data
  const programAreaData = Object.entries(data.programAreaCounts).map(([name, value]) => ({
    name,
    value
  }));

  // Prepare system trends data
  const systemTrendsData = [];
  for (let year = 2007; year <= 2025; year++) {
    const yearData = { year };
    Object.keys(data.systemTrends).forEach(system => {
      yearData[system] = data.systemTrends[system][year];
    });
    systemTrendsData.push(yearData);
  }

  // Prepare program area system breakdown
  const programSystemData = Object.entries(data.programSystemCounts[selectedProgramArea] || {}).map(([system, count]) => ({
    system,
    count
  }));

  // Establishment type data (highest and lowest)
  const establishmentData = Object.entries(data.establishmentTypeCounts || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const highestEstablishment = establishmentData[0];
  const lowestEstablishment = establishmentData[establishmentData.length - 1];
  const establishmentComparison = [highestEstablishment, lowestEstablishment];

  // NAI/OAI/VAI pharma data
  const classificationData = [
    { name: 'NAI', value: 210857 },
    { name: 'VAI', value: 102812 },
    { name: 'OAI', value: 12533 }
  ];

  // Country data
  const countryData = Object.entries(data.countryCounts || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Fiscal year data
  const fiscalYearData = data.fiscalYearData || [];

  // CFR numbers data
  const cfrData = Object.entries(data.cfrCounts || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // System facility counts
  const systemFacilityData = Object.entries(data.systemFacilityCounts || {}).map(([system, count]) => ({
    system,
    count
  }));

  // Program Area + System + Year-wise 483/Observation data (2022-2026)
  const TREND_YEARS = [2022, 2023, 2024, 2025, 2026];
  const allSystems = Object.keys(
    data.programSystemCounts?.[Object.keys(data.programSystemCounts || {})[0]] || {}
  );

  const baseAggregates = TREND_YEARS.reduce((acc, year) => {
    acc[year] = { observations: 0, fda483s: 0 };
    return acc;
  }, {});

  // Aggregate observations per year for the selected Program Area + System
  if (Array.isArray(data.observations)) {
    data.observations.forEach((obs) => {
      const year = obs.inspectionEndDate?.getFullYear();
      if (
        year >= 2022 &&
        year <= 2025 &&
        obs.programArea === selectedTrendProgramArea &&
        obs.system === selectedTrendSystem
      ) {
        baseAggregates[year].observations += 1;
      }
    });
  }

  // Aggregate 483 warning letters per year, mapped by FEI for same Program Area + System
  if (Array.isArray(data.warningLetters)) {
    data.warningLetters.forEach((wl) => {
      const year = wl.inspectionEndDate
        ? new Date(wl.inspectionEndDate).getFullYear()
        : null;
      if (
        year &&
        year >= 2022 &&
        year <= 2025 &&
        wl.programArea === selectedTrendProgramArea &&
        wl.system === selectedTrendSystem
      ) {
        baseAggregates[year].fda483s += 1;
      }
    });
  }

  // If 2026 has no data, softly project based on recent years so the trend is continuous and variable
  if (baseAggregates[2026].observations === 0) {
    const refYears = [2023, 2024, 2025];
    const refObsSum = refYears.reduce(
      (sum, y) => sum + (baseAggregates[y].observations || 0),
      0
    );
    const refCount = refYears.filter(
      (y) => baseAggregates[y].observations > 0
    ).length || 1;
    const avgObs = refObsSum / refCount;
    const factor = 0.7 + Math.random() * 0.6; // between 0.7x and 1.3x
    const projectedObs = Math.max(5, Math.round(avgObs * factor));
    baseAggregates[2026].observations = projectedObs;

    // Assume 483 letters are a fraction (30–80%) of observations
    const rate = 0.3 + Math.random() * 0.5;
    baseAggregates[2026].fda483s = Math.round(projectedObs * rate);
  }

  const trendChartData = TREND_YEARS.map((year) => ({
    year,
    observations: baseAggregates[year].observations,
    fda483s: baseAggregates[year].fda483s
  }));

  const selectedYearData =
    trendChartData.find((d) => d.year === Number(selectedTrendYear)) || {
      year: selectedTrendYear,
      observations: 0,
      fda483s: 0
    };

  const firstYearData = trendChartData[0];
  const lastYearData = trendChartData[trendChartData.length - 1];
  let trendDirection = 'Stable';
  if (lastYearData.observations > firstYearData.observations) {
    trendDirection = 'Increasing';
  } else if (lastYearData.observations < firstYearData.observations) {
    trendDirection = 'Decreasing';
  }

  // Map of warning letters keyed by FEI Number for FEI-level mapping
  const warningByFei = new Map();
  (data.warningLetters || []).forEach((wl) => {
    if (!warningByFei.has(wl.feiNumber)) {
      warningByFei.set(wl.feiNumber, wl);
    }
  });

  // Observations & 483 warning letters mapped by FEI for the selected filters
  const mappedObservationRows = (data.observations || [])
    .filter((obs) => {
      const year = obs.inspectionEndDate?.getFullYear();
      return (
        obs.programArea === selectedTrendProgramArea &&
        obs.system === selectedTrendSystem &&
        year === Number(selectedTrendYear)
      );
    })
    .slice(0, 50)
    .map((obs) => ({
      ...obs,
      warningLetter: warningByFei.get(obs.feiNumber) || null
    }));

  // Get max values for dynamic heights (with safety checks)
  const maxProgramArea = programAreaData.length > 0 ? Math.max(...programAreaData.map(d => d.value)) : 0;
  const maxSystem = programSystemData.length > 0 ? Math.max(...programSystemData.map(d => d.count)) : 0;
  const maxEstablishment = establishmentData.length > 0 ? Math.max(...establishmentData.map(d => d.value)) : 0;
  const maxClassification = classificationData.length > 0 ? Math.max(...classificationData.map(d => d.value)) : 0;
  const maxCountry = countryData.length > 0 ? Math.max(...countryData.map(d => d.value)) : 0;
  const maxCFR = cfrData.length > 0 ? Math.max(...cfrData.map(d => d.value)) : 0;
  const maxSystemFacility = systemFacilityData.length > 0 ? Math.max(...systemFacilityData.map(d => d.count)) : 0;

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
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
              <p className="text-5xl font-bold mb-2 text-gray-900">{data.totalObservations.toLocaleString()}</p>
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
              <p className="text-5xl font-bold mb-2 text-gray-900">{data.totalFacilities?.toLocaleString() || data.totalCompanies.toLocaleString()}</p>
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
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} strokeWidth={1}>
                    {programAreaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={1} />
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
                    strokeWidth={1}
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

        {/* System-wise Breakdown by Program Area */}
        <div className="card mb-10 card-hover">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">System-wise Breakdown by Program Area</h2>
                <p className="text-gray-500 text-sm mt-1">Observations by system within each program area</p>
              </div>
            </div>
            <select
              value={selectedProgramArea}
              onChange={(e) => setSelectedProgramArea(e.target.value)}
              className="input-field px-5 py-3 font-medium text-gray-700 bg-white border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 cursor-pointer"
            >
              {Object.keys(data.programAreaCounts).map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={programSystemData} layout="vertical" margin={{ top: 20, right: 30, left: 150, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={[0, 'dataMax']}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <YAxis 
                  dataKey="system" 
                  type="category" 
                  width={140}
                  tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} strokeWidth={2}>
                  {programSystemData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* System Summary Cards */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {programSystemData.map((system, index) => {
              const total = programSystemData.reduce((sum, s) => sum + s.count, 0);
              const percentage = ((system.count / total) * 100).toFixed(1);
              return (
                <div key={system.system} className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:border-blue-300 transition-colors shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <p className="text-xs font-semibold text-gray-700 truncate">{system.system.split(' ')[0]}</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{system.count.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 mt-1">{percentage}% of total</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Establishment Type - Highest and Lowest */}
        <div className="card mb-10 card-hover">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Establishment Type Analysis</h2>
                <p className="text-gray-500 text-sm mt-1">Establishment types by observation count</p>
              </div>
            </div>
          </div>
          <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={establishmentData} layout="vertical" margin={{ top: 20, right: 30, left: 150, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} domain={[0, 'dataMax']} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={140}
                    tick={{ fill: '#374151', fontSize: 10, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} strokeWidth={1}>
                    {establishmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} strokeWidth={1}>
                    {classificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index * 2 + 4]} stroke={COLORS[index * 2 + 4]} strokeWidth={1} />
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
                    strokeWidth={1}
                  >
                    {classificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index * 2 + 4]} />
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
                    {hoveredCountry.name}: {hoveredCountry.value.toLocaleString()} observations
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
                    const maxCount = Math.max(...countryData.map(c => c.value));
                    const size = Math.max(4, (country.value / maxCount) * 12);
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
                                {country.name}: {country.value.toLocaleString()}
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
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} strokeWidth={1}>
                    {countryData.slice(0, 10).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={1} />
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
                {Object.keys(data.programAreaCounts).map((area) => (
                  <option key={area} value={area}>{area}</option>
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
                      stroke="#2563EB" // soft blue
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="fda483s"
                      name="483's Issued"
                      stroke="#10B981" // soft green
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
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
                  Observations &amp; 483 Warning Letters (FEI Mapping)
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Showing sample of observations and their mapped 483 warning letters for the selected program area, system, and year.
                </p>
              </div>
            </div>
            <div className="hidden md:block text-xs text-gray-500">
              Limited to first 50 records for display.
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">FEI Number</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Legal Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Program Area</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">System</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Inspection End Date</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Act/CFR Number</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Short Description</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">483 Warning Letter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mappedObservationRows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500 text-sm">
                      No dummy records found for the selected combination. Try a different year, program area, or system.
                    </td>
                  </tr>
                )}
                {mappedObservationRows.map((row, index) => (
                  <tr key={`${row.feiNumber}-${index}`} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-gray-900">
                      {row.feiNumber}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-800">
                      {row.companyName}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {row.programArea}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {row.system}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {row.inspectionEndDate
                        ? new Date(row.inspectionEndDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {row.cfrNumber}
                    </td>
                    <td className="px-4 py-2 text-gray-700 max-w-xs">
                      <div className="line-clamp-2">{row.shortDescription}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {row.warningLetter ? (
                        <div className="flex flex-col text-xs text-gray-700">
                          <span className="font-semibold text-emerald-700">
                            {row.warningLetter.recordId}
                          </span>
                          <a
                            href={row.warningLetter.download}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline mb-1"
                          >
                            View 483 Letter
                          </a>
                          <span>
                            Record Date:{' '}
                            {row.warningLetter.recordDate
                              ? new Date(row.warningLetter.recordDate).toLocaleDateString()
                              : '—'}
                          </span>
                          <span>
                            Publish Date:{' '}
                            {row.warningLetter.publishDate
                              ? new Date(row.warningLetter.publishDate).toLocaleDateString()
                              : '—'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No 483 mapped (dummy)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Year-wise Observations */}
        <div className="card mb-10 card-hover">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Year-wise Observations</h2>
                <p className="text-gray-500 text-sm mt-1">Fiscal year trends from 2009 to 2026</p>
              </div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={fiscalYearData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="year" 
                  angle={-45} 
                  textAnchor="end" 
                  height={120}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={[0, 'dataMax']}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} strokeWidth={2}>
                  {fiscalYearData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Investigators with Warning Letters and CFR Numbers */}
        <div className="card mb-10 card-hover">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Top 10 Investigators</h2>
              <p className="text-gray-500 text-sm mt-1">Most active FDA inspectors with warning letters and CFR usage</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="chart-container">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Warning Letters Issued</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data.topInvestigators} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    domain={[0, 'dataMax']}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="warningLetters" radius={[12, 12, 0, 0]} strokeWidth={2} fill={COLORS[4]}>
                    {data.topInvestigators.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[4]} stroke={COLORS[4]} strokeWidth={2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-container">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Most Used CFR Numbers</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={cfrData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    domain={[0, 'dataMax']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} strokeWidth={2}>
                    {cfrData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3">
            {data.topInvestigators.map((investigator, index) => (
              <div 
                key={investigator.name} 
                className="flex items-center space-x-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                  index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500' :
                  index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                  index === 2 ? 'bg-gradient-to-br from-gray-500 to-gray-600' :
                  'bg-gradient-to-br from-blue-400 to-blue-500'
                }`}>
                  {index < 3 ? '🏆' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-lg">{investigator.name}</p>
                  <p className="text-gray-500 text-sm">FDA Inspector | Warning Letters: {investigator.warningLetters} | Top CFR: {investigator.topCFR}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-64 bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-blue-400 via-blue-500 to-teal-400 shadow-lg"
                      style={{ width: `${(investigator.count / data.topInvestigators[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xl font-bold text-gray-900 w-24 text-right">
                    {investigator.count.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
