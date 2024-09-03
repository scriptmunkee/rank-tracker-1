import cron from 'node-cron';
import { scrapeSearchResults } from './scraper';
import { saveSearchResults } from './database';

const keywords = ['example keyword 1', 'example keyword 2']; // Add your keywords here

function startScheduler() {
  console.log('Starting scheduler...');
  
  // Run immediately
  runScraper();

  // Schedule daily runs
  cron.schedule('0 0 * * *', runScraper);
}

async function runScraper() {
  console.log('Running scraper...');
  for (const keyword of keywords) {
    const results = await scrapeSearchResults(keyword);
    await saveSearchResults(keyword, results);
    console.log(`Scraped and saved results for keyword: ${keyword}`);
  }
}

export { startScheduler };