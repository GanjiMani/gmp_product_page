/**
 * API service for GMP Dashboard
 * Handles all API calls to the backend
 */

const AZURE_BASE_URL = 'https://iidevgmpcomplianceai.azurewebsites.net';

export interface CountData {
  id: number;
  name: string;
  total: number;
}

export interface ProgramAreaCounts {
  [key: string]: number;
}

export interface InspectionClassifications {
  NAI: number;
  VAI: number;
  OAI: number;
}

export interface CountryCount {
  name: string;
  count: number;
}

export interface TrendFilters {
  program_areas: string[];
  systems: string[];
  years: number[];
}

export interface TrendData {
  year: number;
  observations: number;
  fda483s: number;
}

export interface ObservationRecord {
  [key: string]: any; // Specific fields not provided in original code
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface Investigator {
  id?: number;
  name?: string;
  count?: number;
  investigator_name?: string;
  total_inspections?: number;
  inspection_count?: number;
  countries_count?: number;
  inspected_countries?: string;
}

/**
 * Fetch total observations count
 * Uses deployed Azure API
 */
export const fetchTotalObservations = async (): Promise<CountData> => {
  try {
    const response = await fetch(`${AZURE_BASE_URL}/total-observations`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching total observations:', error);
    throw error;
  }
};

/**
 * Fetch total cites/sites inspected count
 * Uses deployed Azure API
 */
export const fetchTotalCitesInspected = async (): Promise<CountData> => {
  try {
    const response = await fetch(`${AZURE_BASE_URL}/total-citesinspected`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching total cites inspected:', error);
    throw error;
  }
};

/**
 * Fetch all counts (bonus endpoint)
 */
export const fetchAllCounts = async (): Promise<CountData[]> => {
  try {
    const response = await fetch(`${AZURE_BASE_URL}/all-counts`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all counts:', error);
    throw error;
  }
};

/**
 * Fetch program area counts for "Observations by Program Area"
 * Uses deployed Azure API
 */
export const fetchProgramAreaCounts = async (): Promise<ProgramAreaCounts> => {
  try {
    const response = await fetch(`${AZURE_BASE_URL}/all-counts`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CountData[] = await response.json();

    // Transform array into object keyed by program-area names,
    // excluding the overall totals
    const result: ProgramAreaCounts = {};
    data.forEach((item) => {
      if (item.name === 'total_observations' || item.name === 'total_citesinspected') {
        return;
      }
      result[item.name] = item.total;
    });

    return result;
  } catch (error) {
    console.error('Error fetching program area counts:', error);
    throw error;
  }
};

/**
 * Fetch inspection classifications (NAI, VAI, OAI)
 * Uses deployed Azure API
 */
export const fetchInspectionClassifications = async (): Promise<InspectionClassifications> => {
  try {
    const response = await fetch(`${AZURE_BASE_URL}/inspection-classifications`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching inspection classifications:', error);
    throw error;
  }
};

/**
 * Fetch country-wise observation counts
 * Uses deployed Azure API
 */
export const fetchCountrywiseCounts = async (): Promise<CountryCount[]> => {
  try {
    const response = await fetch(`${AZURE_BASE_URL}/countrywise-counts`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching country-wise counts:', error);
    throw error;
  }
};

/**
 * Fetch available filters for 483 trend (program areas, systems, years)
 * Uses deployed Azure API
 */
export const fetchTrend483AvailableFilters = async (): Promise<TrendFilters> => {
  try {
    const response = await fetch(`${AZURE_BASE_URL}/trend-483-available-filters`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trend 483 available filters:', error);
    throw error;
  }
};

/**
 * Fetch trend 483 data (year-wise observations and 483s)
 * Uses deployed Azure API
 */
export const fetchTrend483Data = async (programArea?: string, system?: string): Promise<TrendData[]> => {
  try {
    const params = new URLSearchParams();
    if (programArea) params.append('program_area', programArea);
    if (system) params.append('system', system);
    
    const response = await fetch(`${AZURE_BASE_URL}/trend-483-data?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Handle response wrapped in 'yearwisecount' property
    if (data && data.yearwisecount && Array.isArray(data.yearwisecount)) {
      return data.yearwisecount;
    }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching trend 483 data:', error);
    throw error;
  }
};

/**
 * Fetch observations and 483 warning letters for selected filters with pagination
 */
export const fetchTrend483Observations = async (
  programArea?: string, 
  system?: string, 
  year?: number, 
  page: number = 1, 
  pageSize: number = 10
): Promise<PaginatedResponse<ObservationRecord>> => {
  try {
    const params = new URLSearchParams();
    if (programArea) params.append('program_area', programArea);
    if (system) params.append('system', system);
    if (year) params.append('year', year.toString());
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());
    
    const response = await fetch(`${AZURE_BASE_URL}/trend-483-observations?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trend 483 observations:', error);
    throw error;
  }
};

export const fetchTotalInvestigators = async (): Promise<{count: number} | any> => {
  const res = await fetch(`${AZURE_BASE_URL}/total-investigators`);
  if (!res.ok) throw new Error('Failed to fetch total investigators');
  return res.json();
};

export const fetchInvestigators = async (name?: string): Promise<Investigator[]> => {
  const url = name ? `${AZURE_BASE_URL}/investigators?name=${encodeURIComponent(name)}` : `${AZURE_BASE_URL}/investigators`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch investigators');
  return res.json();
};
