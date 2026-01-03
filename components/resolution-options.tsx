'use client';

import { Gift, CreditCard, Clock, Sparkles, AlertTriangle, CheckCircle, XCircle, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface VisionAnalysis {
  hasDamage: boolean;
  severity: 'none' | 'minor' | 'moderate' | 'severe';
  damageDescription: string;
  isSynthetic: boolean;
  syntheticConfidence: number;
  recommendation: string;
}

interface ResolutionOptionsProps {
  orderId: string;
  orderValue: number;
  defectSeverity: 'minor' | 'moderate' | 'severe';
  reason?: string;
  suspiciousFlags?: string[];
  trustScore?: number;
  visionAnalysis?: VisionAnalysis | null;
  onSelect: (option: 'store_credit' | 'refund') => void;
}

export function ResolutionOptions({
  orderId,
  orderValue,
  defectSeverity,
  reason,
  suspiciousFlags = [],
  trustScore = 100,
  visionAnalysis,
  onSelect,
}: ResolutionOptionsProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // Calculate bonus based on severity
  const bonusAmount = defectSeverity === 'severe' ? 15 : defectSeverity === 'moderate' ? 10 : 5;
  const storeCreditValue = orderValue + bonusAmount;

  const handleSelect = (option: 'store_credit' | 'refund') => {
    setSelected(option);
    setTimeout(() => {
      onSelect(option);
    }, 300);
  };

  // Determine if return should be flagged (more aggressive)
  const isFlaggedForReview = trustScore < 60 || suspiciousFlags.length > 0;
  const isRejected = (visionAnalysis?.syntheticConfidence && visionAnalysis.syntheticConfidence > 60) || trustScore < 40;

  // If AI-generated image detected, show rejection only - NO resolution options
  if (isRejected) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {/* Rejection Alert */}
        <div className="rounded-lg p-6 border-2 border-red-500 bg-red-50">
          <div className="flex items-start gap-4">
            <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-900 mb-3">
                ⛔ Return Request Rejected - AI-Generated Image Detected
              </h3>
              
              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 mb-4">
                <p className="font-semibold text-red-900 mb-2">🤖 AI-Generated Image Detected</p>
                <p className="text-sm text-red-800">
                  Confidence: <strong>{visionAnalysis?.syntheticConfidence}%</strong>
                </p>
              </div>

              {suspiciousFlags.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="font-semibold text-red-900 mb-2">Reasons for Rejection:</p>
                  {suspiciousFlags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-red-800 bg-red-50 p-2 rounded border border-red-200">
                      <span className="font-bold">•</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t-2 border-red-200 pt-4 mt-4">
                <p className="font-semibold text-red-900 mb-2">📋 Trust Score: {trustScore}%</p>
                <p className="text-sm text-red-800 font-medium bg-red-100 p-3 rounded border border-red-200">
                  {visionAnalysis?.recommendation}
                </p>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <p className="font-semibold text-yellow-900 mb-2">⚠️ Next Steps:</p>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Please upload an authentic photograph of the actual product and damage</li>
                  <li>Use a real camera or smartphone - no AI-generated or edited images</li>
                  <li>Include clear views of any damage or defects</li>
                  <li>Ensure natural lighting and authentic imperfections are visible</li>
                </ul>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  For assistance, please contact our support team with order #{orderId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Vision Analysis Alert */}
      {visionAnalysis && (
        <div className={cn(
          'rounded-lg p-4 border-2',
          isRejected ? 'border-red-300 bg-red-50' : isFlaggedForReview ? 'border-yellow-300 bg-yellow-50' : 'border-green-300 bg-green-50'
        )}>
          <div className="flex items-start gap-3">
            {isRejected ? (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            ) : isFlaggedForReview ? (
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                'font-semibold text-sm mb-2',
                isRejected ? 'text-red-900' : isFlaggedForReview ? 'text-yellow-900' : 'text-green-900'
              )}>
                {isRejected ? '🚨 Image Authentication Failed' : isFlaggedForReview ? '⚠️ Manual Review Required' : '✓ Image Verified'}
              </h4>
              
              {visionAnalysis.isSynthetic && (
                <div className="mb-3 p-3 bg-red-100 rounded border border-red-200">
                  <p className="text-sm font-semibold text-red-900 mb-1">🤖 AI-Generated Image Detected</p>
                  <p className="text-xs text-red-800">Confidence: {visionAnalysis.syntheticConfidence}%</p>
                </div>
              )}

              {visionAnalysis.hasDamage && !isRejected && (
                <div className="mb-3 p-3 bg-blue-100 rounded border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-1">📸 Damage Detected</p>
                  <p className="text-xs text-blue-800 line-clamp-2">{visionAnalysis.damageDescription}</p>
                </div>
              )}

              {suspiciousFlags.length > 0 && (
                <div className="space-y-1 mb-3">
                  {suspiciousFlags.map((flag, idx) => (
                    <p key={idx} className="text-xs font-medium text-red-700">• {flag}</p>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-opacity-30">
                <span className="text-xs font-medium">Trust Score: {trustScore}%</span>
                <span className="text-xs text-gray-600">{visionAnalysis.recommendation}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Return Resolution Options
        </h3>
        <p className="text-sm text-gray-600">
          We've reviewed your return request for order #{orderId}. Please choose your preferred
          resolution below.
        </p>
        {reason && (
          <p className="text-xs text-gray-500 mt-2">Reason: {reason}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Store Credit Option - RECOMMENDED */}
        <button
          onClick={() => handleSelect('store_credit')}
          className={cn(
            'relative bg-white rounded-2xl border-2 p-6 text-left transition-all duration-300 hover:shadow-lg',
            selected === 'store_credit'
              ? 'border-green-500 ring-4 ring-green-100 scale-[1.02]'
              : 'border-green-300 hover:border-green-400'
          )}
        >
          {/* Best Value Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3" />
            Best Value
          </div>

          <div className="mt-2">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-green-600" />
            </div>

            {/* Title */}
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Instant Store Credit
            </h4>

            {/* Value */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-600">
                  ${storeCreditValue.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${orderValue.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-green-600 font-medium mt-1">
                Includes ${bonusAmount} bonus credit
              </p>
            </div>

            {/* Benefits */}
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Available immediately
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                No waiting for processing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Never expires
              </li>
            </ul>
          </div>
        </button>

        {/* Refund Option */}
        <button
          onClick={() => handleSelect('refund')}
          className={cn(
            'relative bg-white rounded-2xl border-2 p-6 text-left transition-all duration-300 hover:shadow-md',
            selected === 'refund'
              ? 'border-blue-500 ring-4 ring-blue-100 scale-[1.02]'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className="mt-2">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>

            {/* Title */}
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Original Payment Refund
            </h4>

            {/* Value */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${orderValue.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Refunded to original payment method
              </p>
            </div>

            {/* Benefits */}
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                5-7 business days processing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Return shipping required
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Full inspection process
              </li>
            </ul>
          </div>
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-gray-700">
          <span className="font-medium">💡 Tip:</span> Store credit gives you extra value and can
          be used immediately. Plus, we'll waive the return shipping!
        </p>
      </div>
    </div>
  );
}
