'use client';

import { ShoppingCart, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_level: number;
  image_url: string;
}

interface ProductCarouselProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
}

export function ProductCarousel({ products, onAddToCart }: ProductCarouselProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Perfect Matches for You
        </h3>
        <p className="text-sm text-gray-600">
          Found {products.length} {products.length === 1 ? 'product' : 'products'} matching your needs
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Product Image */}
            <div className="relative w-full h-48 bg-gray-100">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
              {product.stock_level < 10 && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Only {product.stock_level} left
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                {product.name}
              </h4>
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* Price and Stock */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Package className="w-3 h-3" />
                  <span>{product.stock_level} in stock</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => onAddToCart?.(product.id)}
                className={cn(
                  'w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200',
                  'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]',
                  'flex items-center justify-center gap-2'
                )}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      {products.length > 2 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
            View all results →
          </button>
        </div>
      )}
    </div>
  );
}
