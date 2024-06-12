import axios from 'axios';

const BASE_URL = 'https://api.fda.gov/drug/label.json';

export const fetchMedications = async (query, limit = 50) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        search: query,
        limit: limit,
        // skip: (page - 1) * limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from OpenFDA API:', error);
    throw error;
  }
};
