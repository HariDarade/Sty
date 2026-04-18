import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Proxy endpoint for SerpApi Google Shopping
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const SERP_API_KEY = process.env.SERP_API_KEY;
  if (!SERP_API_KEY) {
    return res.status(500).json({ error: 'SERP_API_KEY is not configured on the server.' });
  }

  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_shopping',
        q: q,
        hl: 'en',
        gl: 'us',
        api_key: SERP_API_KEY,
      }
    });
    
    // Only return the shopping results we care about
    const shoppingResults = response.data.shopping_results || [];
    res.json({ results: shoppingResults });
  } catch (error) {
    console.error('Error fetching from SerpAPI:', error);
    res.status(500).json({ error: 'Failed to fetch results from search engine' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Stylin' proxy server running on http://0.0.0.0:${PORT}`);
});
