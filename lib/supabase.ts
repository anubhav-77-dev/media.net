import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export type OrderStatus = 'ordered' | 'shipped' | 'in_transit' | 'delivered';

export interface Order {
  id: string;
  user_email: string;
  status: OrderStatus;
  current_location: string;
  estimated_delivery: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  order_date: string;
  tracking_number: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_level: number;
  image_url: string;
}

export interface Chat {
  id: string;
  user_id: string;
  messages: any[];
  risk_score: number;
}
