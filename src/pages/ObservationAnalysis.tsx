import { useState } from 'react';
import { Search, FileText, TrendingUp, Download, Filter, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const PROGRAM_AREAS = ['Drugs', 'Food', 'Cosmetics', 'Biologics', 'Medical Devices', 'Veterinary', 'Tobacco'];
const SYSTEMS = [
  'Production System',
  'Quality System',
  'Material System',
  'Packaging and Labelling System',
  'Laboratory Control System',
  'Facilities & Equipment System'
];

 

interface SearchResult {
  id: number;
  userObservation: string;
  citationNumber: string;
  citationLink: string;
  citationDescription: string;
  count: number;
  percentage: string;
  relevantObservationsCount: number;
  relevantObservations: string[];
  capaData: {
    immediateActions: string[];
    extensiveInvestigation: string[];
    correctiveActions: string[];
    preventiveActions: string[];
    capaEffectivenessMonitoring: string[];
  };
  fullDescription: string;
}

// Generate dummy search results - removed since navigation is used for demo flow

const ObservationAnalysis = () => {
  const [programArea, setProgramArea] = useState('');
  const [system, setSystem] = useState('');
  const [observation, setObservation] = useState('');
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [isSearching] = useState(false);
  const [expandedCapa, setExpandedCapa] = useState<number | null>(null);
  const [expandedObservations, setExpandedObservations] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
   e.preventDefault();

  if (!programArea || !system || !observation.trim()) {
    alert("Please fill in all fields before searching.");
    return;
  }
  // 👉 Redirect to Request Demo page
  navigate("/request-demo");
};

  /*
  const handleRealSearch = () => {
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = generateSearchResults(observation, programArea, system);
      setSearchResults(results);
      setIsSearching(false);
    }, 1500);
  };
  */

  const handleReset = () => {
  setProgramArea('');
  setSystem('');
  setObservation('');
  setSearchResults(null);
  setExpandedCapa(null);
  setExpandedObservations(null);
};

  const handleExport = () => {
    // Simulate export functionality
    alert('Export functionality will be implemented. This would export the search results to PDF/Excel.');
   };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-1 h-12 rounded-full" style={{ background: '#1e82c9' }}></div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Observation Analysis & CFR Mapping</h1>
              <p className="text-gray-600 text-lg">Enter an observation to find relevant CFR citations, historical patterns, and CAPA recommendations</p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="card mb-8 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: '#1e82c9' }}>
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Search Parameters</h2>
              <p className="text-gray-500 text-sm mt-1">Select program area, system, and enter your observation</p>
            </div>
          </div>

         <div className="grid md:grid-cols-2 gap-6"></div>
          <form onSubmit={handleSearch} className="space-y-6">
              {/* Program Area Dropdown */}
              <div>
                <label htmlFor="programArea" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Filter className="w-4 h-4 inline mr-2" style={{ color: '#1e82c9' }} />
                  Program Area *
                </label>
                <select
                  id="programArea"
                  value={programArea}
                  onChange={(e) => setProgramArea(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select Program Area</option>
                  {PROGRAM_AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* System Dropdown */}
              <div>
                <label htmlFor="system" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Filter className="w-4 h-4 inline mr-2" style={{ color: '#1e82c9' }} />
                  System *
                </label>
                <select
                  id="system"
                  value={system}
                  onChange={(e) => setSystem(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select System</option>
                  {SYSTEMS.map(sys => (
                    <option key={sys} value={sys}>{sys}</option>
                  ))}
                </select>
              </div>

            {/* Observation Text Area */}
            <div>
              <label htmlFor="observation" className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" style={{ color: '#1e82c9' }} />
                Enter Observation *
              </label>
              <textarea
                id="observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={5}
                className="input-field resize-none"
                placeholder="Enter the FDA 483 observation text here. For example: 'Failure to establish and follow adequate written procedures for documentation and record keeping...'"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the complete observation text as it appears in the FDA Form 483
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <div className="spinner w-5 h-5 border-2"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary"
              >
                Reset
              </button>
              {searchResults && (
                <button
                  type="button"
                  onClick={handleExport}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Export Results</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div className="card card-hover animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Found {searchResults.length} relevant CFR citation{searchResults.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#1e82c9' }} className="text-white">
                    <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider border-r" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                      Sr. No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-r" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                      Observation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-r" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                      Citation
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-300">
                      Citation Frequency %, Count
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-r" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                      Similar Observations
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      CAPA
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((result) => (
                    <>
                      <tr 
                        key={result.id}
                        className="transition-colors"
                        style={{ '--hover-bg': 'rgba(30, 130, 201, 0.1)' } as React.CSSProperties}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(30, 130, 201, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td className="px-4 py-4 text-center border-r border-gray-200">
                          <span className="text-sm font-semibold text-gray-700">{result.id}</span>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900 max-w-md leading-relaxed">
                            {result.userObservation}
                          </div>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          <a 
                            href={result.citationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center text-sm font-bold text-white px-3 py-1.5 rounded shadow-md transition-colors cursor-pointer"
                            style={{ background: '#1e82c9' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a6fa8'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e82c9'}
                          >
                            {result.citationNumber}
                          </a>
                        </td>
                        <td className="px-4 py-4 text-center border-r border-gray-200">
                          <span className="text-sm font-semibold text-gray-700">{result.percentage}%, {result.count}</span>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          <div className="flex flex-col space-y-1">
                            <span className="text-sm text-gray-600">{result.relevantObservationsCount} observations</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedObservations(expandedObservations === result.id ? null : result.id);
                              }}
                              className="font-semibold text-xs flex items-center space-x-1 hover:underline w-fit"
                              style={{ color: '#1e82c9' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#1a6fa8'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#1e82c9'}
                            >
                              <span>View Details</span>
                              <span style={{ color: '#1e82c9' }}>→</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCapa(expandedCapa === result.id ? null : result.id);
                            }}
                            className="font-semibold text-sm flex items-center space-x-1 hover:underline"
                            style={{ color: '#1e82c9' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#1a6fa8'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#1e82c9'}
                          >
                            <span>View Details</span>
                            <span style={{ color: '#1e82c9' }}>→</span>
                          </button>
                        </td>
                      </tr>
                      {/* Expanded Similar Observations */}
                      {expandedObservations === result.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-6 bg-gray-50">
                            <div className="bg-white p-5 rounded-xl border border-gray-200">
                              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                Similar Observations ({result.relevantObservations.length})
                              </h3>
                              <div className="space-y-3">
                                {result.relevantObservations.map((obs, idx) => (
                                  <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                      {idx + 1}
                                    </span>
                                    <p className="text-gray-700 text-sm leading-relaxed">{obs}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      
                      {/* Expanded CAPA */}
                      {expandedCapa === result.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-6 bg-gray-50">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                              <div className="mb-6 pb-4 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                  <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                                  Recommended CAPA Strategy
                                </h3>
                                <p className="text-gray-500 text-sm mt-1 ml-8">
                                  Based on CFR {result.citationNumber} requirements and industry best practices
                                </p>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center">
                                      <AlertCircle className="w-4 h-4 mr-2" />
                                      Immediate Actions
                                    </h4>
                                    <ul className="space-y-2">
                                      {result.capaData.immediateActions.map((action, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                                          <span className="mr-2 text-red-400">•</span>
                                          {action}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center">
                                      <Search className="w-4 h-4 mr-2" />
                                      Investigation
                                    </h4>
                                    <ul className="space-y-2">
                                      {result.capaData.extensiveInvestigation.map((action, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                                          <span className="mr-2 text-blue-400">•</span>
                                          {action}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                                
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center">
                                      <TrendingUp className="w-4 h-4 mr-2" />
                                      Corrective & Preventive Actions
                                    </h4>
                                    <div className="space-y-4">
                                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                        <p className="text-xs font-semibold text-green-800 mb-2">Corrective Actions (fix current issue):</p>
                                        <ul className="space-y-1">
                                          {result.capaData.correctiveActions.map((action, idx) => (
                                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                                              <span className="mr-2 text-green-500">✓</span>
                                              {action}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      
                                      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                        <p className="text-xs font-semibold text-indigo-800 mb-2">Preventive Actions (prevent recurrence):</p>
                                        <ul className="space-y-1">
                                          {result.capaData.preventiveActions.map((action, idx) => (
                                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                                              <span className="mr-2 text-indigo-500">🛡️</span>
                                              {action}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center">
                                      <Shield className="w-4 h-4 mr-2" />
                                      Effectiveness Monitoring
                                    </h4>
                                    <ul className="space-y-2">
                                      {result.capaData.capaEffectivenessMonitoring.map((action, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                                          <span className="mr-2 text-purple-400">•</span>
                                          {action}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObservationAnalysis;
