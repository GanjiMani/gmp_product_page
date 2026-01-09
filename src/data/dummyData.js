// Dummy data generator for FDA 483 Observations

const PROGRAM_AREAS = ['Biologics', 'Bioresearch Monitoring', 'Devices', 'Foods', 'Drugs', 'Human Tissue for Transplantation', 'Part 11 Compliance', 'Parts 1240 and 1250', 'Radiologic Health', 'Veterinary Medicine'];
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
const COUNTRIES = [
  'United States', 'Spain', 'Greece', 'Korea (the Republic of)', 'China', 'India', 'Norway', 'Chile', 
  'Italy', 'Canada', 'Hungary', 'Japan', 'Belgium', 'Netherlands', 'Germany', 'France', 'Singapore', 
  'United Kingdom', 'Ireland', 'Australia', 'Poland', 'South Africa', 'Taiwan', 'Switzerland', 
  'Dominican Republic (the)', 'Vietnam', 'Mexico', 'Tunisia', 'Austria', 'Brazil', 'Peru', 'Denmark', 
  'Croatia', 'Thailand', 'Hong Kong SAR', 'Czech Republic', 'Turkey', 'Bulgaria', 'Ecuador', 'Portugal', 
  'Philippines', 'Slovenia', 'Armenia', 'Malaysia', 'Sweden', 'Romania', 'Slovakia', 'Argentina', 
  'Finland', 'New Zealand', 'Iceland', 'Indonesia', 'Luxembourg', 'Lithuania', 'Barbados', 'Panama', 
  'Fiji', 'Zimbabwe', 'Cambodia', 'Andorra', 'Ghana', 'Estonia', 'Colombia', 'Latvia', 
  'United Arab Emirates', 'Georgia', 'Costa Rica', 'Malta', 'Kuwait', 'Madagascar', 'Belize', 'Morocco', 
  'Kazakhstan', 'Sri Lanka', 'Albania', 'Uruguay', 'Macedonia', 'Kenya', 'Monaco', 'Swaziland', 'Serbia', 
  'Lesotho', 'Mauritius', 'Greenland', 'Malawi', 'Cuba', 'Namibia', 'Saint Lucia', 'Bosnia-Hercegovina', 
  'St. Vincent & The Grenadines', 'Jamaica', 'Honduras', 'Grenada', 'Trinidad & Tobago', 'Israel', 'Jordan', 
  'Mozambique', 'Oman', 'Bolivia', 'Bangladesh', 'Seychelles', 'Paraguay', 'Vanuatu', 'Suriname', 'Bahamas', 
  'Turks and Caicos Islands (the)', 'Guyana', 'Sierra Leone', 'Liberia', 'Guinea', 'Bahrain', 'Nicaragua', 
  'Cyprus', 'Maldives', 'Egypt', 'Ukraine', 'Congo (Brazzaville)', 'Ivory Coast', 'El Salvador', 'Belarus', 
  'Nigeria', 'Burma (Myanmar)', 'Faroe Islands', 'Guatemala', 'Western Samoa', 'Benin', 'Tonga', 'Cape Verde', 
  'Moldova', 'Senegal', 'Marshall Islands', 'Russia', 'Macao', 'Aruba', 'Cayman Islands', 'Liechtenstein', 
  'French Polynesia', 'Curacao', 'Saudi Arabia', 'Uganda', 'Gibraltar', 'Venezuela', 'Tanzania, United Republic Of'
];
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
  // Real program area counts
  const programAreaCounts = {
    'Biologics': 4653,
    'Bioresearch Monitoring': 7361,
    'Devices': 49917,
    'Foods': 149147,
    'Drugs': 39733,
    'Human Tissue for Transplantation': 4540,
    'Part 11 Compliance': 232,
    'Parts 1240 and 1250': 2777,
    'Radiologic Health': 585,
    'Veterinary Medicine': 10108
  };

  // Real country counts
  const countryCounts = {
    'United States': 277813,
    'Spain': 1712,
    'Greece': 399,
    'Korea (the Republic of)': 1677,
    'China': 5558,
    'India': 4431,
    'Norway': 234,
    'Chile': 533,
    'Italy': 2916,
    'Canada': 2230,
    'Hungary': 183,
    'Japan': 2275,
    'Belgium': 643,
    'Netherlands': 745,
    'Germany': 2852,
    'France': 2049,
    'Singapore': 279,
    'United Kingdom': 1865,
    'Ireland': 712,
    'Australia': 420,
    'Poland': 760,
    'South Africa': 349,
    'Taiwan': 1308,
    'Switzerland': 929,
    'Dominican Republic (the)': 350,
    'Vietnam': 686,
    'Mexico': 1294,
    'Tunisia': 21,
    'Austria': 259,
    'Brazil': 718,
    'Peru': 483,
    'Denmark': 412,
    'Croatia': 94,
    'Thailand': 1011,
    'Hong Kong SAR': 104,
    'Czech Republic': 207,
    'Turkey': 244,
    'Bulgaria': 233,
    'Ecuador': 358,
    'Portugal': 329,
    'Philippines': 431,
    'Slovenia': 69,
    'Armenia': 59,
    'Malaysia': 523,
    'Sweden': 462,
    'Romania': 142,
    'Slovakia': 34,
    'Argentina': 537,
    'Finland': 146,
    'New Zealand': 94,
    'Iceland': 127,
    'Indonesia': 588,
    'Luxembourg': 1,
    'Lithuania': 90,
    'Barbados': 18,
    'Panama': 96,
    'Fiji': 106,
    'Zimbabwe': 1,
    'Cambodia': 3,
    'Andorra': 2,
    'Ghana': 81,
    'Estonia': 24,
    'Colombia': 126,
    'Latvia': 71,
    'United Arab Emirates': 48,
    'Georgia': 43,
    'Costa Rica': 385,
    'Malta': 25,
    'Kuwait': 2,
    'Madagascar': 47,
    'Belize': 26,
    'Morocco': 107,
    'Kazakhstan': 2,
    'Sri Lanka': 193,
    'Albania': 16,
    'Uruguay': 56,
    'Macedonia': 43,
    'Kenya': 16,
    'Monaco': 7,
    'Swaziland': 4,
    'Serbia': 82,
    'Lesotho': 2,
    'Mauritius': 14,
    'Greenland': 1,
    'Malawi': 8,
    'Cuba': 7,
    'Namibia': 4,
    'Saint Lucia': 5,
    'Bosnia-Hercegovina': 10,
    'St. Vincent & The Grenadines': 9,
    'Jamaica': 190,
    'Honduras': 21,
    'Grenada': 16,
    'Trinidad & Tobago': 79,
    'Israel': 324,
    'Jordan': 51,
    'Mozambique': 5,
    'Oman': 9,
    'Bolivia': 34,
    'Bangladesh': 39,
    'Seychelles': 3,
    'Paraguay': 16,
    'Vanuatu': 1,
    'Suriname': 25,
    'Bahamas': 29,
    'Turks and Caicos Islands (the)': 2,
    'Guyana': 38,
    'Sierra Leone': 1,
    'Liberia': 1,
    'Guinea': 1,
    'Bahrain': 2,
    'Nicaragua': 76,
    'Cyprus': 32,
    'Maldives': 15,
    'Egypt': 9,
    'Ukraine': 74,
    'Congo (Brazzaville)': 4,
    'Ivory Coast': 12,
    'El Salvador': 28,
    'Belarus': 5,
    'Nigeria': 5,
    'Burma (Myanmar)': 7,
    'Faroe Islands': 4,
    'Guatemala': 220,
    'Western Samoa': 6,
    'Benin': 2,
    'Tonga': 2,
    'Cape Verde': 2,
    'Moldova': 10,
    'Senegal': 9,
    'Marshall Islands': 1,
    'Russia': 92,
    'Macao': 11,
    'Aruba': 1,
    'Cayman Islands': 1,
    'Liechtenstein': 2,
    'French Polynesia': 1,
    'Curacao': 3,
    'Saudi Arabia': 1,
    'Uganda': 1,
    'Gibraltar': 1,
    'Venezuela': 7,
    'Tanzania, United Republic Of': 3
  };

  // Real fiscal year data
  const fiscalYearData = [
    { year: 'Fiscal Year 2009', value: 17605 },
    { year: 'Fiscal Year 2010', value: 21522 },
    { year: 'Fiscal Year 2011', value: 25506 },
    { year: 'Fiscal Year 2012', value: 24785 },
    { year: 'Fiscal Year 2013', value: 21569 },
    { year: 'Fiscal Year 2014', value: 20443 },
    { year: 'Fiscal Year 2015', value: 20451 },
    { year: 'Fiscal Year 2016', value: 20751 },
    { year: 'Fiscal Year 2017', value: 21750 },
    { year: 'Fiscal Year 2018', value: 21653 },
    { year: 'Fiscal Year 2019', value: 19763 },
    { year: 'Fiscal Year 2020', value: 9766 },
    { year: 'Fiscal Year 2021', value: 8371 },
    { year: 'Fiscal Year 2022', value: 15614 },
    { year: 'Fiscal Year 2023', value: 18691 },
    { year: 'Fiscal Year 2024', value: 17021 },
    { year: 'Fiscal Year 2025', value: 18634 },
    { year: 'Fiscal Year 2026', value: 2307 }
  ];

  // NAI, VAI, OAI counts
  const classificationCounts = {
    'NAI': 210857,
    'VAI': 102812,
    'OAI': 12533
  };

  // Generate some sample data for other fields
  const data = generateObservations();
  const { observations } = data;

  // Program area + System counts (for compatibility, but won't be used in dashboard)
  const programSystemCounts = {};
  PROGRAM_AREAS.forEach(area => {
    programSystemCounts[area] = {};
    SYSTEMS.forEach(system => {
      programSystemCounts[area][system] = Math.floor(Math.random() * 1000);
    });
  });

  // System trends by year (for compatibility)
  const systemTrends = {};
  SYSTEMS.forEach(system => {
    systemTrends[system] = {};
    for (let year = 2007; year <= 2025; year++) {
      systemTrends[system][year] = Math.floor(Math.random() * 5000);
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

  // Establishment type counts (sample data for highest/lowest)
  const establishmentTypeCounts = {
    'Drug Product Manufacturer': 45000,
    'API Manufacturer': 38000,
    'Sterile Drug Manufacturer': 25000,
    'Outsourcing Facility': 15000,
    'Blood Bank': 8000,
    'Producer of sterile drugs': 5000,
    'Human and Veterinarian Drug Manufacturer': 3000,
    'Sprout Grower': 1000
  };

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
    totalObservations: 269054,
    totalCompanies: data.totalCompanies,
    totalFacilities: 115715,
    programAreaCounts,
    programSystemCounts,
    systemTrends,
    yearSystemData,
    topInvestigators,
    establishmentTypeCounts,
    classificationCounts,
    countryCounts,
    fiscalYearData,
    cfrCounts,
    systemFacilityCounts,
    systemYearFacilityData,
    observations: observations.slice(0, 1000) // Return sample for display
  };
};


