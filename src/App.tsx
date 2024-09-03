import React, { useState, useEffect } from 'react';
import { initializeDatabase } from './database';

interface SearchResult {
  id: number;
  keyword: string;
  date: string;
  rank: number;
  title: string;
  url: string;
  snippet: string;
}

function App() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    async function fetchData() {
      const db = await initializeDatabase();
      const fetchedKeywords = await db.all('SELECT DISTINCT keyword FROM search_results');
      setKeywords(fetchedKeywords.map(k => k.keyword));

      const latestResults = await db.all(`
        SELECT * FROM search_results
        WHERE (keyword, date) IN (
          SELECT keyword, MAX(date) 
          FROM search_results 
          GROUP BY keyword
        )
        ORDER BY keyword, rank
      `);
      setResults(latestResults);
      await db.close();
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Keyword Rank Tracker</h1>
      {keywords.map(keyword => (
        <div key={keyword}>
          <h2>{keyword}</h2>
          <ul>
            {results
              .filter(r => r.keyword === keyword)
              .map(result => (
                <li key={result.id}>
                  Rank {result.rank}: {result.title} - <a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a>
                </li>
              ))
            }
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;