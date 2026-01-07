import { useState } from 'react';
import { Search, FileText, TrendingUp, AlertCircle, CheckCircle, Download, Filter } from 'lucide-react';

const PROGRAM_AREAS = ['Drugs', 'Food', 'Cosmetics', 'Biologics', 'Medical Devices', 'Veterinary', 'Tobacco'];
const SYSTEMS = [
  'Production System',
  'Quality System',
  'Material System',
  'Packaging and Labelling System',
  'Laboratory Control System',
  'Facilities & Equipment System'
];

const ESTABLISHMENTS = [
  'API Manufacturer',
  'Outsourcing Facility',
  'Sterile Drug Manufacturer',
  'Drug Product Manufacturer',
  'Blood Bank',
  'Producer of sterile drugs',
  'Sprout Grower',
  'Human and Veterinarian Drug Manufacturer'
];

// Dummy CFR citations mapping
const CFR_CITATIONS = {
  '211.125': 'Procedures for documentation and record keeping',
  '211.160': 'Laboratory controls - General requirements',
  '211.165': 'Testing and release for distribution',
  '211.188': 'Batch production and control records',
  '211.192': 'Production record review',
  '211.22': 'Responsibilities of quality control unit',
  '211.84': 'Testing and approval or rejection of components',
  '211.110': 'Sampling and testing of in-process materials',
  '211.113': 'Control of microbiological contamination',
  '211.142': 'Warehousing procedures'
};

// Generate dummy search results
const generateSearchResults = (observation, programArea, system) => {
  // Simulate finding CFR citations based on keywords
  const keywords = observation.toLowerCase().split(' ');
  const matchedCFRs = Object.keys(CFR_CITATIONS).filter(cfr => {
    const cfrDesc = CFR_CITATIONS[cfr].toLowerCase();
    return keywords.some(keyword => cfrDesc.includes(keyword)) || Math.random() > 0.7;
  }).slice(0, 3);

  if (matchedCFRs.length === 0) {
    matchedCFRs.push('211.125', '211.160', '211.165');
  }

  return matchedCFRs.map((cfr, index) => {
    const count = Math.floor(Math.random() * 5000) + 100;
    const totalObservations = 261811;
    const percentage = ((count / totalObservations) * 100).toFixed(2);
    
    // Generate relevant observations
    const relevantObservations = [
      `Failure to establish and follow adequate written procedures for ${CFR_CITATIONS[cfr].toLowerCase()} in ${programArea.toLowerCase()} manufacturing.`,
      `Inadequate documentation and record keeping procedures as required by ${cfr}.`,
      `Quality control unit failed to review and approve procedures related to ${CFR_CITATIONS[cfr].toLowerCase()}.`,
      `Missing or incomplete batch records demonstrating compliance with ${cfr} requirements.`,
      `Insufficient validation data to support procedures under ${cfr}.`
    ].slice(0, Math.floor(Math.random() * 3) + 2);

    // Generate CAPA recommendations
    const capaActions = [
      `Develop and implement comprehensive written procedures for ${CFR_CITATIONS[cfr].toLowerCase()} in accordance with ${cfr}.`,
      `Conduct gap analysis of current procedures against ${cfr} requirements and document findings.`,
      `Establish training program for all personnel involved in ${CFR_CITATIONS[cfr].toLowerCase()} activities.`,
      `Implement robust documentation system to ensure all records meet ${cfr} standards.`,
      `Conduct internal audit to verify compliance with ${cfr} and document corrective actions.`,
      `Establish quality metrics and monitoring system to track compliance with ${cfr} requirements.`
    ].slice(0, Math.floor(Math.random() * 4) + 3);

    return {
      id: index + 1,
      userObservation: observation,
      citationNumber: cfr,
      citationDescription: CFR_CITATIONS[cfr],
      count: count,
      percentage: percentage,
      relevantObservations: relevantObservations,
      capaActions: capaActions
    };
  });
};

