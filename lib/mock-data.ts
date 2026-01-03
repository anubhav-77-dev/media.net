import { Order, Product } from './supabase';

// Mock Orders Database
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2024-001',
    user_email: 'alex@example.com',
    status: 'in_transit',
    current_location: 'Memphis, TN',
    estimated_delivery: '2026-01-05',
    tracking_number: 'TRK789456123',
    order_date: '2025-12-28',
    items: [
      {
        name: 'Waterproof Hiking Jacket',
        quantity: 1,
        price: 159.99,
      },
      {
        name: 'Thermal Base Layer Set',
        quantity: 1,
        price: 89.99,
      },
    ],
  },
  {
    id: 'ORD-2024-002',
    user_email: 'sarah@example.com',
    status: 'shipped',
    current_location: 'Chicago, IL',
    estimated_delivery: '2026-01-06',
    tracking_number: 'TRK123789456',
    order_date: '2025-12-30',
    items: [
      {
        name: 'Trail Running Shoes',
        quantity: 1,
        price: 129.99,
      },
    ],
  },
  {
    id: 'ORD-2024-003',
    user_email: 'john@example.com',
    status: 'delivered',
    current_location: 'San Francisco, CA',
    estimated_delivery: '2026-01-02',
    tracking_number: 'TRK456123789',
    order_date: '2025-12-25',
    items: [
      {
        name: 'Insulated Water Bottle',
        quantity: 2,
        price: 34.99,
      },
    ],
  },
];

// Mock Products Database
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'PROD-001',
    name: 'Alpine Pro Waterproof Jacket',
    description: 'Premium 3-layer waterproof jacket perfect for Iceland adventures. Features breathable Gore-Tex fabric, adjustable hood, and multiple sealed pockets.',
    price: 189.99,
    stock_level: 45,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
  },
  {
    id: 'PROD-002',
    name: 'Arctic Explorer Parka',
    description: 'Ultra-warm insulated parka with waterproof outer shell. Designed for extreme cold weather conditions with synthetic down fill.',
    price: 249.99,
    stock_level: 23,
    image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
  },
  {
    id: 'PROD-003',
    name: 'Storm Shield Rain Jacket',
    description: 'Lightweight packable waterproof jacket. Perfect for travel with its compact design and full weather protection.',
    price: 129.99,
    stock_level: 67,
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
  },
  {
    id: 'PROD-004',
    name: 'Summit Thermal Base Layer',
    description: 'Merino wool blend base layer for ultimate warmth and moisture wicking. Odor resistant and incredibly soft.',
    price: 79.99,
    stock_level: 89,
    image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400',
  },
  {
    id: 'PROD-005',
    name: 'Glacier Hiking Boots',
    description: 'Waterproof insulated hiking boots with superior grip. Designed for icy conditions and long treks.',
    price: 199.99,
    stock_level: 34,
    image_url: 'https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=400',
  },
];

// Helper function to get order by email
export function getOrderByEmail(email: string): Order | null {
  const order = MOCK_ORDERS.find(
    (o) => o.user_email.toLowerCase() === email.toLowerCase()
  );
  return order || null;
}

// Helper function to search products
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}

// Simulate image analysis for returns
export function analyzeReturnImage(imageBase64: string): {
  defect_detected: boolean;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
} {
  // For MVP, we'll simulate this
  // In production, this would call OpenAI Vision API
  return {
    defect_detected: true,
    severity: 'moderate',
    description: 'Product shows visible signs of damage consistent with shipping issues. Packaging appears compromised.',
  };
}
