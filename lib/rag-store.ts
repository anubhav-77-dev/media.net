import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

interface Product {
  title: string;
  brand: string;
  description: string;
  seller_name: string;
  final_price: string;
  availability: string;
  categories: string;
  rating: string;
  reviews_count: string;
  url: string;
  image_url: string;
  department: string;
  [key: string]: string;
}

let productsCache: Product[] | null = null;

function loadProducts(): Product[] {
  if (productsCache) {
    return productsCache;
  }

  const csvPath = path.join(process.cwd(), 'amazon-products.csv');
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  
  const parsed = Papa.parse<Product>(csvData, {
    header: true,
    skipEmptyLines: true,
  });

  productsCache = parsed.data;
  return productsCache;
}

// Simple text similarity scoring
function calculateRelevance(text: string, query: string): number {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  
  let score = 0;
  
  // Exact phrase match (highest score)
  if (textLower.includes(queryLower)) {
    score += 10;
  }
  
  // Word matches
  for (const word of queryWords) {
    if (word.length < 2) continue; // Skip very short words like "a", "to", etc
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = textLower.match(regex);
    if (matches) {
      score += matches.length * 2;
    }
  }
  
  return score;
}

export interface SearchResult {
  product: Product;
  relevance: number;
}

export function searchKnowledge(query: string, limit: number = 5): SearchResult[] {
  const products = loadProducts();
  
  // Score each product based on relevance to query
  const scored = products
    .map(product => {
    let relevance = 0;
    
    // Search in different fields with different weights
    relevance += calculateRelevance(product.title || '', query) * 3;
    relevance += calculateRelevance(product.description || '', query) * 2;
    relevance += calculateRelevance(product.brand || '', query) * 2;
    relevance += calculateRelevance(product.categories || '', query) * 1.5;
    relevance += calculateRelevance(product.department || '', query) * 1;
    
    return { product, relevance };
  });
  
  // Filter and sort by relevance
  let results = scored
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
  
  // If no results, try a more lenient search with shorter words
  if (results.length === 0) {
    results = scored
      .filter(item => {
        const query_lower = query.toLowerCase();
        const title_lower = (item.product.title || '').toLowerCase();
        const brand_lower = (item.product.brand || '').toLowerCase();
        const dept_lower = (item.product.department || '').toLowerCase();
        
        // Try matching any significant word (2+ chars)
        const words = query_lower.split(/\s+/).filter(w => w.length >= 2);
        return words.some(word => 
          title_lower.includes(word) || 
          brand_lower.includes(word) || 
          dept_lower.includes(word)
        );
      })
      .sort((a, b) => (b.product.title || '').length - (a.product.title || '').length)
      .slice(0, limit);
  }
  
  return results;
}

export function getProductStats() {
  const products = loadProducts();
  
  const brands = new Set(products.map(p => p.brand).filter(Boolean));
  const categories = new Set();
  
  products.forEach(p => {
    if (p.categories) {
      try {
        const cats = JSON.parse(p.categories);
        cats.forEach((cat: string) => categories.add(cat));
      } catch (e) {
        // Ignore parsing errors
      }
    }
  });
  
  return {
    totalProducts: products.length,
    totalBrands: brands.size,
    totalCategories: categories.size,
    sampleBrands: Array.from(brands).slice(0, 10),
  };
}

// Policy information (hardcoded for MVP - can be moved to a separate file)
export const POLICIES = {
  returns: `Our return policy allows returns within 30 days of delivery. Items must be unused and in original packaging. Return shipping is free for defective items. For non-defective returns, a return shipping fee may apply. Refunds are processed within 5-7 business days after we receive your return.`,
  
  shipping: `We offer free standard shipping on orders over $25. Standard shipping takes 5-7 business days. Expedited shipping (2-3 days) and express shipping (1-2 days) are available for an additional fee. We ship to all 50 states and select international locations.`,
  
  warranty: `Most electronics come with manufacturer warranties ranging from 90 days to 2 years. Extended warranty options are available at checkout. Clothing and soft goods have a 30-day satisfaction guarantee.`,
  
  payment: `We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Amazon Pay. Payment is processed securely at checkout.`,
};

export function searchPolicies(query: string): string | null {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('return') || queryLower.includes('refund')) {
    return POLICIES.returns;
  }
  
  if (queryLower.includes('ship') || queryLower.includes('delivery') || queryLower.includes('arrive')) {
    return POLICIES.shipping;
  }
  
  if (queryLower.includes('warrant') || queryLower.includes('guarantee')) {
    return POLICIES.warranty;
  }
  
  if (queryLower.includes('payment') || queryLower.includes('pay') || queryLower.includes('credit card')) {
    return POLICIES.payment;
  }
  
  return null;
}
