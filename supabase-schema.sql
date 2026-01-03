-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('ordered', 'shipped', 'in_transit', 'delivered')),
    current_location VARCHAR(255),
    estimated_delivery DATE,
    tracking_number VARCHAR(100),
    order_date TIMESTAMP DEFAULT NOW(),
    items JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Products Table with Vector Support (for RAG)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_level INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    embedding VECTOR(1536), -- For OpenAI embeddings
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chats Table (for conversation history and risk scoring)
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]',
    risk_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_orders_user_email ON orders(user_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_tracking ON orders(tracking_number);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_chats_user_id ON chats(user_id);

-- Full-text search on products
CREATE INDEX idx_products_search ON products USING GIN (to_tsvector('english', name || ' ' || description));

-- Insert sample data
INSERT INTO orders (id, user_email, status, current_location, estimated_delivery, tracking_number, order_date, items) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'alex@example.com', 'in_transit', 'Memphis, TN', '2026-01-05', 'TRK789456123', '2025-12-28', 
 '[{"name": "Waterproof Hiking Jacket", "quantity": 1, "price": 159.99}, {"name": "Thermal Base Layer Set", "quantity": 1, "price": 89.99}]'::jsonb),
('550e8400-e29b-41d4-a716-446655440002', 'sarah@example.com', 'shipped', 'Chicago, IL', '2026-01-06', 'TRK123789456', '2025-12-30',
 '[{"name": "Trail Running Shoes", "quantity": 1, "price": 129.99}]'::jsonb),
('550e8400-e29b-41d4-a716-446655440003', 'john@example.com', 'delivered', 'San Francisco, CA', '2026-01-02', 'TRK456123789', '2025-12-25',
 '[{"name": "Insulated Water Bottle", "quantity": 2, "price": 34.99}]'::jsonb);

INSERT INTO products (id, name, description, price, stock_level, image_url) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Alpine Pro Waterproof Jacket', 
 'Premium 3-layer waterproof jacket perfect for Iceland adventures. Features breathable Gore-Tex fabric, adjustable hood, and multiple sealed pockets.',
 189.99, 45, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'),
('650e8400-e29b-41d4-a716-446655440002', 'Arctic Explorer Parka',
 'Ultra-warm insulated parka with waterproof outer shell. Designed for extreme cold weather conditions with synthetic down fill.',
 249.99, 23, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400'),
('650e8400-e29b-41d4-a716-446655440003', 'Storm Shield Rain Jacket',
 'Lightweight packable waterproof jacket. Perfect for travel with its compact design and full weather protection.',
 129.99, 67, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'),
('650e8400-e29b-41d4-a716-446655440004', 'Summit Thermal Base Layer',
 'Merino wool blend base layer for ultimate warmth and moisture wicking. Odor resistant and incredibly soft.',
 79.99, 89, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400'),
('650e8400-e29b-41d4-a716-446655440005', 'Glacier Hiking Boots',
 'Waterproof insulated hiking boots with superior grip. Designed for icy conditions and long treks.',
 199.99, 34, 'https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=400');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Public read access to products
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

-- Users can view their own orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (true); -- In production, add auth.email() = user_email

-- Users can view their own chats
CREATE POLICY "Users can view their own chats" ON chats
    FOR SELECT USING (true); -- In production, add auth.uid() = user_id
