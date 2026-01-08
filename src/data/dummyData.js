// Dummy data generator for FDA 483 Observations

const PROGRAM_AREAS = ['Drugs', 'Food', 'Cosmetics', 'Biologics', 'Medical Devices', 'Veterinary', 'Tobacco'];
const SYSTEMS = ['Quality System', 'Laboratory Control System', 'Material System', 'Packaging and Labeling System', 'Production System', 'Facilities & Equipment System'];
const ESTABLISHMENT_TYPES = [
  'API Manufacturer',
  'Outsourcing Facility',
  'Sterile Drug Manufacturer',
  'Drug Product Manufacturer',
  'Blood Bank',
  'Producer of sterile drugs',
  'Sprout Grower',
  'Human and Veterinarian Drug Manufacturer'
];
const COUNTRIES = ['United States', 'India', 'China', 'Germany', 'Italy', 'France', 'United Kingdom', 'Canada', 'Japan', 'Brazil', 'Mexico', 'Spain', 'South Korea', 'Ireland', 'Switzerland'];
const CFR_NUMBERS = ['21 CFR 211', '21 CFR 212', '21 CFR 820', '21 CFR 11', '21 CFR 58', '21 CFR 600', '21 CFR 610', '21 CFR 1271'];
const INSPECTION_CLASSIFICATIONS = ['NAI', 'OAI', 'VAI'];

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
  const uniqueFacilities = new Set();
  const inspectorCounts = {};
  const inspectorWarningLetters = {};
  const inspectorCFRCounts = {};
  
  // Initialize inspector counts
  INSPECTOR_NAMES.forEach(name => {
    inspectorCounts[name] = 0;
    inspectorWarningLetters[name] = Math.floor(Math.random() * 50) + 5;
    inspectorCFRCounts[name] = {};
    CFR_NUMBERS.forEach(cfr => {
      inspectorCFRCounts[name][cfr] = Math.floor(Math.random() * 200) + 10;
    });
  });

  for (let i = 0; i < totalObservations; i++) {
    const feiNumber = `FEI${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
    const inspectorName = INSPECTOR_NAMES[Math.floor(Math.random() * INSPECTOR_NAMES.length)];
    const startDate = randomDate(2007, 2025);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 14) + 1);
    
    // Create weighted distribution for program areas to ensure variation
    const programAreaWeights = [0.35, 0.20, 0.10, 0.15, 0.12, 0.05, 0.03]; // Drugs gets most, others vary
    const random = Math.random();
    let cumulative = 0;
    let programArea = PROGRAM_AREAS[0];
    for (let j = 0; j < PROGRAM_AREAS.length; j++) {
      cumulative += programAreaWeights[j];
      if (random <= cumulative) {
        programArea = PROGRAM_AREAS[j];
        break;
      }
    }
    const system = SYSTEMS[Math.floor(Math.random() * SYSTEMS.length)];
    const companyName = generateCompanyName(i);
    const facilityId = `${companyName}-${Math.floor(Math.random() * 5) + 1}`;
    const establishmentType = ESTABLISHMENT_TYPES[Math.floor(Math.random() * ESTABLISHMENT_TYPES.length)];
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const classification = INSPECTION_CLASSIFICATIONS[Math.floor(Math.random() * INSPECTION_CLASSIFICATIONS.length)];
    const cfrNumber = CFR_NUMBERS[Math.floor(Math.random() * CFR_NUMBERS.length)];
    
    uniqueCompanies.add(companyName);
    uniqueFacilities.add(facilityId);
    inspectorCounts[inspectorName]++;

    observations.push({
      feiNumber,
      inspectorId: inspectorName,
      inspectionStartDate: startDate,
      inspectionEndDate: endDate,
      companyName,
      facilityId,
      programArea,
      system,
      establishmentType,
      country,
      classification,
      cfrNumber,
      longDescription: `Observation ${i + 1}: Failure to establish and follow adequate procedures for ${system.toLowerCase()} in ${programArea.toLowerCase()} manufacturing. This includes deficiencies in documentation, validation, and quality control measures.`
    });
  }

  return {
    observations,
    totalCompanies: uniqueCompanies.size,
    totalFacilities: uniqueFacilities.size,
    inspectorCounts,
    inspectorWarningLetters,
    inspectorCFRCounts
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

  // Year-wise observations by system
  const yearSystemData = [];
  for (let year = 2007; year <= 2025; year++) {
    const yearData = { year };
    SYSTEMS.forEach(system => {
      yearData[system] = observations.filter(
        obs => obs.system === system && obs.inspectionStartDate.getFullYear() === year
      ).length;
    });
    yearSystemData.push(yearData);
  }

  // Top investigators
  const topInvestigators = Object.entries(data.inspectorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ 
      name, 
      count,
      warningLetters: data.inspectorWarningLetters[name] || 0,
      topCFR: Object.entries(data.inspectorCFRCounts[name] || {})
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    }));

  // Establishment type counts
  const establishmentTypeCounts = {};
  ESTABLISHMENT_TYPES.forEach(type => {
    establishmentTypeCounts[type] = observations.filter(obs => obs.establishmentType === type).length;
  });

  // NAI/OAI/VAI counts for pharma
  const classificationCounts = {};
  INSPECTION_CLASSIFICATIONS.forEach(classification => {
    classificationCounts[classification] = observations.filter(
      obs => obs.classification === classification && obs.programArea === 'Drugs'
    ).length;
  });

  // Country-wise observation counts
  const countryCounts = {};
  COUNTRIES.forEach(country => {
    countryCounts[country] = observations.filter(obs => obs.country === country).length;
  });

  // CFR number usage counts
  const cfrCounts = {};
  CFR_NUMBERS.forEach(cfr => {
    cfrCounts[cfr] = observations.filter(obs => obs.cfrNumber === cfr).length;
  });

  // System-wise facility counts
  const systemFacilityCounts = {};
  SYSTEMS.forEach(system => {
    const facilities = new Set();
    observations.filter(obs => obs.system === system).forEach(obs => {
      facilities.add(obs.facilityId);
    });
    systemFacilityCounts[system] = facilities.size;
  });

  // System-wise year and facility breakdown
  const systemYearFacilityData = {};
  SYSTEMS.forEach(system => {
    systemYearFacilityData[system] = [];
    for (let year = 2007; year <= 2025; year++) {
      const yearObs = observations.filter(
        obs => obs.system === system && obs.inspectionStartDate.getFullYear() === year
      );
      const facilities = new Set(yearObs.map(obs => obs.facilityId));
      systemYearFacilityData[system].push({
        year,
        observations: yearObs.length,
        facilities: facilities.size
      });
    }
  });

  return {
    totalObservations: observations.length,
    totalCompanies: data.totalCompanies,
    totalFacilities: data.totalFacilities,
    programAreaCounts,
    programSystemCounts,
    systemTrends,
    yearSystemData,
    topInvestigators,
    establishmentTypeCounts,
    classificationCounts,
    countryCounts,
    cfrCounts,
    systemFacilityCounts,
    systemYearFacilityData,
    observations: observations.slice(0, 1000) // Return sample for display
  };
};


