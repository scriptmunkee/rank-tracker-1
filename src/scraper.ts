import axios from 'axios';
import cheerio from 'cheerio';

interface SearchResult {
  rank: number;
  title: string;
  url: string;
  snippet: string;
}

async function scrapeSearchResults(keyword: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  try {
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=100`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);

    $('.g').each((index, element) => {
      const title = $(element).find('h3').text();
      const url = $(element).find('a').attr('href');
      const snippet = $(element).find('.s').text();

      results.push({
        rank: index + 1,
        title,
        url: url || '',
        snippet,
      });
    });
  } catch (error) {
    console.error(`Error scraping results for keyword "${keyword}":`, error);
  }

  return results;
}

// Add a delay function for rate limiting
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export { scrapeSearchResults, SearchResult, delay };