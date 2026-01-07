import { useEffect, useState } from 'react';
import { getAggregatedData } from '../data/dummyData';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Building2, FileText, Users, TrendingUp, Award, Activity } from 'lucide-react';

// Professional, light color palette for audit/compliance dashboards
const COLORS = [
  '#60A5FA',  // Light Sky Blue
  '#34D399',  // Light Emerald Green
  '#A78BFA',  // Light Lavender
  '#FBBF24',  // Light Amber
  '#F87171',  // Light Coral Red
  '#4FD1C7',  // Light Turquoise
  '#818CF8',  // Light Indigo
  '#FCD34D'   // Light Golden Yellow
];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [selectedProgramArea, setSelectedProgramArea] = useState('Drugs');

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

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-5 rounded-xl shadow-2xl border-2 border-gray-300">
          <p className="font-bold text-lg text-gray-900 mb-3 pb-2 border-b-2 border-gray-200">
            Year: <span className="text-blue-600">{label}</span>
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

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">FDA 483 Observations Dashboard</h1>
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
              <p className="text-gray-700 text-sm font-medium mb-2 uppercase tracking-wider">Total Companies Inspected</p>
              <p className="text-5xl font-bold mb-2 text-gray-900">{data.totalCompanies.toLocaleString()}</p>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <span>🏢</span>
                <span>Unique establishments</span>
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
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={programAreaData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} strokeWidth={2}>
                    {programAreaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                  <Pie
                    data={programAreaData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(1)}%`}
                    outerRadius={140}
                    innerRadius={60}
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

        {/* Program Area System Breakdown */}
        <div className="card mb-10 card-hover">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">System-wise Breakdown</h2>
                <p className="text-gray-500 text-sm mt-1">Observations by cGMP system within program area</p>
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
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={programSystemData} layout="vertical" margin={{ top: 20, right: 30, left: 150, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis 
                  dataKey="system" 
                  type="category" 
                  width={140}
                  tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 12, 12, 0]} strokeWidth={2}>
                  {programSystemData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Investigators */}
        <div className="card mb-10 card-hover">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Top 10 Investigators</h2>
              <p className="text-gray-500 text-sm mt-1">Most active FDA inspectors by observation count</p>
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
                  <p className="text-gray-500 text-sm">FDA Inspector</p>
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

        {/* System Trends Over Time */}
        <div className="card card-hover">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">System-wise Trends (2007-2025)</h2>
                <p className="text-gray-500 text-sm mt-1">Historical analysis of observations across cGMP systems</p>
              </div>
            </div>
          </div>
          
          {/* System Legend - Clear and Organized */}
          <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border-2 border-blue-100">
            <p className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">cGMP Systems Overview</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.keys(data.systemTrends).map((system, index) => {
                const systemData = systemTrendsData.map(d => d[system]);
                const total = systemData.reduce((a, b) => a + b, 0);
                return (
                  <div
                    key={system}
                    className="flex flex-col items-center p-3 bg-white rounded-lg border-2 shadow-sm hover:shadow-md transition-all"
                    style={{ borderColor: COLORS[index % COLORS.length] }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-xs font-bold text-gray-800 text-center leading-tight">
                        {system.split(' ')[0]}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{total.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">total</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Chart - Enhanced for Clarity */}
          <div className="chart-container bg-white p-4 rounded-xl">
            <ResponsiveContainer width="100%" height={650}>
              <LineChart 
                data={systemTrendsData} 
                margin={{ top: 30, right: 40, left: 30, bottom: 80 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#d1d5db" 
                  vertical={false}
                  strokeOpacity={0.5}
                />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: '#1f2937', fontSize: 14, fontWeight: 600 }}
                  stroke="#6b7280"
                  tickLine={{ stroke: '#6b7280', strokeWidth: 2 }}
                  axisLine={{ stroke: '#6b7280', strokeWidth: 2 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  label={{ 
                    value: 'Year (2007-2025)', 
                    position: 'insideBottom', 
                    offset: -10, 
                    fill: '#374151', 
                    fontSize: 15, 
                    fontWeight: 700 
                  }}
                />
                <YAxis 
                  tick={{ fill: '#1f2937', fontSize: 14, fontWeight: 600 }}
                  stroke="#6b7280"
                  tickLine={{ stroke: '#6b7280', strokeWidth: 2 }}
                  axisLine={{ stroke: '#6b7280', strokeWidth: 2 }}
                  label={{ 
                    value: 'Number of Observations', 
                    angle: -90, 
                    position: 'insideLeft', 
                    fill: '#374151', 
                    fontSize: 15, 
                    fontWeight: 700,
                    offset: 10
                  }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#9ca3af', strokeWidth: 2, strokeDasharray: '5 5' }}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: '40px', 
                    paddingBottom: '30px',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                  iconType="line"
                  iconSize={20}
                  formatter={(value) => (
                    <span style={{ 
                      color: '#1f2937', 
                      fontWeight: 600,
                      fontSize: '13px'
                    }}>
                      {value}
                    </span>
                  )}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
                {Object.keys(data.systemTrends).map((system, index) => (
                  <Line
                    key={system}
                    type="monotone"
                    dataKey={system}
                    name={system}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={4}
                    dot={{ 
                      fill: COLORS[index % COLORS.length], 
                      r: 5, 
                      strokeWidth: 3, 
                      stroke: '#fff',
                      fillOpacity: 1
                    }}
                    activeDot={{ 
                      r: 8, 
                      strokeWidth: 3, 
                      stroke: '#fff',
                      fill: COLORS[index % COLORS.length]
                    }}
                    animationDuration={1500}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.keys(data.systemTrends).map((system, index) => {
                const systemData = systemTrendsData.map(d => d[system]);
                const total = systemData.reduce((a, b) => a + b, 0);
                const avg = Math.round(total / systemData.length);
                const max = Math.max(...systemData);
                const maxYear = systemTrendsData.find(d => d[system] === max)?.year;
                
                return (
                  <div key={system} className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:border-blue-300 transition-colors shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <p className="text-xs font-semibold text-gray-700 truncate">{system.split(' ')[0]}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-1">Total: {total.toLocaleString()} | Avg: {avg.toLocaleString()}/yr</p>
                    {maxYear && (
                      <p className="text-xs text-gray-500 mt-1">Peak: {maxYear} ({max.toLocaleString()})</p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