const ObservationAnalysis = () => {
  const [programArea, setProgramArea] = useState('');
  const [system, setSystem] = useState('');
  const [establishment, setEstablishment] = useState(''); 
  const [observation, setObservation] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!programArea || !system || !establishment || !observation.trim()) {
      alert('Please fill in all fields before searching.');
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = generateSearchResults(observation, programArea, system);
      setSearchResults(results);
      setIsSearching(false);
    }, 1500);
  };

  const handleReset = () => {
    setProgramArea('');
    setSystem('');
    setEstablishment('');
    setObservation('');
    setSearchResults(null);
    setExpandedRow(null);
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
            <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Observation Analysis & CFR Mapping</h1>
              <p className="text-gray-600 text-lg">Enter an observation to find relevant CFR citations, historical patterns, and CAPA recommendations</p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="card mb-8 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Search Parameters</h2>
              <p className="text-gray-500 text-sm mt-1">Select program area, system, and enter your observation</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Program Area Dropdown */}
              <div>
                <label htmlFor="programArea" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Filter className="w-4 h-4 inline mr-2 text-blue-600" />
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
                  <Filter className="w-4 h-4 inline mr-2 text-purple-600" />
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
              {/* Establishment Dropdown */}
              <div>
                <label
                  htmlFor="establishment"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  <Filter className="w-4 h-4 inline mr-2 text-indigo-600" />
                  Establishment *
                </label>
                <select
                  id="establishment"
                  value={establishment}
                  onChange={(e) => setEstablishment(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select Establishment</option>
                  {ESTABLISHMENTS.map((est) => (
                    <option key={est} value={est}>
                      {est}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Observation Text Area */}
            <div>
              <label htmlFor="observation" className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2 text-indigo-600" />
                Enter Observation *
              </label>
              <textarea
                id="observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows="5"
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
                  <tr className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      User Entered Observation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Citation Number (CFR)
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                      Count (2007-2025)
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((result, index) => (
                    <>
                      <tr 
                        key={result.id}
                        className={`hover:bg-blue-50 transition-colors cursor-pointer ${expandedRow === result.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setExpandedRow(expandedRow === result.id ? null : result.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium max-w-md leading-relaxed">
                            <span className="font-semibold text-gray-700">Observation:</span>
                            <br />
                            <span className="text-gray-800">
                              {result.userObservation.substring(0, 120)}
                              {result.userObservation.length > 120 && '...'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            <span className="inline-flex items-center justify-center text-sm font-bold text-white bg-gradient-to-r from-blue-400 to-blue-500 px-4 py-2 rounded-lg shadow-md">
                              {result.citationNumber}
                            </span>
                            <div className="text-xs text-gray-600 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                              {result.citationDescription}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-gray-900">
                              {result.count.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">occurrences</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <span className="text-2xl font-bold text-gray-700">
                              {result.percentage}%
                            </span>
                            <div className="w-32 bg-gray-200 rounded-full h-3 shadow-inner">
                              <div
                                className="bg-gradient-to-r from-blue-400 via-blue-500 to-teal-400 h-3 rounded-full shadow-sm transition-all duration-500"
                                style={{ width: `${Math.min(parseFloat(result.percentage), 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                            expandedRow === result.id 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}>
                            {expandedRow === result.id ? 'Hide Details' : 'View Details'}
                          </button>
                        </td>
                      </tr>
                      {expandedRow === result.id && (
                        <tr>
                          <td colSpan="5" className="px-6 py-6 bg-gray-50">
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Relevant Observations */}
                              <div className="bg-white p-5 rounded-xl border border-gray-200">
                                <div className="flex items-center space-x-2 mb-4">
                                  <AlertCircle className="w-5 h-5 text-orange-600" />
                                  <h3 className="font-bold text-gray-900">Relevant Observations (2007-2025)</h3>
                                </div>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                  {result.relevantObservations.map((obs, idx) => (
                                    <div key={idx} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                                      <p className="text-sm text-gray-700">{obs}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* CAPA Actions */}
                              <div className="bg-white p-5 rounded-xl border border-gray-200">
                                <div className="flex items-center space-x-2 mb-4">
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <h3 className="font-bold text-gray-900">Corrective & Preventive Actions (CAPA)</h3>
                                </div>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                  {result.capaActions.map((action, idx) => (
                                    <div key={idx} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <p className="text-sm text-gray-700">{action}</p>
                                    </div>
                                  ))}
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

            {/* Summary Statistics */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Search Summary</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Program Area: </span>
                  <span className="font-semibold text-gray-900">{programArea}</span>
                </div>
                <div>
                  <span className="text-gray-600">System: </span>
                  <span className="font-semibold text-gray-900">{system}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total CFR Citations Found: </span>
                  <span className="font-semibold text-blue-600">{searchResults.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searchResults && !isSearching && (
          <div className="card text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Search Results Yet</h3>
            <p className="text-gray-500">
              Fill in the form above and click "Search" to find relevant CFR citations and CAPA recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObservationAnalysis;

