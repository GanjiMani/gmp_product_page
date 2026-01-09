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

// Generate dummy search results - returns only one row per observation
const generateSearchResults = (observation, programArea, system) => {
  // Simulate finding CFR citations based on keywords
  const keywords = observation.toLowerCase().split(' ');
  const allCFRs = Object.keys(CFR_CITATIONS);
  const matchedCFRs = allCFRs.filter(cfr => {
    const cfrDesc = CFR_CITATIONS[cfr].toLowerCase();
    return keywords.some(keyword => cfrDesc.includes(keyword)) || Math.random() > 0.7;
  });

  // Get main citation (highest score)
  const mainCFR = matchedCFRs.length > 0 ? matchedCFRs[0] : '211.125';
  const mainCount = Math.floor(Math.random() * 500) + 200;
  const totalObservations = 261811;
  const mainPercentage = ((mainCount / totalObservations) * 100).toFixed(1);
  
  // Generate relevant citations (top 5 with score less than main citation)
  const relevantCitations = allCFRs
    .filter(cfr => cfr !== mainCFR)
    .map(cfr => ({
      citation: `21 CFR ${cfr}`,
      count: Math.floor(Math.random() * (mainCount - 50)) + 10,
      percentage: (((Math.floor(Math.random() * (mainCount - 50)) + 10) / totalObservations) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Generate relevant observations count
  const relevantObservationsCount = Math.floor(Math.random() * 50) + 10;
  
  // Generate relevant observations list
  const relevantObservations = [
    `Strict control is not exercised over labeling issued for use in drug product labeling operations.`,
    `Failure to establish and follow adequate written procedures for ${CFR_CITATIONS[mainCFR].toLowerCase()} in ${programArea.toLowerCase()} manufacturing.`,
    `Inadequate documentation and record keeping procedures as required by ${mainCFR}.`,
    `Quality control unit failed to review and approve procedures related to ${CFR_CITATIONS[mainCFR].toLowerCase()}.`,
    `Missing or incomplete batch records demonstrating compliance with ${mainCFR} requirements.`,
    `Insufficient validation data to support procedures under ${mainCFR}.`
  ];

  // Generate CAPA with structured headings
  const capaData = {
    immediateActions: [
      `Initiate immediate cleaning and disinfection of the affected aseptic processing areas and equipment using validated procedures.`,
      `Restrict access to the aseptic processing areas until cleaning and disinfection are verified as complete.`,
      `Conduct a visual inspection to confirm that cleaning and disinfection procedures have been executed as per established protocols.`
    ],
    extensiveInvestigation: [
      `Evaluate the current cleaning and disinfection procedures for adequacy and compliance with established protocols.`,
      `Review training records of personnel involved in cleaning and disinfection to identify potential gaps in knowledge or execution.`,
      `Assess the cleaning and disinfection equipment and materials for suitability and effectiveness in achieving aseptic conditions.`,
      `Investigate historical data for any previous deficiencies or trends related to cleaning and disinfection practices in aseptic areas.`
    ],
    correctiveActions: [
      `Revise cleaning and disinfection procedures to ensure they meet regulatory requirements and industry best practices.`,
      `Implement a retraining program for all personnel involved in cleaning and disinfection of aseptic processing areas, emphasizing compliance and proper techniques.`,
      `Establish a verification process to ensure that cleaning and disinfection are performed as per the revised procedures, including documentation of results.`
    ],
    preventiveActions: [
      `Develop and implement a routine audit schedule for cleaning and disinfection practices in aseptic processing areas to ensure ongoing compliance.`,
      `Introduce a risk assessment process to evaluate and mitigate potential future deficiencies in cleaning and disinfection practices.`,
      `Establish a continuous training program for personnel on aseptic processing and cleaning/disinfection protocols, incorporating periodic refresher courses.`
    ],
    capaEffectivenessMonitoring: [
      `Monitor and review cleaning and disinfection records for compliance with revised procedures over a defined period.`,
      `Conduct quarterly audits of aseptic processing areas to assess adherence to cleaning and disinfection protocols and identify any deviations.`,
      `Evaluate training effectiveness through assessments and feedback from personnel involved in cleaning and disinfection activities.`,
      `Report findings and trends to management on a regular basis to ensure ongoing oversight and improvement of aseptic processing conditions.`
    ]
  };

  return [{
    id: 1,
    userObservation: observation,
    citationNumber: `21 CFR ${mainCFR}(a)`,
    citationLink: `https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-G/section-211.${mainCFR.split('.')[1]}`,
    citationDescription: CFR_CITATIONS[mainCFR],
    count: mainCount,
    percentage: mainPercentage,
    relevantObservationsCount: relevantObservationsCount,
    relevantObservations: relevantObservations,
    capaData: capaData,
    fullDescription: `This observation relates to ${CFR_CITATIONS[mainCFR].toLowerCase()} in the context of ${programArea.toLowerCase()} manufacturing. The issue involves ${observation.toLowerCase()}. This is a common finding in FDA 483 inspections and requires immediate attention to ensure compliance with current Good Manufacturing Practice (cGMP) regulations.`
  }];
};

const ObservationAnalysis = () => {
  const [programArea, setProgramArea] = useState('');
  const [system, setSystem] = useState('');
  const [establishment, setEstablishment] = useState(''); 
  const [observation, setObservation] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedCapa, setExpandedCapa] = useState(null);
  const [expandedObservations, setExpandedObservations] = useState(null);

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
                    <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-300">
                      Sr. No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-r border-blue-300">
                      Observation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-r border-blue-300">
                      Citation
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider border-r border-blue-300">
                      Citation Frequency %, Count
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-r border-blue-300">
                      Similar Observations
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      CAPA
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.map((result, index) => (
                    <>
                      <tr 
                        key={result.id}
                        className="hover:bg-blue-50 transition-colors"
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
                            className="inline-flex items-center justify-center text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1.5 rounded shadow-md hover:from-blue-600 hover:to-blue-700 transition-colors cursor-pointer"
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
                              className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center space-x-1 hover:underline w-fit"
                            >
                              <span>View Details</span>
                              <span className="text-blue-500">→</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCapa(expandedCapa === result.id ? null : result.id);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center space-x-1 hover:underline"
                          >
                            <span>View Details</span>
                            <span className="text-blue-500">→</span>
                          </button>
                        </td>
                      </tr>
                      {/* Expanded Similar Observations */}
                      {expandedObservations === result.id && (
                        <tr>
                          <td colSpan="6" className="px-6 py-6 bg-gray-50">
                            <div className="bg-white p-5 rounded-xl border border-gray-200">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                  <AlertCircle className="w-5 h-5 text-orange-600" />
                                  <h3 className="font-bold text-gray-900 text-lg">Similar Observations</h3>
                                </div>
                                <button 
                                  onClick={() => setExpandedObservations(null)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="space-y-3 max-h-96 overflow-y-auto">
                                {result.relevantObservations.map((obs, idx) => (
                                  <div key={idx} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                                    <p className="text-sm text-gray-700">{obs}</p>
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
                          <td colSpan="6" className="px-6 py-6 bg-gray-50">
                            <div className="bg-white p-5 rounded-xl border border-gray-200">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                  <h3 className="font-bold text-gray-900 text-lg">Corrective & Preventive Actions (CAPA)</h3>
                                </div>
                                <button 
                                  onClick={() => setExpandedCapa(null)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="space-y-6">
                                {/* Immediate Actions */}
                                <div>
                                  <h4 className="font-bold text-gray-800 mb-3 text-base border-b border-gray-300 pb-2">Immediate Actions</h4>
                                  <div className="space-y-2">
                                    {result.capaData.immediateActions.map((action, idx) => (
                                      <div key={idx} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                                        <CheckCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">{action}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Extensive Investigation - Probable Contributing Factors */}
                                <div>
                                  <h4 className="font-bold text-gray-800 mb-3 text-base border-b border-gray-300 pb-2">Extensive Investigation - Probable Contributing Factors</h4>
                                  <div className="space-y-2">
                                    {result.capaData.extensiveInvestigation.map((action, idx) => (
                                      <div key={idx} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                                        <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">{action}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Corrective Actions */}
                                <div>
                                  <h4 className="font-bold text-gray-800 mb-3 text-base border-b border-gray-300 pb-2">Corrective Actions</h4>
                                  <div className="space-y-2">
                                    {result.capaData.correctiveActions.map((action, idx) => (
                                      <div key={idx} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">{action}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Preventive Actions */}
                                <div>
                                  <h4 className="font-bold text-gray-800 mb-3 text-base border-b border-gray-300 pb-2">Preventive Actions</h4>
                                  <div className="space-y-2">
                                    {result.capaData.preventiveActions.map((action, idx) => (
                                      <div key={idx} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                                        <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">{action}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* CAPA Effectiveness Monitoring */}
                                <div>
                                  <h4 className="font-bold text-gray-800 mb-3 text-base border-b border-gray-300 pb-2">CAPA Effectiveness Monitoring</h4>
                                  <div className="space-y-2">
                                    {result.capaData.capaEffectivenessMonitoring.map((action, idx) => (
                                      <div key={idx} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">{action}</p>
                                      </div>
                                    ))}
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

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <span className="font-semibold">*Citation frequency % (Citation count)</span> – calculated based on data between 2007 & 2025.
            </p>
            <p>
              <span className="font-semibold">*Relevant Observations</span> – available observations between 2007 & 2025 from respective citation count.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservationAnalysis;

