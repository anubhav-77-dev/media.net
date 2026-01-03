'use client';

import { Mail, CheckCircle2 } from 'lucide-react';

interface EmailConfirmationProps {
  email: string;
}

export function EmailConfirmation({ email }: EmailConfirmationProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <p className="text-sm font-semibold text-gray-900">Email Confirmed</p>
          </div>
          <p className="text-sm text-gray-700 font-medium">{email}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-gray-600 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Looking up your orders...
        </p>
      </div>
    </div>
  );
}
