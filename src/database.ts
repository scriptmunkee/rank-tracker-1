import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { SearchResult } from './scraper';

async function initializeDatabase() {
  const db = await open({
    filename: './ranktracker.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS search_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT,
      date TEXT,
      rank INTEGER,
      title TEXT,
      url TEXT,
      snippet TEXT
    )
  `);

  return db;
}
 
async function saveSearchResults(keyword: string, results: SearchResult[]) {
  const db = await initializeDatabase();
  const date = new Date().toISOString().split('T')[0];

  const stmt = await db.prepare(`
    INSERT INTO search_results (keyword, date, rank, title, url, snippet)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const result of results) {
    await stmt.run(keyword, date, result.rank, result.title, result.url, result.snippet);
  }

  await stmt.finalize();
  await db.close();
}

export { initializeDatabase, saveSearchResults };