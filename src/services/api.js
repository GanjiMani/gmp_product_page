/**
 * API service for GMP Dashboard
 * Handles all API calls to the backend
 */

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Fetch total observations count
 * @returns {Promise<{id: number, name: string, total: number}>}
 */
export const fetchTotalObservations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/total-observations`);
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
 * Fetch total cites inspected count
 * @returns {Promise<{id: number, name: string, total: number}>}
 */
export const fetchTotalCitesInspected = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/total-citesinspected`);
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
 * Fetch program area counts from database
 * @returns {Promise<Object>} Object with program area names as keys and counts as values
 */
export const fetchProgramAreaCounts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/program-area-counts`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching program area counts:', error);
    throw error;
  }
};

/**
 * Fetch inspection classifications (NAI, VAI, OAI) from database
 * @returns {Promise<{NAI: number, VAI: number, OAI: number}>}
 */
export const fetchInspectionClassifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/inspection-classifications`);
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
 * Fetch country-wise observation counts from database
 * @returns {Promise<Array<{name: string, count: number}>>}
 */
export const fetchCountrywiseCounts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/countrywise-counts`);
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
 * Fetch trend 483 data (year-wise observations and 483s) from database
 * @param {string} programArea - Program area filter
 * @param {string} system - System filter
 * @returns {Promise<Array<{year: number, observations: number, fda483s: number}>>}
 */
export const fetchTrend483Data = async (programArea, system) => {
  try {
    const params = new URLSearchParams();
    if (programArea) params.append('program_area', programArea);
    if (system) params.append('system', system);
    
    const response = await fetch(`${API_BASE_URL}/trend-483-data?${params.toString()}`);
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
 * Fetch observations and 483 warning letters for selected filters
 * @param {string} programArea - Program area filter
 * @param {string} system - System filter
 * @param {number} year - Year filter
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>}
 */
export const fetchTrend483Observations = async (programArea, system, year, limit = 50) => {
  try {
    const params = new URLSearchParams();
    if (programArea) params.append('program_area', programArea);
    if (system) params.append('system', system);
    if (year) params.append('year', year.toString());
    params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/trend-483-observations?${params.toString()}`);
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
