'use client';

import { Package, Truck, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackingCardProps {
  orderId: string;
  status: 'ordered' | 'shipped' | 'in_transit' | 'delivered';
  currentLocation: string;
  estimatedDelivery: string;
  trackingNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const statusSteps = [
  { key: 'ordered', label: 'Ordered', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'in_transit', label: 'In Transit', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export function TrackingCard({
  orderId,
  status,
  currentLocation,
  estimatedDelivery,
  trackingNumber,
  items,
}: TrackingCardProps) {
  const currentStepIndex = statusSteps.findIndex((s) => s.key === status);
  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order Tracking</h3>
            <p className="text-sm text-gray-600 mt-0.5">Order #{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide">ETA</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(estimatedDelivery).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-8">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2',
                      isActive
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400',
                      isCurrent && 'ring-4 ring-blue-100'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <p
                    className={cn(
                      'mt-2 text-xs font-medium text-center',
                      isActive ? 'text-gray-900' : 'text-gray-500'
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Location */}
        <div className="mt-8 bg-gray-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Current Location</p>
              <p className="text-sm text-gray-600 mt-0.5">{currentLocation}</p>
              <p className="text-xs text-gray-500 mt-1">Tracking: {trackingNumber}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-900 mb-3">Items in this order</p>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-900">Total</p>
            <p className="text-base font-bold text-gray-900">${totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button className="w-full py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Report an Issue
        </button>
      </div>
    </div>
  );
}
