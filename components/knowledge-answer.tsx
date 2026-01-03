'use client';

interface SearchMatch {
  title: string;
  brand: string;
  price: string;
  rating: string;
  stock: boolean;
}

interface KnowledgeAnswerProps {
  message: string;
  matches?: SearchMatch[];
}

export function KnowledgeAnswer({ message, matches }: KnowledgeAnswerProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-700 mb-3">{message}</p>
      {matches && matches.length > 0 && (
        <div className="space-y-2">
          {matches.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <span className="font-semibold text-gray-700">{item.brand}</span>
                    <span className="text-gray-500">${item.price}</span>
                    {item.rating && <span>⭐ {item.rating}</span>}
                    <span className={item.stock ? 'text-green-600 font-medium' : 'text-gray-400'}>
                      {item.stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
