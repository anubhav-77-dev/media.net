'use client';

import { EmailConfirmation } from './email-confirmation';
import { TrackingCard } from './tracking-card';

interface OrderLookupResultProps {
  email: string;
  order?: {
    id: string;
    status: string;
    current_location: string;
    estimated_delivery: string;
    tracking_number: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  } | null;
}

export function OrderLookupResult({ email, order }: OrderLookupResultProps) {
  return (
    <div className="space-y-4">
      <EmailConfirmation email={email} />
      
      {order ? (
        <TrackingCard
          orderId={order.id}
          status={order.status}
          currentLocation={order.current_location}
          estimatedDelivery={order.estimated_delivery}
          trackingNumber={order.tracking_number}
          items={order.items}
        />
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            I couldn't find any orders associated with <strong>{email}</strong>. Please check the email address or contact support.
          </p>
        </div>
      )}
    </div>
  );
}
