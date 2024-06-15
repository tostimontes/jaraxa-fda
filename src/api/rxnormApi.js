import axios from 'axios';

const RXNORM_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

export const getSuggestionsFromRxNorm = async (term) => {
  try {
    const response = await axios.get(
      `${RXNORM_BASE_URL}/approximateTerm.json`,
      {
        params: {
          term,
          maxEntries: 10,
        },
      },
    );

    const candidates = response.data.approximateGroup.candidate || [];

    const uniqueNames = new Set();
    const suggestions = candidates
      .filter((candidate) => candidate.name)
      .map((candidate) => candidate.name.toLowerCase())
      .filter((name) => {
        if (uniqueNames.has(name)) {
          return false;
        }
        uniqueNames.add(name);
        return true;
      })
      .slice(0, 5);

    return suggestions;
  } catch (error) {
    console.error('Error fetching suggestions from RxNorm API:', error);
    throw error;
  }
};
