// Dummy data generator for FDA 483 Observations

const PROGRAM_AREAS = ['Drugs', 'Food', 'Cosmetics', 'Biologics', 'Medical Devices', 'Veterinary', 'Tobacco'];
const SYSTEMS = ['Quality System', 'Laboratory Control System', 'Material System', 'Packaging and Labeling System', 'Production System', 'Facilities & Equipment System'];

// Generate dummy company names
const generateCompanyName = (index) => {
  const prefixes = ['Pharma', 'Bio', 'Med', 'Life', 'Health', 'Care', 'Global', 'National', 'Advanced', 'Innovative'];
  const suffixes = ['Solutions', 'Corp', 'Inc', 'Labs', 'Industries', 'Technologies', 'Systems', 'Group', 'Pharmaceuticals', 'Medical'];
  return `${prefixes[index % prefixes.length]} ${suffixes[Math.floor(index / prefixes.length) % suffixes.length]} ${index % 1000}`;
};

// Generate dummy inspector names
const INSPECTOR_NAMES = [
  'Justin A. Boyd', 'Pratik S Upadhyay', 'Saleem A. Akhtar', 'Yvins Dezan',
  'Arsen Karapetyan', 'Jose E. Melendez', 'Lata C. Mathew', 'Rajiv R Srivastava',
  'Jeffrey P Raimondi', 'Ko U Min', 'Sarah M. Johnson', 'Michael Chen',
  'David Rodriguez', 'Emily Williams', 'James Anderson', 'Lisa Thompson'
];

// Generate random date between 2007 and 2025
const randomDate = (start, end) => {
  const startDate = new Date(start, 0, 1);
  const endDate = new Date(end, 11, 31);
  const timeDiff = endDate - startDate;
  const randomTime = Math.random() * timeDiff;
  return new Date(startDate.getTime() + randomTime);
};

// Generate observations data
export const generateObservations = () => {
  const observations = [];
  const totalObservations = 261811;
  const uniqueCompanies = new Set();
  const inspectorCounts = {};
  
  // Initialize inspector counts
  INSPECTOR_NAMES.forEach(name => {
    inspectorCounts[name] = 0;
  });

  for (let i = 0; i < totalObservations; i++) {
    const feiNumber = `FEI${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
    const inspectorName = INSPECTOR_NAMES[Math.floor(Math.random() * INSPECTOR_NAMES.length)];
    const startDate = randomDate(2007, 2025);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 14) + 1);
    
    const programArea = PROGRAM_AREAS[Math.floor(Math.random() * PROGRAM_AREAS.length)];
    const system = SYSTEMS[Math.floor(Math.random() * SYSTEMS.length)];
    const companyName = generateCompanyName(i);
    
    uniqueCompanies.add(companyName);
    inspectorCounts[inspectorName]++;

    observations.push({
      feiNumber,
      inspectorId: inspectorName,
      inspectionStartDate: startDate,
      inspectionEndDate: endDate,
      companyName,
      programArea,
      system,
      longDescription: `Observation ${i + 1}: Failure to establish and follow adequate procedures for ${system.toLowerCase()} in ${programArea.toLowerCase()} manufacturing. This includes deficiencies in documentation, validation, and quality control measures.`
    });
  }

  return {
    observations,
    totalCompanies: uniqueCompanies.size,
    inspectorCounts
  };
};

// Pre-computed aggregated data for performance
export const getAggregatedData = () => {
  const data = generateObservations();
  const { observations } = data;

  // Program area counts
  const programAreaCounts = {};
  PROGRAM_AREAS.forEach(area => {
    programAreaCounts[area] = observations.filter(obs => obs.programArea === area).length;
  });

  // Program area + System counts
  const programSystemCounts = {};
  PROGRAM_AREAS.forEach(area => {
    programSystemCounts[area] = {};
    SYSTEMS.forEach(system => {
      programSystemCounts[area][system] = observations.filter(
        obs => obs.programArea === area && obs.system === system
      ).length;
    });
  });

  // System trends by year
  const systemTrends = {};
  SYSTEMS.forEach(system => {
    systemTrends[system] = {};
    for (let year = 2007; year <= 2025; year++) {
      systemTrends[system][year] = observations.filter(
        obs => obs.system === system && 
        obs.inspectionStartDate.getFullYear() === year
      ).length;
    }
  });

  // Top investigators
  const topInvestigators = Object.entries(data.inspectorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return {
    totalObservations: observations.length,
    totalCompanies: data.totalCompanies,
    programAreaCounts,
    programSystemCounts,
    systemTrends,
    topInvestigators,
    observations: observations.slice(0, 1000) // Return sample for display
  };
};


