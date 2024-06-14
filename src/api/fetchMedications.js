import axios from 'axios';

const BASE_URL = 'https://api.fda.gov/drug/label.json';

export const fetchMedications = async (query, limit = 50) => {
  try {
    const url = `${BASE_URL}?api_key=${import.meta.env.OPENFDA_API_KEY}&search=${query}&limit=${limit}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from OpenFDA API:', error);
    throw error;
  }
};
