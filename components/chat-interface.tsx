'use client';

import { useChat } from 'ai/react';
import { Send, Upload, X, Loader2, Bot, User, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
import { TrackingCard } from './tracking-card';
import { ResolutionOptions } from './resolution-options';
import { ProductCarousel } from './product-carousel';
import { KnowledgeAnswer } from './knowledge-answer';

interface ToolResult {
  type: 'tracking_card' | 'resolution_options' | 'product_carousel' | 'error' | 'knowledge_answer' | 'rejection_notice';
  data?: Record<string, any>;
  message?: string;
}

function renderToolResult(tool: any): React.ReactNode {
  const result = tool.result as ToolResult;

  if (typeof result === 'string') {
    return <div className="text-sm text-gray-700">{result}</div>;
  }

  if (!result || !result.type) {
    return null;
  }

  // Handle error responses
  if (result.type === 'error') {
    return <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded">{result.message}</div>;
  }

  // Handle knowledge answers
  if (result.type === 'knowledge_answer') {
    return <KnowledgeAnswer message={result.message || ''} matches={(result as any).matches} />;
  }

  if (result.type === 'rejection_notice') {
    const data: any = result.data || {};
    const vision = data.visionAnalysis || {};
    const flags: string[] = data.suspiciousFlags || [];
    return (
      <div className="w-full max-w-3xl bg-red-50 border border-red-200 rounded-xl p-4 text-red-900 shadow-sm">
        <div className="flex items-start gap-3">
          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="font-semibold text-lg">Return Rejected - AI Image Detected</div>
            <div className="text-sm">Order: {data.orderId || 'N/A'} | Reason: {data.reason || 'N/A'}</div>
            <div className="text-sm font-semibold">Recommendation: {vision.recommendation || 'Rejected due to AI-generated image.'}</div>
            <div className="text-sm">Trust Score: {data.trustScore ?? '0'}%</div>
            {vision.syntheticConfidence !== undefined && (
              <div className="text-sm">AI Confidence: {vision.syntheticConfidence}%</div>
            )}
            {flags.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="font-semibold text-sm">Indicators:</div>
                {flags.map((f, idx) => (
                  <div key={idx} className="text-sm">• {f}</div>
                ))}
              </div>
            )}
            <div className="mt-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg p-3">
              Please upload a genuine photo of the item and damage (no AI-generated or edited images) to proceed with the return.
            </div>
          </div>
        </div>
      </div>
    );
  }

  switch (result.type) {
    case 'tracking_card':
      return (
        <TrackingCard
          orderId={result.data?.orderId}
          status={result.data?.status}
          currentLocation={result.data?.currentLocation}
          estimatedDelivery={result.data?.estimatedDelivery}
          trackingNumber={result.data?.trackingNumber}
          items={result.data?.items}
        />
      );

    case 'resolution_options':
      return (
        <ResolutionOptions
          orderId={result.data?.orderId}
          orderValue={result.data?.orderValue}
          defectSeverity={result.data?.defectSeverity}
          reason={result.data?.reason}
          suspiciousFlags={result.data?.suspiciousFlags}
          trustScore={result.data?.trustScore}
          visionAnalysis={result.data?.visionAnalysis}
          onSelect={(option) => {
            console.log('Selected resolution:', option);
          }}
        />
      );

    case 'product_carousel':
      return (
        <ProductCarousel
          products={result.data?.products}
          onAddToCart={(productId) => {
            console.log('Added to cart:', productId);
          }}
        />
      );

    default:
      return null;
  }
}

export function ChatInterface() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [messageImages, setMessageImages] = useState<Map<string, string>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      image: uploadedImage,
    },
    onFinish: (message) => {
      // Store image with message if one was uploaded
      if (uploadedImage && message.id) {
        setMessageImages(new Map(messageImages.set(message.id, uploadedImage)));
      }
      // Clear image after message is sent
      setUploadedImage(null);
      setImagePreview(null);
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setUploadedImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && !uploadedImage) return;
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Support Agent</h1>
            <p className="text-xs text-gray-500">Always here to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Hi! How can I help you today?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                I can help you track orders, process returns, or find products
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                <button
                  onClick={() => handleInputChange({ target: { value: "Where is my order?" } } as any)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  📦 Track my order
                </button>
                <button
                  onClick={() => handleInputChange({ target: { value: "I want to return an item" } } as any)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  🔄 Return an item
                </button>
                <button
                  onClick={() => handleInputChange({ target: { value: "Do you have waterproof jackets for Iceland?" } } as any)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  🔍 Find products
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                )}
              >
                {message.role === 'user' && messageImages.has(message.id) && (
                  <div className="mb-2">
                    <img
                      src={messageImages.get(message.id)}
                      alt="Uploaded"
                      className="w-32 h-32 rounded-lg object-cover border-2 border-white/30"
                    />
                    <p className="text-xs mt-1 opacity-75">📷 Image attached</p>
                  </div>
                )}
                
                {message.content && (
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                )}

                {message.toolInvocations?.map((tool) => (
                  <div key={tool.toolCallId} className="mt-3">
                    {tool.state === 'result' && (
                      <div className="not-prose">
                        {renderToolResult(tool)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Helper text for image upload */}
          {!uploadedImage && messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && 
           messages[messages.length - 1]?.content?.toLowerCase().includes('upload') && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm text-blue-800">
              <Upload className="w-4 h-4" />
              <span>Click the upload icon below to attach an image</span>
            </div>
          )}
          
          <form onSubmit={onSubmit} className="relative">
            {imagePreview && (
              <div className="mb-3 inline-flex items-center gap-3 p-2 pr-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="w-16 h-16 rounded-md object-cover border border-blue-300"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-blue-900 leading-tight">
                  <div className="font-semibold">Image attached</div>
                  <div className="text-xs text-blue-700">This image will be sent with your next message.</div>
                </div>
              </div>
            )}

            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                  disabled={isLoading}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                </label>
              </div>
              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !uploadedImage)}
                className={cn(
                  'px-5 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2',
                  'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600'
                )}
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
