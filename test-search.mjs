import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, 'amazon-products.csv');
console.log('Loading from:', csvPath);
console.log('File exists:', fs.existsSync(csvPath));

const csvData = fs.readFileSync(csvPath, 'utf-8');
console.log('CSV data length:', csvData.length);

const parsed = Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true,
});

console.log('\nTotal rows parsed:', parsed.data.length);
console.log('First 2 product titles:');
console.log('1:', parsed.data[0]?.title);
console.log('2:', parsed.data[1]?.title);

// Test simple shoe search
const shoes = parsed.data.filter(p => {
  const title = (p.title || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  return title.includes('shoe') || desc.includes('shoe');
});

console.log('\nShoe products found:', shoes.length);
if (shoes.length > 0) {
  console.log('First 3 shoes:');
  shoes.slice(0, 3).forEach(s => console.log('-', s.title));
}

// Test running products
const running = parsed.data.filter(p => {
  const title = (p.title || '').toLowerCase();
  return title.includes('running');
});
console.log('\nRunning products found:', running.length);
if (running.length > 0) {
  console.log('First 3 running:');
  running.slice(0, 3).forEach(s => console.log('-', s.title));
}

// Test waterproof
const waterproof = parsed.data.filter(p => {
  const title = (p.title || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  return title.includes('waterproof') || desc.includes('waterproof');
});
console.log('\nWaterproof products found:', waterproof.length);
if (waterproof.length > 0) {
  console.log('First 3 waterproof:');
  waterproof.slice(0, 3).forEach(s => console.log('-', s.title));
}
