import axios from 'axios';

export const searchProducts = async (query) => {
  try {
    // Calling our local proxy server on the current wifi network IP
    const response = await axios.get('http://192.168.137.242:3001/api/search', {
      params: { q: query }
    });
    
    return response.data.results || [];
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
