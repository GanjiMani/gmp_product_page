/**
 * API service for GMP Dashboard
 * Handles all API calls to the backend
 */

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Fetch total observations count
 * Uses deployed Azure API:
 * https://iidevgmpcomplianceai.azurewebsites.net/api/total-observations
 * @returns {Promise<{id: number, name: string, total: number}>}
 */
export const fetchTotalObservations = async () => {
  try {
    const response = await fetch('https://iidevgmpcomplianceai.azurewebsites.net/api/total-observations');
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
 * Uses deployed Azure API:
 * https://iidevgmpcomplianceai.azurewebsites.net/api/total-citesinspected
 * @returns {Promise<{id: number, name: string, total: number}>}
 */
export const fetchTotalCitesInspected = async () => {
  try {
    const response = await fetch('https://iidevgmpcomplianceai.azurewebsites.net/api/total-citesinspected');
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
 * @returns {Promise<Array<{id: number, name: string, total: number}>>}
 */
export const fetchAllCounts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all-counts`);
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
 * Uses deployed Azure API:
 * https://iidevgmpcomplianceai.azurewebsites.net/api/all-counts
 * Returns an object with backend program-area keys -> counts
 * (e.g. { drugs: 39733, food: 149147, ... })
 */
export const fetchProgramAreaCounts = async () => {
  try {
    const response = await fetch('https://iidevgmpcomplianceai.azurewebsites.net/api/all-counts');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    /** @type {Array<{id: number, name: string, total: number}>} */
    const data = await response.json();

    // Transform array into object keyed by program-area names,
    // excluding the overall totals
    const result = {};
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
 * Uses deployed Azure API:
 * https://iidevgmpcomplianceai.azurewebsites.net/api/inspection-classifications
 * @returns {Promise<{NAI: number, VAI: number, OAI: number}>}
 */
export const fetchInspectionClassifications = async () => {
  try {
    const response = await fetch('https://iidevgmpcomplianceai.azurewebsites.net/api/inspection-classifications');
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
 * Uses deployed Azure API:
 * https://iidevgmpcomplianceai.azurewebsites.net/api/countrywise-counts
 * @returns {Promise<Array<{name: string, count: number}>>}
 */
export const fetchCountrywiseCounts = async () => {
  try {
    const response = await fetch('https://iidevgmpcomplianceai.azurewebsites.net/api/countrywise-counts');
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
 * Uses deployed Azure API:
 * https://iidevgmpcomplianceai.azurewebsites.net/api/trend-483-available-filters
 * @returns {Promise<{program_areas: string[], systems: string[], years: number[]}>}
 */
export const fetchTrend483AvailableFilters = async () => {
  try {
    const response = await fetch('https://iidevgmpcomplianceai.azurewebsites.net/api/trend-483-available-filters');
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
 * Uses deployed Azure API:
 * https://iidevgmpcomplianceai.azurewebsites.net/api/trend-483-data
 * @param {string} programArea - Program area filter
 * @param {string} system - System filter
 * @returns {Promise<Array<{year: number, observations: number, fda483s: number}>>}
 */
export const fetchTrend483Data = async (programArea, system) => {
  try {
    const params = new URLSearchParams();
    if (programArea) params.append('program_area', programArea);
    if (system) params.append('system', system);
    
    const response = await fetch(`https://iidevgmpcomplianceai.azurewebsites.net/api/trend-483-data?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trend 483 data:', error);
    throw error;
  }
};

/**
 * Fetch observations and 483 warning letters for selected filters with pagination
 * @param {string} programArea - Program area filter
 * @param {string} system - System filter
 * @param {number} year - Year filter
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Number of records per page (default: 10)
 * @returns {Promise<{data: Array, total: number, page: number, page_size: number, total_pages: number}>}
 */
export const fetchTrend483Observations = async (programArea, system, year, page = 1, pageSize = 10) => {
  try {
    const params = new URLSearchParams();
    if (programArea) params.append('program_area', programArea);
    if (system) params.append('system', system);
    if (year) params.append('year', year.toString());
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());
    
    const response = await fetch(`https://iidevgmpcomplianceai.azurewebsites.net/api/trend-483-observations?${params.toString()}`);
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
